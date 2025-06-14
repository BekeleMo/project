package com.inventoryms.repository;

import com.inventoryms.entity.Sale;
import com.inventoryms.enums.SaleStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {
    
    Page<Sale> findByStatus(SaleStatus status, Pageable pageable);
    
    Page<Sale> findByCustomerId(Long customerId, Pageable pageable);
    
    @Query("SELECT s FROM Sale s WHERE s.saleDate BETWEEN :startDate AND :endDate")
    List<Sale> findBySaleDateBetween(@Param("startDate") LocalDateTime startDate,
                                   @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT SUM(s.total) FROM Sale s WHERE s.saleDate BETWEEN :startDate AND :endDate AND s.status = 'COMPLETED'")
    BigDecimal getTotalRevenueBetween(@Param("startDate") LocalDateTime startDate,
                                    @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(s) FROM Sale s WHERE s.saleDate BETWEEN :startDate AND :endDate AND s.status = 'COMPLETED'")
    Long getTotalSalesBetween(@Param("startDate") LocalDateTime startDate,
                            @Param("endDate") LocalDateTime endDate);
}