package com.lokesh.flashsale.dto;

import com.lokesh.flashsale.model.CustomerOrder;
import com.lokesh.flashsale.model.OrderItem;
import com.lokesh.flashsale.model.OrderStatus;
import com.lokesh.flashsale.model.PaymentMethod;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record OrderResponse(Long id, String orderNumber, OrderStatus status, boolean cancellable,
                            PaymentMethod paymentMethod, List<Item> items,
                            BigDecimal subtotal, BigDecimal savings, BigDecimal deliveryCharge, BigDecimal total,
                            ShippingAddress address, String customerName, String customerEmail,
                            Instant createdAt, Instant updatedAt) {

    public record Item(Long productId, boolean flashPrice, String name, String image,
                       BigDecimal unitPrice, BigDecimal originalPrice, int quantity) {
        static Item from(OrderItem i) {
            return new Item(i.getProductId(), i.getFlashSaleId() != null, i.getName(), i.getImage(),
                    i.getUnitPrice(), i.getOriginalPrice(), i.getQuantity());
        }
    }

    public static OrderResponse from(CustomerOrder o) {
        return new OrderResponse(o.getId(), o.getOrderNumber(), o.getStatus(), o.getStatus().isCancellable(),
                o.getPaymentMethod(), o.getItems().stream().map(Item::from).toList(),
                o.getSubtotal(), o.getSavings(), o.getDeliveryCharge(), o.getTotal(),
                new ShippingAddress(o.getFullName(), o.getPhone(), o.getEmail(), o.getAddressLine(),
                        o.getCity(), o.getState(), o.getPincode()),
                o.getUser().getName(), o.getUser().getEmail(), o.getCreatedAt(), o.getUpdatedAt());
    }
}
