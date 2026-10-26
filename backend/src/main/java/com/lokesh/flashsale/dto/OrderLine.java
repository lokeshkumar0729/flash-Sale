package com.lokesh.flashsale.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

/** The client says what and how many. It never says how much: prices always come from the server. */
public record OrderLine(
        @NotNull(message = "Product is required") Long productId,
        @Min(value = 1, message = "Quantity must be at least 1") @Max(value = 10, message = "You can order at most 10 of one item") int quantity) {
}
