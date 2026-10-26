package com.lokesh.flashsale.model;

/**
 * PLACED -> CONFIRMED -> SHIPPED -> OUT_FOR_DELIVERY -> DELIVERED
 * PLACED or CONFIRMED -> CANCELLED (stock is returned). DELIVERED and CANCELLED are final.
 */
public enum OrderStatus {
    PLACED,
    CONFIRMED,
    SHIPPED,
    OUT_FOR_DELIVERY,
    DELIVERED,
    CANCELLED;

    public boolean canTransitionTo(OrderStatus next) {
        return switch (this) {
            case PLACED -> next == CONFIRMED || next == CANCELLED;
            case CONFIRMED -> next == SHIPPED || next == CANCELLED;
            case SHIPPED -> next == OUT_FOR_DELIVERY;
            case OUT_FOR_DELIVERY -> next == DELIVERED;
            case DELIVERED, CANCELLED -> false;
        };
    }

    public boolean isCancellable() {
        return this == PLACED || this == CONFIRMED;
    }
}
