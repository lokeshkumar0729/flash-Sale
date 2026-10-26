package com.lokesh.flashsale.dto;

import com.lokesh.flashsale.model.PaymentMethod;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record PlaceOrderRequest(
        @NotEmpty(message = "Your cart is empty") @Size(max = 20, message = "An order can have at most 20 different items")
        List<@Valid OrderLine> items,
        @NotNull(message = "Delivery address is required") @Valid ShippingAddress address,
        @NotNull(message = "Choose a payment method") PaymentMethod paymentMethod) {
}
