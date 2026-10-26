package com.lokesh.flashsale.repository;

import com.lokesh.flashsale.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    Optional<Product> findByIdAndActiveTrue(Long id);

    long countByActiveTrue();

    long countByActiveTrueAndStockLessThan(int threshold);

    @Query("select distinct p.category from Product p where p.active = true order by p.category")
    List<String> findCategories();

    /**
     * Atomic: the stock check and the decrement are one statement, so two buyers can never both take the last unit.
     * Returns the number of rows changed: 0 means "not enough stock" (or the product is inactive).
     */
    @Modifying(flushAutomatically = true)
    @Query("update Product p set p.stock = p.stock - :qty where p.id = :id and p.active = true and p.stock >= :qty")
    int decrementStock(@Param("id") Long id, @Param("qty") int qty);

    @Modifying(flushAutomatically = true)
    @Query("update Product p set p.stock = p.stock + :qty where p.id = :id")
    int incrementStock(@Param("id") Long id, @Param("qty") int qty);
}
