package com.lokesh.flashsale.service;

import com.lokesh.flashsale.dto.OrderResponse;

/** {@code created} is false when an Idempotency-Key matched an order that already exists. */
public record PlacedOrder(OrderResponse order, boolean created) {
}
