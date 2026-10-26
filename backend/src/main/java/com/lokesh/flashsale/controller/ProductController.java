package com.lokesh.flashsale.controller;

import com.lokesh.flashsale.dto.PageResponse;
import com.lokesh.flashsale.dto.ProductRequest;
import com.lokesh.flashsale.dto.ProductResponse;
import com.lokesh.flashsale.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ProductController {

    private final ProductService products;

    public ProductController(ProductService products) {
        this.products = products;
    }

    // ---- public storefront ---------------------------------------------------------------------------------

    @GetMapping("/api/products")
    public PageResponse<ProductResponse> list(@RequestParam(defaultValue = "") String q,
                                              @RequestParam(defaultValue = "") String category,
                                              @RequestParam(defaultValue = "newest") String sort,
                                              @RequestParam(defaultValue = "0") int page,
                                              @RequestParam(defaultValue = "12") int size) {
        return products.search(q, category, sort, false, page, size);
    }

    @GetMapping("/api/products/categories")
    public List<String> categories() {
        return products.categories();
    }

    @GetMapping("/api/products/by-ids")
    public List<ProductResponse> byIds(@RequestParam List<Long> ids) {
        return products.getByIds(ids);
    }

    @GetMapping("/api/products/{id}")
    public ProductResponse get(@PathVariable Long id) {
        return products.get(id);
    }

    // ---- admin ---------------------------------------------------------------------------------------------

    @GetMapping("/api/admin/products")
    public PageResponse<ProductResponse> adminList(@RequestParam(defaultValue = "") String q,
                                                   @RequestParam(defaultValue = "0") int page,
                                                   @RequestParam(defaultValue = "10") int size) {
        return products.search(q, "", "newest", true, page, size);
    }

    @PostMapping("/api/admin/products")
    @ResponseStatus(HttpStatus.CREATED)
    public ProductResponse create(@Valid @RequestBody ProductRequest request) {
        return products.create(request);
    }

    @PutMapping("/api/admin/products/{id}")
    public ProductResponse update(@PathVariable Long id, @Valid @RequestBody ProductRequest request) {
        return products.update(id, request);
    }

    @DeleteMapping("/api/admin/products/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deactivate(@PathVariable Long id) {
        products.deactivate(id);
    }
}
