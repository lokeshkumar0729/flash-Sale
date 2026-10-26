package com.lokesh.flashsale.api;

import com.lokesh.flashsale.dto.OrderLine;
import com.lokesh.flashsale.dto.PlaceOrderRequest;
import com.lokesh.flashsale.dto.ShippingAddress;
import com.lokesh.flashsale.exception.ApiException;
import com.lokesh.flashsale.model.*;
import com.lokesh.flashsale.repository.*;
import com.lokesh.flashsale.service.OrderService;
import com.lokesh.flashsale.service.PlacedOrder;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.IntFunction;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * The tests that matter most for a flash sale: many people hitting limited stock at the same moment.
 * Each thread is a different buyer (or the same buyer double-clicking) calling the real service, so every
 * guarantee below is enforced by the transaction and the database, not by test-friendly shortcuts.
 */
@SpringBootTest
@ActiveProfiles("test")
class CheckoutConcurrencyTest {

    private static final ShippingAddress ADDRESS = new ShippingAddress(
            "Test Buyer", "9876543210", "buyer@test.com", "12 Market Road", "Visakhapatnam", "Andhra Pradesh", "530001");

    @Autowired OrderService orderService;
    @Autowired UserRepository users;
    @Autowired ProductRepository products;
    @Autowired FlashSaleRepository flashSales;
    @Autowired OrderRepository orders;

    @BeforeEach
    void clean() {
        orders.deleteAll();
        flashSales.deleteAll();
        products.deleteAll();
        users.deleteAll();
    }

    @Test
    void flashSaleNeverSellsMoreUnitsThanItsQuantity() throws Exception {
        Product product = saveProduct(500);
        FlashSale sale = saveSale(product, 40, 2);
        List<User> buyers = saveCustomers(150);

        Outcome outcome = runConcurrently(buyers.size(), i -> () -> place(buyers.get(i), product, 1, "key-" + i));

        assertThat(outcome.succeeded).isEqualTo(40);
        assertThat(outcome.conflicts).isEqualTo(150 - 40);
        assertThat(outcome.unexpected).isEmpty();
        assertThat(flashSales.findById(sale.getId()).orElseThrow().getSold()).isEqualTo(40);
        assertThat(products.findById(product.getId()).orElseThrow().getStock()).isEqualTo(500 - 40);
        assertThat(orders.count()).isEqualTo(40);
    }

    @Test
    void regularStockIsNeverOversoldEither() throws Exception {
        Product product = saveProduct(25);
        List<User> buyers = saveCustomers(100);

        Outcome outcome = runConcurrently(buyers.size(), i -> () -> place(buyers.get(i), product, 1, "key-" + i));

        assertThat(outcome.succeeded).isEqualTo(25);
        assertThat(outcome.unexpected).isEmpty();
        assertThat(products.findById(product.getId()).orElseThrow().getStock()).isZero();
        assertThat(orders.count()).isEqualTo(25);
    }

    @Test
    void aDoubleClickWithTheSameKeyCreatesExactlyOneOrder() throws Exception {
        Product product = saveProduct(100);
        saveSale(product, 50, 5);
        User buyer = saveCustomers(1).get(0);

        List<Long> orderIds = new CopyOnWriteArrayList<>();
        Outcome outcome = runConcurrently(12, i -> () -> {
            PlacedOrder placed = place(buyer, product, 1, "same-key");
            orderIds.add(placed.order().id());
            return placed;
        });

        assertThat(outcome.unexpected).isEmpty();
        assertThat(outcome.succeeded).isEqualTo(12);          // every request got an answer...
        assertThat(orderIds.stream().distinct().count()).isEqualTo(1); // ...and it was always the same order
        assertThat(orders.count()).isEqualTo(1);
        assertThat(products.findById(product.getId()).orElseThrow().getStock()).isEqualTo(99);
    }

    @Test
    void oneCustomerCannotBeatThePerCustomerLimitByRacingRequests() throws Exception {
        Product product = saveProduct(100);
        saveSale(product, 50, 2);
        User buyer = saveCustomers(1).get(0);

        // different keys: these are genuinely different checkouts, fired at the same time
        Outcome outcome = runConcurrently(10, i -> () -> place(buyer, product, 1, "attempt-" + i));

        assertThat(outcome.unexpected).isEmpty();
        assertThat(outcome.succeeded).isEqualTo(2);
        assertThat(outcome.conflicts).isEqualTo(8);
        assertThat(orders.count()).isEqualTo(2);
    }

