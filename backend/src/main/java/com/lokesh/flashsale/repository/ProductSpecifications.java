package com.lokesh.flashsale.repository;

import com.lokesh.flashsale.model.Product;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public final class ProductSpecifications {

    private ProductSpecifications() {
    }

    public static Specification<Product> filter(String query, String category, boolean includeInactive) {
        return (root, cq, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (!includeInactive) {
                predicates.add(cb.isTrue(root.get("active")));
            }
            if (category != null && !category.isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("category")), category.trim().toLowerCase()));
            }
            if (query != null && !query.isBlank()) {
                String like = "%" + query.trim().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("name")), like),
                        cb.like(cb.lower(cb.coalesce(root.<String>get("description"), "")), like),
                        cb.like(cb.lower(root.get("category")), like)));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
