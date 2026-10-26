package com.lokesh.flashsale.repository;

import com.lokesh.flashsale.model.FlashSale;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.Collection;
import java.util.List;

public interface FlashSaleRepository extends JpaRepository<FlashSale, Long> {

    /**
     * Atomically claims {@code qty} units of a sale. The window check, the quantity check and the increment
     * are a single UPDATE, so concurrent buyers can never push {@code sold} past {@code totalQuantity}.
     * Returns 0 when the sale is not running, or when fewer than {@code qty} units are left.
     */
    @Modifying(flushAutomatically = true)
    @Query("""
            update FlashSale s set s.sold = s.sold + :qty
            where s.id = :id and s.sold + :qty <= s.totalQuantity and s.startsAt <= :now and s.endsAt > :now
            """)
    int claim(@Param("id") Long id, @Param("qty") int qty, @Param("now") Instant now);

    /** Gives units back (order cancelled). */
    @Modifying(flushAutomatically = true)
    @Query("update FlashSale s set s.sold = s.sold - :qty where s.id = :id and s.sold >= :qty")
    int release(@Param("id") Long id, @Param("qty") int qty);

    /** The sale that prices a product right now: running and not sold out. */
    @Query("""
            select s from FlashSale s
            where s.product.id = :productId and s.startsAt <= :now and s.endsAt > :now and s.sold < s.totalQuantity
            order by s.startsAt desc
            """)
    List<FlashSale> findClaimableByProduct(@Param("productId") Long productId, @Param("now") Instant now);

    /** Sales that are running or still to come for the given products (sold-out ones included). */
    @Query("""
            select s from FlashSale s
            where s.product.id in :productIds and s.endsAt > :now
            order by s.startsAt asc
            """)
    List<FlashSale> findCurrentOrUpcomingByProducts(@Param("productIds") Collection<Long> productIds, @Param("now") Instant now);

    @EntityGraph(attributePaths = "product")
    @Query("select s from FlashSale s where s.startsAt <= :now and s.endsAt > :now order by s.endsAt asc")
    List<FlashSale> findLive(@Param("now") Instant now);

    @EntityGraph(attributePaths = "product")
    @Query("select s from FlashSale s where s.startsAt > :now order by s.startsAt asc")
    List<FlashSale> findUpcoming(@Param("now") Instant now);

    @EntityGraph(attributePaths = "product")
    @Query("select s from FlashSale s")
    Page<FlashSale> findAllWithProduct(Pageable pageable);

    @Query("select count(s) > 0 from FlashSale s where s.product.id = :productId and s.startsAt < :end and s.endsAt > :start")
    boolean existsOverlapping(@Param("productId") Long productId, @Param("start") Instant start, @Param("end") Instant end);

    @Query("select count(s) from FlashSale s where s.startsAt <= :now and s.endsAt > :now")
    long countLive(@Param("now") Instant now);
}
