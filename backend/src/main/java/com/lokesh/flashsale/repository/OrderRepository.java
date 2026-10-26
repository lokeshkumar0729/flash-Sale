package com.lokesh.flashsale.repository;

import com.lokesh.flashsale.model.CustomerOrder;
import com.lokesh.flashsale.model.OrderStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<CustomerOrder, Long> {

    @EntityGraph(attributePaths = {"items", "user"})
    Optional<CustomerOrder> findWithItemsByUserIdAndIdempotencyKey(Long userId, String idempotencyKey);

    @EntityGraph(attributePaths = {"items", "user"})
    Optional<CustomerOrder> findWithItemsById(Long id);

    /** Row lock so two requests cannot cancel or advance the same order at once. */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select o from CustomerOrder o where o.id = :id")
    Optional<CustomerOrder> lockById(@Param("id") Long id);

    // Lists do not fetch-join the items collection (that would paginate in memory); the items are loaded
    // in batches through @BatchSize on CustomerOrder.items instead.
    Page<CustomerOrder> findByUserId(Long userId, Pageable pageable);

    @EntityGraph(attributePaths = "user")
    Page<CustomerOrder> findAllBy(Pageable pageable);

    @EntityGraph(attributePaths = "user")
    Page<CustomerOrder> findByStatus(OrderStatus status, Pageable pageable);

    /** Units of one flash sale this customer already holds (cancelled orders do not count). */
    @Query("""
            select coalesce(sum(i.quantity), 0) from OrderItem i
            where i.flashSaleId = :saleId and i.order.user.id = :userId and i.order.status <> :cancelled
            """)
    long unitsBoughtInSale(@Param("saleId") Long saleId, @Param("userId") Long userId,
                           @Param("cancelled") OrderStatus cancelled);

    long countByStatusNot(OrderStatus status);

    @Query("select coalesce(sum(o.total), 0) from CustomerOrder o where o.status <> :cancelled")
    BigDecimal sumRevenue(@Param("cancelled") OrderStatus cancelled);

    List<CustomerOrder> findByCreatedAtAfterAndStatusNot(Instant after, OrderStatus status);

    @EntityGraph(attributePaths = "user")
    List<CustomerOrder> findTop5ByOrderByCreatedAtDesc();
}
