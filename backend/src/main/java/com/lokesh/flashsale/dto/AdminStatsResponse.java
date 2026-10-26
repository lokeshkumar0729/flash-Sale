package com.lokesh.flashsale.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record AdminStatsResponse(BigDecimal revenue, long orders, long customers, long activeProducts,
                                 long lowStockProducts, long liveFlashSales,
                                 List<DayRevenue> last7Days, List<OrderResponse> recentOrders) {

    public record DayRevenue(LocalDate date, BigDecimal revenue, long orders) {
    }
}
