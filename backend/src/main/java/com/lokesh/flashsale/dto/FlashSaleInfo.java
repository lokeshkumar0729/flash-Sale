package com.lokesh.flashsale.dto;

import com.lokesh.flashsale.model.FlashSale;

import java.math.BigDecimal;
import java.time.Instant;

/** The part of a flash sale a shopper needs to see on a product. */
public record FlashSaleInfo(Long id, BigDecimal salePrice, int totalQuantity, int sold, int remaining,
                            int perUserLimit, Instant startsAt, Instant endsAt, FlashSale.Status status) {

    public static FlashSaleInfo from(FlashSale s, Instant now) {
        return new FlashSaleInfo(s.getId(), s.getSalePrice(), s.getTotalQuantity(), s.getSold(),
                Math.max(0, s.getTotalQuantity() - s.getSold()), s.getPerUserLimit(),
                s.getStartsAt(), s.getEndsAt(), s.statusAt(now));
    }
}
