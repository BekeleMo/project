package com.inventoryms.repository;

import com.inventoryms.entity.Customer;
import com.inventoryms.enums.CustomerStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    
    Optional<Customer> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    Page<Customer> findByStatus(CustomerStatus status, Pageable pageable);
    
    @Query("SELECT c FROM Customer c WHERE " +
           "(:name IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:email IS NULL OR LOWER(c.email) LIKE LOWER(CONCAT('%', :email, '%'))) AND " +
           "(:status IS NULL OR c.status = :status)")
    Page<Customer> findByFilters(@Param("name") String name,
                               @Param("email") String email,
                               @Param("status") CustomerStatus status,
                               Pageable pageable);
}