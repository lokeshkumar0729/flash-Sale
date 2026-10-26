package com.lokesh.flashsale.model;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "wishlist_items",
        uniqueConstraints = @UniqueConstraint(name = "uk_wishlist_user_product", columnNames = {"user_id", "product_id"}))
public class WishlistItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    void onCreate() {
        createdAt = Instant.now();
    }

    protected WishlistItem() {
    }

    public WishlistItem(Long userId, Product product) {
        this.userId = userId;
        this.product = product;
    }

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public Product getProduct() { return product; }
}
