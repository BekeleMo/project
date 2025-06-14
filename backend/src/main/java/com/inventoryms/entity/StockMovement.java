package com.inventoryms.entity;

import com.inventoryms.enums.MovementType;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(name = "stock_movements")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockMovement extends BaseEntity {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    @NotNull
    private Product product;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MovementType type;
    
    @Min(1)
    @Column(nullable = false)
    private Integer quantity;
    
    @Column(name = "previous_stock", nullable = false)
    private Integer previousStock;
    
    @Column(name = "new_stock", nullable = false)
    private Integer newStock;
    
    @NotBlank
    @Column(nullable = false, length = 500)
    private String reason;
    
    @NotBlank
    @Column(nullable = false)
    private String location;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    @NotNull
    private User createdBy;
    
    private String reference;
}