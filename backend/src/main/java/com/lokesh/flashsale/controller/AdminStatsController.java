package com.lokesh.flashsale.controller;

import com.lokesh.flashsale.dto.AdminStatsResponse;
import com.lokesh.flashsale.service.AdminStatsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/stats")
public class AdminStatsController {

    private final AdminStatsService stats;

    public AdminStatsController(AdminStatsService stats) {
        this.stats = stats;
    }

    @GetMapping
    public AdminStatsResponse overview() {
        return stats.overview();
    }
}
