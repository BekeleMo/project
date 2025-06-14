package com.inventoryms.service;

import com.inventoryms.dto.request.ProductCreateRequest;
import com.inventoryms.dto.response.PageResponse;
import com.inventoryms.dto.response.ProductResponse;
import com.inventoryms.enums.ProductStatus;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductService {
    
    PageResponse<ProductResponse> getAllProducts(Pageable pageable);
    
    PageResponse<ProductResponse> getProductsByFilters(String name, String sku, String category, ProductStatus status, Pageable pageable);
    
    ProductResponse getProductById(Long id);
    
    ProductResponse createProduct(ProductCreateRequest request);
    
    ProductResponse updateProduct(Long id, ProductCreateRequest request);
    
    void deleteProduct(Long id);
    
    List<ProductResponse> getLowStockProducts();
    
    List<String> getAllCategories();
    
    ProductResponse updateStock(Long id, Integer newStock);
}