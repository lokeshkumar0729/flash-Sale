package com.lokesh.flashsale.model;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;

import static com.lokesh.flashsale.model.OrderStatus.*;
import static org.assertj.core.api.Assertions.assertThat;

class OrderStatusTest {

    @Test
    void ordersMoveForwardOneStepAtATime() {
        assertThat(PLACED.canTransitionTo(CONFIRMED)).isTrue();
        assertThat(CONFIRMED.canTransitionTo(SHIPPED)).isTrue();
        assertThat(SHIPPED.canTransitionTo(OUT_FOR_DELIVERY)).isTrue();
        assertThat(OUT_FOR_DELIVERY.canTransitionTo(DELIVERED)).isTrue();
    }

    @Test
    void stepsCannotBeSkippedOrReversed() {
        assertThat(PLACED.canTransitionTo(SHIPPED)).isFalse();
        assertThat(PLACED.canTransitionTo(DELIVERED)).isFalse();
        assertThat(SHIPPED.canTransitionTo(CONFIRMED)).isFalse();
    }

    @Test
    void onlyPlacedAndConfirmedOrdersCanBeCancelled() {
        assertThat(PLACED.canTransitionTo(CANCELLED)).isTrue();
        assertThat(CONFIRMED.canTransitionTo(CANCELLED)).isTrue();
        assertThat(SHIPPED.canTransitionTo(CANCELLED)).isFalse();
        assertThat(OUT_FOR_DELIVERY.canTransitionTo(CANCELLED)).isFalse();
        assertThat(PLACED.isCancellable()).isTrue();
        assertThat(DELIVERED.isCancellable()).isFalse();
    }

    @ParameterizedTest
    @EnumSource(value = OrderStatus.class, names = {"DELIVERED", "CANCELLED"})
    void finalStatesCannotMoveAnywhere(OrderStatus finalState) {
        for (OrderStatus next : OrderStatus.values()) {
            assertThat(finalState.canTransitionTo(next)).as(finalState + " -> " + next).isFalse();
        }
    }
}
