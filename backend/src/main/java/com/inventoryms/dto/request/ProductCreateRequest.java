package com.inventoryms.dto.request;

import com.inventoryms.enums.ProductStatus;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductCreateRequest {
    
    @NotBlank
    @Size(min = 2, max = 200)
    private String name;
    
    @NotBlank
    private String sku;
    
    @NotBlank
    private String category;
    
    @Min(0)
    private Integer currentStock;
    
    @Min(0)
    private Integer minStock;
    
    @Min(0)
    private Integer maxStock;
    
    @DecimalMin("0.0")
    @Digits(integer = 10, fraction = 2)
    private BigDecimal price;
    
    @DecimalMin("0.0")
    @Digits(integer = 10, fraction = 2)
    private BigDecimal cost;
    
    private String supplier;
    
    @NotNull
    private ProductStatus status;
    
    @Size(max = 1000)
    private String description;
    
    private String barcode;
    
    @DecimalMin("0.0")
    @Digits(integer = 5, fraction = 3)
    private BigDecimal weight;
    
    private String dimensions;
}