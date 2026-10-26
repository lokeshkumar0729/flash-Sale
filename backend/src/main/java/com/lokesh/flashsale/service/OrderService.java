package com.lokesh.flashsale.service;

import com.lokesh.flashsale.dto.OrderLine;
import com.lokesh.flashsale.dto.OrderResponse;
import com.lokesh.flashsale.dto.PageResponse;
import com.lokesh.flashsale.dto.PlaceOrderRequest;
import com.lokesh.flashsale.dto.ShippingAddress;
import com.lokesh.flashsale.exception.ApiException;
import com.lokesh.flashsale.model.*;
import com.lokesh.flashsale.repository.FlashSaleRepository;
import com.lokesh.flashsale.repository.OrderRepository;
import com.lokesh.flashsale.repository.ProductRepository;
import com.lokesh.flashsale.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * Checkout is where a flash sale is won or lost, so the rules are deliberately boring and explicit:
 * <ol>
 *   <li>Lock the customer's row first. One customer's checkouts and cancellations then run one at a time,
 *       which makes the per-customer limit and the idempotency check race-free.</li>
 *   <li>Take stock with conditional UPDATE statements ("... WHERE stock >= :qty"). The database, not Java,
 *       decides who gets the last unit, so no amount of concurrency can oversell.</li>
 *   <li>Everything happens in one transaction: if any line fails, every claim made so far is rolled back.</li>
 *   <li>Lines are processed in product-id order so concurrent checkouts always touch rows in the same order
 *       and cannot deadlock each other.</li>
 * </ol>
 * READ_COMMITTED makes every statement see rows committed by earlier transactions even under MySQL's default
 * REPEATABLE READ, which matters for the "units this customer already holds" check.
 */
@Service
public class OrderService {

    private static final BigDecimal FREE_DELIVERY_FROM = new BigDecimal("999");
    private static final BigDecimal DELIVERY_CHARGE = new BigDecimal("49");
    private static final int MAX_QUANTITY_PER_ITEM = 10;
    private static final int MAX_KEY_LENGTH = 64;
    private static final String ORDER_NUMBER_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    private final UserRepository users;
    private final ProductRepository products;
    private final FlashSaleRepository flashSales;
    private final OrderRepository orders;
    private final SecureRandom random = new SecureRandom();

    public OrderService(UserRepository users, ProductRepository products,
                        FlashSaleRepository flashSales, OrderRepository orders) {
        this.users = users;
        this.products = products;
        this.flashSales = flashSales;
        this.orders = orders;
    }

    // ---- customer commands -----------------------------------------------------------------------------------

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public PlacedOrder placeOrder(String email, PlaceOrderRequest request, String idempotencyKey) {
        // The lock must be the first statement of the transaction (see class comment).
        User user = users.lockByEmail(email).orElseThrow(() -> ApiException.unauthorized("Account no longer exists"));

        String key = normalizeKey(idempotencyKey);
        if (key != null) {
            Optional<CustomerOrder> existing = orders.findWithItemsByUserIdAndIdempotencyKey(user.getId(), key);
            if (existing.isPresent()) {
                return new PlacedOrder(OrderResponse.from(existing.get()), false);
            }
        }

        // TreeMap = ascending product id, and duplicate cart lines are merged.
        Map<Long, Integer> quantities = new TreeMap<>();
        for (OrderLine line : request.items()) {
            quantities.merge(line.productId(), line.quantity(), Integer::sum);
        }

        Instant now = Instant.now();
        CustomerOrder order = new CustomerOrder();
        order.setUser(user);
        order.setPaymentMethod(request.paymentMethod());
        order.setIdempotencyKey(key);
        applyAddress(order, request.address());

        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal savings = BigDecimal.ZERO;

        for (Map.Entry<Long, Integer> entry : quantities.entrySet()) {
            long productId = entry.getKey();
            int qty = entry.getValue();
            if (qty > MAX_QUANTITY_PER_ITEM) {
                throw ApiException.badRequest("You can order at most " + MAX_QUANTITY_PER_ITEM + " of one item");
            }
            Product product = products.findByIdAndActiveTrue(productId)
                    .orElseThrow(() -> ApiException.badRequest("An item in your cart is no longer available"));

            BigDecimal unitPrice = product.getPrice();
            Long saleId = null;

            Optional<FlashSale> sale = flashSales.findClaimableByProduct(productId, now).stream().findFirst();
            if (sale.isPresent()) {
                FlashSale s = sale.get();
                long alreadyHeld = orders.unitsBoughtInSale(s.getId(), user.getId(), OrderStatus.CANCELLED);
                if (alreadyHeld + qty > s.getPerUserLimit()) {
                    throw ApiException.conflict(alreadyHeld >= s.getPerUserLimit()
                            ? "You have already bought the limit of " + s.getPerUserLimit() + " of " + product.getName() + " at the flash price"
                            : "You can buy " + (s.getPerUserLimit() - alreadyHeld) + " more of " + product.getName() + " at the flash price");
                }
                if (flashSales.claim(s.getId(), qty, now) == 0) {
                    throw ApiException.conflict("The flash deal for " + product.getName()
                            + " just sold out or has fewer than " + qty + " left. Review your cart and try again.");
                }
                unitPrice = s.getSalePrice();
                saleId = s.getId();
            }

            if (products.decrementStock(productId, qty) == 0) {
                throw ApiException.conflict("There is not enough stock of " + product.getName() + " for your quantity");
            }

            BigDecimal mrp = product.getOriginalPrice().max(unitPrice);
            BigDecimal quantity = BigDecimal.valueOf(qty);
            subtotal = subtotal.add(unitPrice.multiply(quantity));
            savings = savings.add(mrp.subtract(unitPrice).multiply(quantity));
            order.addItem(new OrderItem(productId, saleId, product.getName(),
                    product.getImages().isEmpty() ? null : product.getImages().get(0), unitPrice, mrp, qty));
        }

        BigDecimal delivery = subtotal.compareTo(FREE_DELIVERY_FROM) >= 0 ? BigDecimal.ZERO : DELIVERY_CHARGE;
        order.setSubtotal(subtotal);
        order.setSavings(savings);
        order.setDeliveryCharge(delivery);
        order.setTotal(subtotal.add(delivery));
        order.setOrderNumber(newOrderNumber());

        return new PlacedOrder(OrderResponse.from(orders.saveAndFlush(order)), true);
    }

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public OrderResponse cancelOwn(String email, Long orderId) {
        User user = users.lockByEmail(email).orElseThrow(() -> ApiException.unauthorized("Account no longer exists"));
        CustomerOrder order = orders.lockById(orderId)
                .filter(o -> o.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> ApiException.notFound("Order not found"));
        if (order.getStatus() == OrderStatus.CANCELLED) {
            return OrderResponse.from(order); // cancelling twice is harmless
        }
        if (!order.getStatus().isCancellable()) {
            throw ApiException.conflict("This order can no longer be cancelled");
        }
        cancel(order);
        return OrderResponse.from(order);
    }

