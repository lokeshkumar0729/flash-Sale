package com.lokesh.flashsale.service;

import com.lokesh.flashsale.dto.FlashSaleAdminResponse;
import com.lokesh.flashsale.dto.FlashSaleRequest;
import com.lokesh.flashsale.dto.PageResponse;
import com.lokesh.flashsale.dto.ProductResponse;
import com.lokesh.flashsale.exception.ApiException;
import com.lokesh.flashsale.model.FlashSale;
import com.lokesh.flashsale.model.Product;
import com.lokesh.flashsale.repository.FlashSaleRepository;
import com.lokesh.flashsale.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class FlashSaleService {

    private final FlashSaleRepository flashSales;
    private final ProductRepository products;

    public FlashSaleService(FlashSaleRepository flashSales, ProductRepository products) {
        this.flashSales = flashSales;
        this.products = products;
    }

    /** Products on sale right now (sold-out ones included so the page can show them as gone). */
    public List<ProductResponse> live() {
        Instant now = Instant.now();
        return flashSales.findLive(now).stream()
                .filter(s -> s.getProduct().isActive())
                .map(s -> ProductResponse.from(s.getProduct(), s, now))
                .toList();
    }

    public List<ProductResponse> upcoming() {
        Instant now = Instant.now();
        return flashSales.findUpcoming(now).stream()
                .filter(s -> s.getProduct().isActive())
                .map(s -> ProductResponse.from(s.getProduct(), s, now))
                .toList();
    }

    public PageResponse<FlashSaleAdminResponse> adminList(int page, int size) {
        Instant now = Instant.now();
        Page<FlashSale> result = flashSales.findAllWithProduct(
                Paging.of(page, size, Sort.by(Sort.Order.desc("startsAt"), Sort.Order.desc("id"))));
        return PageResponse.from(result, s -> FlashSaleAdminResponse.from(s, now));
    }

    @Transactional
    public FlashSaleAdminResponse create(FlashSaleRequest request) {
        Instant now = Instant.now();
        Product product = products.findByIdAndActiveTrue(request.productId())
                .orElseThrow(() -> ApiException.badRequest("Choose an active product"));

        if (!request.endsAt().isAfter(request.startsAt())) {
            throw ApiException.badRequest("The sale must end after it starts");
        }
        if (!request.endsAt().isAfter(now)) {
            throw ApiException.badRequest("The end time is already in the past");
        }
        if (request.salePrice().compareTo(product.getPrice()) >= 0) {
            throw ApiException.badRequest("The sale price must be lower than the regular price (" + product.getPrice() + ")");
        }
        if (request.totalQuantity() > product.getStock()) {
            throw ApiException.badRequest("Only " + product.getStock() + " units are in stock for this product");
        }
        if (request.perUserLimit() > request.totalQuantity()) {
            throw ApiException.badRequest("The per-customer limit cannot exceed the sale quantity");
        }
        if (flashSales.existsOverlapping(product.getId(), request.startsAt(), request.endsAt())) {
            throw ApiException.conflict("This product already has a flash sale in that time window");
        }

        FlashSale sale = new FlashSale();
        sale.setProduct(product);
        sale.setSalePrice(request.salePrice());
        sale.setTotalQuantity(request.totalQuantity());
        sale.setPerUserLimit(request.perUserLimit());
        sale.setStartsAt(request.startsAt());
        sale.setEndsAt(request.endsAt());
        return FlashSaleAdminResponse.from(flashSales.save(sale), now);
    }

    /** Ends a sale immediately. Orders already placed keep the price they paid. */
    @Transactional
    public FlashSaleAdminResponse endNow(Long id) {
        Instant now = Instant.now();
        FlashSale sale = flashSales.findById(id).orElseThrow(() -> ApiException.notFound("Flash sale not found"));
        if (!sale.getEndsAt().isAfter(now)) {
            throw ApiException.conflict("This sale has already ended");
        }
        sale.setEndsAt(now);
        if (sale.getStartsAt().isAfter(now)) {
            sale.setStartsAt(now); // a sale that never started becomes an empty, ended window
        }
        return FlashSaleAdminResponse.from(sale, now);
    }
}
