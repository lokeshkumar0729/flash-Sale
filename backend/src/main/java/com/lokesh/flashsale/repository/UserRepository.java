package com.lokesh.flashsale.repository;

import com.lokesh.flashsale.model.Role;
import com.lokesh.flashsale.model.User;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);

    long countByRole(Role role);

    /**
     * SELECT ... FOR UPDATE on the user's row. Checkout and cancellation take this lock first so that one
     * customer's requests run one at a time: that is what makes the per-customer limit and idempotency keys safe.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select u from User u where lower(u.email) = lower(:email)")
    Optional<User> lockByEmail(@Param("email") String email);

    @Query("""
            select u from User u
            where u.role = :role
              and (lower(u.name) like lower(concat('%', :q, '%')) or lower(u.email) like lower(concat('%', :q, '%')))
            """)
    Page<User> search(@Param("role") Role role, @Param("q") String q, Pageable pageable);
}
