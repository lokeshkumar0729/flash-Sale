package com.lokesh.flashsale.dto;

import com.lokesh.flashsale.model.FlashSale;
import com.lokesh.flashsale.model.Product;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.List;

/**
 * {@code currentPrice} is what a customer pays right now: the flash price while a sale is live with units
 * left, otherwise the regular price. {@code flashSale} is present for live, sold-out and upcoming sales.
 */
public record ProductResponse(Long id, String name, String category, String description,
                              BigDecimal price, BigDecimal originalPrice, BigDecimal currentPrice, int discountPercent,
                              double rating, int reviewCount, int stock, boolean active,
                              List<String> features, List<String> images, FlashSaleInfo flashSale) {

    public static ProductResponse from(Product p, FlashSale sale, Instant now) {
        FlashSaleInfo info = sale == null ? null : FlashSaleInfo.from(sale, now);
        BigDecimal current = info != null && info.status() == FlashSale.Status.LIVE ? info.salePrice() : p.getPrice();
        int discount = 0;
        if (p.getOriginalPrice().compareTo(current) > 0) {
            discount = p.getOriginalPrice().subtract(current)
                    .multiply(BigDecimal.valueOf(100))
                    .divide(p.getOriginalPrice(), 0, RoundingMode.HALF_UP).intValue();
        }
        return new ProductResponse(p.getId(), p.getName(), p.getCategory(), p.getDescription(),
                p.getPrice(), p.getOriginalPrice(), current, discount,
                p.getRating(), p.getReviewCount(), p.getStock(), p.isActive(),
                List.copyOf(p.getFeatures()), List.copyOf(p.getImages()), info);
    }
}
