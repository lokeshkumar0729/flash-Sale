package com.lokesh.flashsale.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.util.List;

public record ProductRequest(
        @NotBlank(message = "Name is required") @Size(max = 150, message = "Name must be at most 150 characters") String name,
        @NotBlank(message = "Category is required") @Size(max = 60, message = "Category must be at most 60 characters") String category,
        @Size(max = 2000, message = "Description must be at most 2000 characters") String description,
        @NotNull(message = "Price is required") @DecimalMin(value = "0.01", message = "Price must be above zero")
        @Digits(integer = 8, fraction = 2, message = "Price has too many digits") BigDecimal price,
        @NotNull(message = "Original price is required") @DecimalMin(value = "0.01", message = "Original price must be above zero")
        @Digits(integer = 8, fraction = 2, message = "Original price has too many digits") BigDecimal originalPrice,
        @Min(value = 0, message = "Stock cannot be negative") @Max(value = 1_000_000, message = "Stock is too large") int stock,
        @Size(max = 10, message = "Add at most 10 features") List<@NotBlank @Size(max = 200) String> features,
        @NotEmpty(message = "Add at least one image") @Size(max = 8, message = "Add at most 8 images")
        List<@NotBlank @Size(max = 500) String> images,
        Boolean active) {
}
