package com.inventoryms.repository;

import com.inventoryms.entity.StockMovement;
import com.inventoryms.enums.MovementType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {
    
    Page<StockMovement> findByProductId(Long productId, Pageable pageable);
    
    Page<StockMovement> findByType(MovementType type, Pageable pageable);
    
    @Query("SELECT sm FROM StockMovement sm WHERE sm.createdAt BETWEEN :startDate AND :endDate")
    List<StockMovement> findByCreatedAtBetween(@Param("startDate") LocalDateTime startDate,
                                             @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT sm FROM StockMovement sm WHERE " +
           "(:productId IS NULL OR sm.product.id = :productId) AND " +
           "(:type IS NULL OR sm.type = :type) AND " +
           "(:location IS NULL OR LOWER(sm.location) LIKE LOWER(CONCAT('%', :location, '%')))")
    Page<StockMovement> findByFilters(@Param("productId") Long productId,
                                    @Param("type") MovementType type,
                                    @Param("location") String location,
                                    Pageable pageable);
}