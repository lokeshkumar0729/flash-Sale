package com.lokesh.flashsale.controller;

import com.lokesh.flashsale.dto.FlashSaleAdminResponse;
import com.lokesh.flashsale.dto.FlashSaleRequest;
import com.lokesh.flashsale.dto.PageResponse;
import com.lokesh.flashsale.dto.ProductResponse;
import com.lokesh.flashsale.service.FlashSaleService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class FlashSaleController {

    private final FlashSaleService flashSales;

    public FlashSaleController(FlashSaleService flashSales) {
        this.flashSales = flashSales;
    }

    @GetMapping("/api/flash-sales/live")
    public List<ProductResponse> live() {
        return flashSales.live();
    }

    @GetMapping("/api/flash-sales/upcoming")
    public List<ProductResponse> upcoming() {
        return flashSales.upcoming();
    }

    @GetMapping("/api/admin/flash-sales")
    public PageResponse<FlashSaleAdminResponse> adminList(@RequestParam(defaultValue = "0") int page,
                                                          @RequestParam(defaultValue = "10") int size) {
        return flashSales.adminList(page, size);
    }

    @PostMapping("/api/admin/flash-sales")
    @ResponseStatus(HttpStatus.CREATED)
    public FlashSaleAdminResponse create(@Valid @RequestBody FlashSaleRequest request) {
        return flashSales.create(request);
    }

    @PostMapping("/api/admin/flash-sales/{id}/end")
    public FlashSaleAdminResponse end(@PathVariable Long id) {
        return flashSales.endNow(id);
    }
}
