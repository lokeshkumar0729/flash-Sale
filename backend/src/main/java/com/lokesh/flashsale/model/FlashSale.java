package com.lokesh.flashsale.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * A time-boxed discount on one product with its own limited quantity.
 * Units sold here also come out of the product's regular stock.
 * {@code sold} is only ever changed with conditional UPDATE statements (see FlashSaleRepository).
 */
@Entity
@Table(name = "flash_sales", indexes = {
        @Index(name = "idx_flash_sales_product", columnList = "product_id"),
        @Index(name = "idx_flash_sales_window", columnList = "starts_at, ends_at")
})
public class FlashSale {

    public enum Status { UPCOMING, LIVE, SOLD_OUT, ENDED }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "sale_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal salePrice;

    @Column(name = "total_quantity", nullable = false)
    private int totalQuantity;

    @Column(nullable = false)
    private int sold;

    @Column(name = "per_user_limit", nullable = false)
    private int perUserLimit;

    @Column(name = "starts_at", nullable = false)
    private Instant startsAt;

    @Column(name = "ends_at", nullable = false)
    private Instant endsAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    void onCreate() {
        createdAt = Instant.now();
    }

    public Status statusAt(Instant now) {
        if (!now.isBefore(endsAt)) return Status.ENDED;
        if (now.isBefore(startsAt)) return Status.UPCOMING;
        return sold >= totalQuantity ? Status.SOLD_OUT : Status.LIVE;
    }

    public Long getId() { return id; }
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
    public BigDecimal getSalePrice() { return salePrice; }
    public void setSalePrice(BigDecimal salePrice) { this.salePrice = salePrice; }
    public int getTotalQuantity() { return totalQuantity; }
    public void setTotalQuantity(int totalQuantity) { this.totalQuantity = totalQuantity; }
    public int getSold() { return sold; }
    public int getPerUserLimit() { return perUserLimit; }
    public void setPerUserLimit(int perUserLimit) { this.perUserLimit = perUserLimit; }
    public Instant getStartsAt() { return startsAt; }
    public void setStartsAt(Instant startsAt) { this.startsAt = startsAt; }
    public Instant getEndsAt() { return endsAt; }
    public void setEndsAt(Instant endsAt) { this.endsAt = endsAt; }
    public Instant getCreatedAt() { return createdAt; }
}
