package com.inventoryms.entity;

import com.inventoryms.enums.ProductStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product extends BaseEntity {
    
    @NotBlank
    @Size(min = 2, max = 200)
    @Column(nullable = false)
    private String name;
    
    @NotBlank
    @Column(unique = true, nullable = false)
    private String sku;
    
    @NotBlank
    @Column(nullable = false)
    private String category;
    
    @Min(0)
    @Column(name = "current_stock", nullable = false)
    private Integer currentStock;
    
    @Min(0)
    @Column(name = "min_stock", nullable = false)
    private Integer minStock;
    
    @Min(0)
    @Column(name = "max_stock", nullable = false)
    private Integer maxStock;
    
    @DecimalMin("0.0")
    @Digits(integer = 10, fraction = 2)
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;
    
    @DecimalMin("0.0")
    @Digits(integer = 10, fraction = 2)
    @Column(precision = 12, scale = 2)
    private BigDecimal cost;
    
    private String supplier;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductStatus status;
    
    @Column(length = 1000)
    private String description;
    
    private String barcode;
    
    @DecimalMin("0.0")
    @Digits(integer = 5, fraction = 3)
    private BigDecimal weight;
    
    private String dimensions;
}