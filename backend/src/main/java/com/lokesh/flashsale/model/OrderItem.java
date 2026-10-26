package com.lokesh.flashsale.model;

import jakarta.persistence.*;

import java.math.BigDecimal;

/** A line of an order. Name, image and prices are copied so later product edits never change past orders. */
@Entity
@Table(name = "order_items", indexes = {
        @Index(name = "idx_order_items_flash_sale", columnList = "flash_sale_id")
})
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private CustomerOrder order;

    @Column(name = "product_id", nullable = false)
    private Long productId;

    @Column(name = "flash_sale_id")
    private Long flashSaleId;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(length = 500)
    private String image;

    @Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Column(name = "original_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal originalPrice;

    @Column(nullable = false)
    private int quantity;

    protected OrderItem() {
    }

    public OrderItem(Long productId, Long flashSaleId, String name, String image,
                     BigDecimal unitPrice, BigDecimal originalPrice, int quantity) {
        this.productId = productId;
        this.flashSaleId = flashSaleId;
        this.name = name;
        this.image = image;
        this.unitPrice = unitPrice;
        this.originalPrice = originalPrice;
        this.quantity = quantity;
    }

    public Long getId() { return id; }
    public CustomerOrder getOrder() { return order; }
    void setOrder(CustomerOrder order) { this.order = order; }
    public Long getProductId() { return productId; }
    public Long getFlashSaleId() { return flashSaleId; }
    public String getName() { return name; }
    public String getImage() { return image; }
    public BigDecimal getUnitPrice() { return unitPrice; }
    public BigDecimal getOriginalPrice() { return originalPrice; }
    public int getQuantity() { return quantity; }
}
