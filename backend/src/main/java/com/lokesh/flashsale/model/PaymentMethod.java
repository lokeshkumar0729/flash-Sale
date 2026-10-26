package com.lokesh.flashsale.model;

/** Payments are simulated: the method is recorded on the order but no money moves. */
public enum PaymentMethod {
    UPI,
    CARD,
    NETBANKING,
    COD
}
