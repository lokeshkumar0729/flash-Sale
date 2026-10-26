package com.lokesh.flashsale.dto;

import com.lokesh.flashsale.model.OrderStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateOrderStatusRequest(@NotNull(message = "Status is required") OrderStatus status) {
}
