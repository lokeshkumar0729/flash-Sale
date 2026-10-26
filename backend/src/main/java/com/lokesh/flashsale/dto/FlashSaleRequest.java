package com.lokesh.flashsale.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.Instant;

public record FlashSaleRequest(
        @NotNull(message = "Choose a product") Long productId,
        @NotNull(message = "Sale price is required") @DecimalMin(value = "0.01", message = "Sale price must be above zero")
        @Digits(integer = 8, fraction = 2, message = "Sale price has too many digits") BigDecimal salePrice,
        @Min(value = 1, message = "At least 1 unit") @Max(value = 100_000, message = "Quantity is too large") int totalQuantity,
        @Min(value = 1, message = "Limit must be at least 1") @Max(value = 10, message = "Limit can be at most 10") int perUserLimit,
        @NotNull(message = "Start time is required") Instant startsAt,
        @NotNull(message = "End time is required") Instant endsAt) {
}