    @Test
    void cancellingReturnsStockAndFlashQuantityExactlyOnce() throws Exception {
        Product product = saveProduct(100);
        FlashSale sale = saveSale(product, 10, 5);
        User buyer = saveCustomers(1).get(0);

        Long orderId = place(buyer, product, 3, "k1").order().id();
        assertThat(products.findById(product.getId()).orElseThrow().getStock()).isEqualTo(97);
        assertThat(flashSales.findById(sale.getId()).orElseThrow().getSold()).isEqualTo(3);

        // five parallel cancel requests for the same order
        Outcome outcome = runConcurrently(5, i -> () -> orderService.cancelOwn(buyer.getEmail(), orderId));

        assertThat(outcome.unexpected).isEmpty();
        assertThat(products.findById(product.getId()).orElseThrow().getStock()).isEqualTo(100);
        assertThat(flashSales.findById(sale.getId()).orElseThrow().getSold()).isZero();
        assertThat(orders.findById(orderId).orElseThrow().getStatus()).isEqualTo(OrderStatus.CANCELLED);
    }

    // ---- helpers -------------------------------------------------------------------------------------------

    private PlacedOrder place(User buyer, Product product, int qty, String key) {
        PlaceOrderRequest request = new PlaceOrderRequest(
                List.of(new OrderLine(product.getId(), qty)), ADDRESS, PaymentMethod.COD);
        return orderService.placeOrder(buyer.getEmail(), request, key);
    }

    private Product saveProduct(int stock) {
        Product p = new Product();
        p.setName("Test Product");
        p.setCategory("Test");
        p.setPrice(new BigDecimal("1000.00"));
        p.setOriginalPrice(new BigDecimal("2000.00"));
        p.setStock(stock);
        p.getImages().add("https://example.com/p.png");
        return products.save(p);
    }

    private FlashSale saveSale(Product product, int quantity, int perUserLimit) {
        FlashSale s = new FlashSale();
        s.setProduct(product);
        s.setSalePrice(new BigDecimal("500.00"));
        s.setTotalQuantity(quantity);
        s.setPerUserLimit(perUserLimit);
        s.setStartsAt(Instant.now().minus(Duration.ofMinutes(5)));
        s.setEndsAt(Instant.now().plus(Duration.ofHours(1)));
        return flashSales.save(s);
    }

    private List<User> saveCustomers(int count) {
        List<User> list = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            list.add(users.save(new User("Buyer " + i, "buyer" + i + "@test.com", null, "x", Role.CUSTOMER)));
        }
        return list;
    }

    private record Outcome(int succeeded, int conflicts, List<Throwable> unexpected) {
    }

    /** Starts all tasks at the same instant and waits for them to finish. */
    private Outcome runConcurrently(int threads, IntFunction<Callable<Object>> taskFactory) throws Exception {
        ExecutorService pool = Executors.newFixedThreadPool(threads);
        CountDownLatch ready = new CountDownLatch(threads);
        CountDownLatch go = new CountDownLatch(1);
        List<Future<Object>> futures = new ArrayList<>();
        for (int i = 0; i < threads; i++) {
            Callable<Object> task = taskFactory.apply(i);
            futures.add(pool.submit(() -> {
                ready.countDown();
                go.await();
                return task.call();
            }));
        }
        ready.await();
        go.countDown();

        AtomicInteger succeeded = new AtomicInteger();
        AtomicInteger conflicts = new AtomicInteger();
        List<Throwable> unexpected = new ArrayList<>();
        for (Future<Object> f : futures) {
            try {
                f.get(60, TimeUnit.SECONDS);
                succeeded.incrementAndGet();
            } catch (ExecutionException e) {
                if (e.getCause() instanceof ApiException api && api.getStatus().value() == 409) {
                    conflicts.incrementAndGet();
                } else {
                    unexpected.add(e.getCause());
                }
            }
        }
        pool.shutdownNow();
        return new Outcome(succeeded.get(), conflicts.get(), unexpected);
    }
}