    // ---- customer queries ------------------------------------------------------------------------------------

    @Transactional(readOnly = true)
    public PageResponse<OrderResponse> myOrders(String email, int page, int size) {
        User user = users.findByEmailIgnoreCase(email)
                .orElseThrow(() -> ApiException.unauthorized("Account no longer exists"));
        Page<CustomerOrder> result = orders.findByUserId(user.getId(),
                Paging.of(page, size, Sort.by(Sort.Order.desc("createdAt"), Sort.Order.desc("id"))));
        return PageResponse.from(result, OrderResponse::from);
    }

    @Transactional(readOnly = true)
    public OrderResponse myOrder(String email, Long orderId) {
        return orders.findWithItemsById(orderId)
                .filter(o -> o.getUser().getEmail().equalsIgnoreCase(email))
                .map(OrderResponse::from)
                .orElseThrow(() -> ApiException.notFound("Order not found"));
    }

    // ---- admin -----------------------------------------------------------------------------------------------

    @Transactional(readOnly = true)
    public PageResponse<OrderResponse> adminOrders(OrderStatus status, int page, int size) {
        var pageable = Paging.of(page, size, Sort.by(Sort.Order.desc("createdAt"), Sort.Order.desc("id")));
        Page<CustomerOrder> result = status == null ? orders.findAllBy(pageable) : orders.findByStatus(status, pageable);
        return PageResponse.from(result, OrderResponse::from);
    }

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public OrderResponse adminUpdateStatus(Long orderId, OrderStatus next) {
        CustomerOrder order = orders.lockById(orderId).orElseThrow(() -> ApiException.notFound("Order not found"));
        if (order.getStatus() == next) {
            return OrderResponse.from(order);
        }
        if (!order.getStatus().canTransitionTo(next)) {
            throw ApiException.conflict("An order that is " + label(order.getStatus()) + " cannot be moved to " + label(next));
        }
        if (next == OrderStatus.CANCELLED) {
            cancel(order);
        } else {
            order.setStatus(next);
        }
        return OrderResponse.from(order);
    }

    // ---- helpers ---------------------------------------------------------------------------------------------

    /** Returns the units to stock (and to the flash sale) and marks the order cancelled. */
    private void cancel(CustomerOrder order) {
        List<OrderItem> lines = new ArrayList<>(order.getItems());
        lines.sort(Comparator.comparing(OrderItem::getProductId)); // same lock order as checkout
        for (OrderItem item : lines) {
            if (item.getFlashSaleId() != null) {
                flashSales.release(item.getFlashSaleId(), item.getQuantity());
            }
            products.incrementStock(item.getProductId(), item.getQuantity());
        }
        order.setStatus(OrderStatus.CANCELLED);
    }

    private void applyAddress(CustomerOrder order, ShippingAddress a) {
        order.setFullName(a.fullName().trim());
        order.setPhone(a.phone().trim());
        order.setEmail(a.email().trim());
        order.setAddressLine(a.addressLine().trim());
        order.setCity(a.city().trim());
        order.setState(a.state().trim());
        order.setPincode(a.pincode().trim());
    }

    private String normalizeKey(String key) {
        if (key == null || key.isBlank()) {
            return null;
        }
        String trimmed = key.trim();
        if (trimmed.length() > MAX_KEY_LENGTH) {
            throw ApiException.badRequest("Idempotency-Key must be at most " + MAX_KEY_LENGTH + " characters");
        }
        return trimmed;
    }

    private String newOrderNumber() {
        StringBuilder suffix = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            suffix.append(ORDER_NUMBER_ALPHABET.charAt(random.nextInt(ORDER_NUMBER_ALPHABET.length())));
        }
        return "FS" + LocalDate.now(ZoneOffset.UTC).format(DateTimeFormatter.BASIC_ISO_DATE) + "-" + suffix;
    }

    private static String label(OrderStatus status) {
        return status.name().toLowerCase().replace('_', ' ');
    }
}
