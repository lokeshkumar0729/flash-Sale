package com.lokesh.flashsale.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ShippingAddress(
        @NotBlank(message = "Full name is required") @Size(max = 100, message = "Name is too long") String fullName,
        @NotBlank(message = "Phone number is required") @Pattern(regexp = "^[6-9]\\d{9}$", message = "Enter a valid 10-digit mobile number") String phone,
        @NotBlank(message = "Email is required") @Email(message = "Enter a valid email address") @Size(max = 150) String email,
        @NotBlank(message = "Address is required") @Size(max = 300, message = "Address is too long") String addressLine,
        @NotBlank(message = "City is required") @Size(max = 80) String city,
        @NotBlank(message = "State is required") @Size(max = 80) String state,
        @NotBlank(message = "Pincode is required") @Pattern(regexp = "^\\d{6}$", message = "Pincode must be 6 digits") String pincode) {
}
