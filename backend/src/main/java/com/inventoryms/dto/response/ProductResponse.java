package com.inventoryms.dto.response;

import com.inventoryms.enums.ProductStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ProductResponse {
    private Long id;
    private String name;
    private String sku;
    private String category;
    private Integer currentStock;
    private Integer minStock;
    private Integer maxStock;
    private BigDecimal price;
    private BigDecimal cost;
    private String supplier;
    private ProductStatus status;
    private String description;
    private String barcode;
    private BigDecimal weight;
    private String dimensions;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}