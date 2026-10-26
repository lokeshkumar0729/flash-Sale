package com.lokesh.flashsale.dto;

import com.lokesh.flashsale.model.FlashSale;

import java.math.BigDecimal;
import java.time.Instant;

public record FlashSaleAdminResponse(Long id, Long productId, String productName, String productImage,
                                     BigDecimal regularPrice, BigDecimal salePrice, int totalQuantity, int sold,
                                     int perUserLimit, Instant startsAt, Instant endsAt, FlashSale.Status status) {

    public static FlashSaleAdminResponse from(FlashSale s, Instant now) {
        var p = s.getProduct();
        return new FlashSaleAdminResponse(s.getId(), p.getId(), p.getName(),
                p.getImages().isEmpty() ? null : p.getImages().get(0),
                p.getPrice(), s.getSalePrice(), s.getTotalQuantity(), s.getSold(), s.getPerUserLimit(),
                s.getStartsAt(), s.getEndsAt(), s.statusAt(now));
    }
}
