package com.lokesh.flashsale.repository;

import com.lokesh.flashsale.model.WishlistItem;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface WishlistRepository extends JpaRepository<WishlistItem, Long> {

    @EntityGraph(attributePaths = "product")
    List<WishlistItem> findByUserIdOrderByIdDesc(Long userId);

    boolean existsByUserIdAndProductId(Long userId, Long productId);

    @Modifying
    @Query("delete from WishlistItem w where w.userId = :userId and w.product.id = :productId")
    void deleteByUserAndProduct(@Param("userId") Long userId, @Param("productId") Long productId);
}
