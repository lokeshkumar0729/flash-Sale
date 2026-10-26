package com.lokesh.flashsale.service;

import com.lokesh.flashsale.dto.AdminStatsResponse;
import com.lokesh.flashsale.dto.OrderResponse;
import com.lokesh.flashsale.model.CustomerOrder;
import com.lokesh.flashsale.model.OrderStatus;
import com.lokesh.flashsale.model.Role;
import com.lokesh.flashsale.repository.FlashSaleRepository;
import com.lokesh.flashsale.repository.OrderRepository;
import com.lokesh.flashsale.repository.ProductRepository;
import com.lokesh.flashsale.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

@Service
@Transactional(readOnly = true)
public class AdminStatsService {

    private static final ZoneId STORE_ZONE = ZoneId.of("Asia/Kolkata");
    private static final int LOW_STOCK_BELOW = 10;

    private final OrderRepository orders;
    private final UserRepository users;
    private final ProductRepository products;
    private final FlashSaleRepository flashSales;

    public AdminStatsService(OrderRepository orders, UserRepository users,
                             ProductRepository products, FlashSaleRepository flashSales) {
        this.orders = orders;
        this.users = users;
        this.products = products;
        this.flashSales = flashSales;
    }

    public AdminStatsResponse overview() {
        LocalDate today = LocalDate.now(STORE_ZONE);
        LocalDate firstDay = today.minusDays(6);
        Instant since = firstDay.atStartOfDay(STORE_ZONE).toInstant();

        Map<LocalDate, BigDecimal> revenueByDay = new TreeMap<>();
        Map<LocalDate, Long> ordersByDay = new TreeMap<>();
        for (int i = 0; i < 7; i++) {
            revenueByDay.put(firstDay.plusDays(i), BigDecimal.ZERO);
            ordersByDay.put(firstDay.plusDays(i), 0L);
        }
        for (CustomerOrder o : orders.findByCreatedAtAfterAndStatusNot(since, OrderStatus.CANCELLED)) {
            LocalDate day = o.getCreatedAt().atZone(STORE_ZONE).toLocalDate();
            if (revenueByDay.containsKey(day)) {
                revenueByDay.merge(day, o.getTotal(), BigDecimal::add);
                ordersByDay.merge(day, 1L, Long::sum);
            }
        }
        List<AdminStatsResponse.DayRevenue> days = new ArrayList<>();
        revenueByDay.forEach((day, revenue) -> days.add(new AdminStatsResponse.DayRevenue(day, revenue, ordersByDay.get(day))));

        return new AdminStatsResponse(
                orders.sumRevenue(OrderStatus.CANCELLED),
                orders.countByStatusNot(OrderStatus.CANCELLED),
                users.countByRole(Role.CUSTOMER),
                products.countByActiveTrue(),
                products.countByActiveTrueAndStockLessThan(LOW_STOCK_BELOW),
                flashSales.countLive(Instant.now()),
                days,
                orders.findTop5ByOrderByCreatedAtDesc().stream().map(OrderResponse::from).toList());
    }
}
