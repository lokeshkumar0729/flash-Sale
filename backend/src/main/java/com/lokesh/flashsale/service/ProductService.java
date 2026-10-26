package com.lokesh.flashsale.service;

import com.lokesh.flashsale.dto.PageResponse;
import com.lokesh.flashsale.dto.ProductRequest;
import com.lokesh.flashsale.dto.ProductResponse;
import com.lokesh.flashsale.exception.ApiException;
import com.lokesh.flashsale.model.FlashSale;
import com.lokesh.flashsale.model.Product;
import com.lokesh.flashsale.repository.FlashSaleRepository;
import com.lokesh.flashsale.repository.ProductRepository;
import com.lokesh.flashsale.repository.ProductSpecifications;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;

@Service
@Transactional(readOnly = true)
public class ProductService {

    /** Whitelisted sort options, so clients cannot sort by arbitrary columns. */
    private static final Map<String, Sort> SORTS = Map.of(
            "newest", Sort.by(Sort.Order.desc("id")),
            "price_asc", Sort.by(Sort.Order.asc("price"), Sort.Order.desc("id")),
            "price_desc", Sort.by(Sort.Order.desc("price"), Sort.Order.desc("id")),
            "rating", Sort.by(Sort.Order.desc("rating"), Sort.Order.desc("id")));

    private final ProductRepository products;
    private final FlashSaleRepository flashSales;

    public ProductService(ProductRepository products, FlashSaleRepository flashSales) {
        this.products = products;
        this.flashSales = flashSales;
    }

    public PageResponse<ProductResponse> search(String q, String category, String sort, boolean includeInactive,
                                                int page, int size) {
        Sort order = SORTS.getOrDefault(sort == null ? "" : sort, SORTS.get("newest"));
        Page<Product> result = products.findAll(ProductSpecifications.filter(q, category, includeInactive),
                Paging.of(page, size, order));
        return PageResponse.of(result, toResponses(result.getContent()));
    }

    public ProductResponse get(Long id) {
        Product product = products.findByIdAndActiveTrue(id)
                .orElseThrow(() -> ApiException.notFound("Product not found"));
        return toResponses(List.of(product)).get(0);
    }

    /** Used by the cart to show current prices and stock. Unknown or hidden products are simply left out. */
    public List<ProductResponse> getByIds(Collection<Long> ids) {
        if (ids.isEmpty()) {
            return List.of();
        }
        List<Long> limited = ids.stream().distinct().limit(50).toList();
        return toResponses(products.findAllById(limited).stream().filter(Product::isActive).toList());
    }

    public List<String> categories() {
        return products.findCategories();
    }

    @Transactional
    public ProductResponse create(ProductRequest request) {
        Product product = new Product();
        apply(product, request);
        return toResponses(List.of(products.save(product))).get(0);
    }

    @Transactional
    public ProductResponse update(Long id, ProductRequest request) {
        Product product = products.findById(id).orElseThrow(() -> ApiException.notFound("Product not found"));
        apply(product, request);
        return toResponses(List.of(product)).get(0);
    }

    /** Products are hidden rather than deleted so past orders keep a valid reference. */
    @Transactional
    public void deactivate(Long id) {
        Product product = products.findById(id).orElseThrow(() -> ApiException.notFound("Product not found"));
        product.setActive(false);
    }

    /** Pairs each product with its running or next flash sale using one extra query for the whole list. */
    List<ProductResponse> toResponses(Collection<Product> list) {
        if (list.isEmpty()) {
            return List.of();
        }
        Instant now = Instant.now();
        List<Long> ids = list.stream().map(Product::getId).toList();
        Map<Long, FlashSale> saleByProduct = new HashMap<>();
        for (FlashSale sale : flashSales.findCurrentOrUpcomingByProducts(ids, now)) {
            saleByProduct.putIfAbsent(sale.getProduct().getId(), sale); // sorted by start time: earliest wins
        }
        return list.stream().map(p -> ProductResponse.from(p, saleByProduct.get(p.getId()), now)).toList();
    }

    private void apply(Product product, ProductRequest request) {
        if (request.originalPrice().compareTo(request.price()) < 0) {
            throw ApiException.badRequest("Original price cannot be lower than the selling price");
        }
        product.setName(request.name().trim());
        product.setCategory(request.category().trim());
        product.setDescription(request.description() == null || request.description().isBlank() ? null : request.description().trim());
        product.setPrice(request.price());
        product.setOriginalPrice(request.originalPrice());
        product.setStock(request.stock());
        product.getFeatures().clear();
        if (request.features() != null) {
            request.features().forEach(f -> product.getFeatures().add(f.trim()));
        }
        product.getImages().clear();
        request.images().forEach(i -> product.getImages().add(i.trim()));
        if (request.active() != null) {
            product.setActive(request.active());
        }
    }
}
