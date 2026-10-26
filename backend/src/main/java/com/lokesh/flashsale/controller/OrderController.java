package com.lokesh.flashsale.controller;

import com.lokesh.flashsale.dto.OrderResponse;
import com.lokesh.flashsale.dto.PageResponse;
import com.lokesh.flashsale.dto.PlaceOrderRequest;
import com.lokesh.flashsale.dto.UpdateOrderStatusRequest;
import com.lokesh.flashsale.model.OrderStatus;
import com.lokesh.flashsale.service.OrderService;
import com.lokesh.flashsale.service.PlacedOrder;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
public class OrderController {

    private final OrderService orders;

    public OrderController(OrderService orders) {
        this.orders = orders;
    }

    /**
     * Send a fresh random Idempotency-Key per checkout attempt and reuse it when retrying.
     * 201 = order created; 200 = the key was already used and the original order is returned.
     */
    @PostMapping("/api/orders")
    public ResponseEntity<OrderResponse> place(@Valid @RequestBody PlaceOrderRequest request,
                                               @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey,
                                               Authentication auth) {
        PlacedOrder placed = orders.placeOrder(auth.getName(), request, idempotencyKey);
        return ResponseEntity.status(placed.created() ? HttpStatus.CREATED : HttpStatus.OK).body(placed.order());
    }

    @GetMapping("/api/orders")
    public PageResponse<OrderResponse> mine(@RequestParam(defaultValue = "0") int page,
                                            @RequestParam(defaultValue = "10") int size,
                                            Authentication auth) {
        return orders.myOrders(auth.getName(), page, size);
    }

    @GetMapping("/api/orders/{id}")
    public OrderResponse get(@PathVariable Long id, Authentication auth) {
        return orders.myOrder(auth.getName(), id);
    }

    @PostMapping("/api/orders/{id}/cancel")
    public OrderResponse cancel(@PathVariable Long id, Authentication auth) {
        return orders.cancelOwn(auth.getName(), id);
    }

    // ---- admin ---------------------------------------------------------------------------------------------

    @GetMapping("/api/admin/orders")
    public PageResponse<OrderResponse> adminList(@RequestParam(required = false) OrderStatus status,
                                                 @RequestParam(defaultValue = "0") int page,
                                                 @RequestParam(defaultValue = "10") int size) {
        return orders.adminOrders(status, page, size);
    }

    @PatchMapping("/api/admin/orders/{id}/status")
    public OrderResponse updateStatus(@PathVariable Long id, @Valid @RequestBody UpdateOrderStatusRequest request) {
        return orders.adminUpdateStatus(id, request.status());
    }
}
