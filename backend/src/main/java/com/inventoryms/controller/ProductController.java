package com.inventoryms.controller;

import com.inventoryms.dto.request.ProductCreateRequest;
import com.inventoryms.dto.response.ApiResponse;
import com.inventoryms.dto.response.PageResponse;
import com.inventoryms.dto.response.ProductResponse;
import com.inventoryms.enums.ProductStatus;
import com.inventoryms.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
@Tag(name = "Product Management", description = "Product management APIs")
public class ProductController {
    
    private final ProductService productService;
    
    @GetMapping
    @Operation(summary = "Get all products", description = "Retrieve paginated list of products")
    public ResponseEntity<ApiResponse<PageResponse<ProductResponse>>> getAllProducts(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String sku,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) ProductStatus status,
            @PageableDefault(size = 20) Pageable pageable) {
        
        PageResponse<ProductResponse> products = productService.getProductsByFilters(name, sku, category, status, pageable);
        return ResponseEntity.ok(ApiResponse.success(products));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get product by ID", description = "Retrieve product details by ID")
    public ResponseEntity<ApiResponse<ProductResponse>> getProductById(@PathVariable Long id) {
        ProductResponse product = productService.getProductById(id);
        return ResponseEntity.ok(ApiResponse.success(product));
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    @Operation(summary = "Create product", description = "Create a new product")
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(@Valid @RequestBody ProductCreateRequest request) {
        ProductResponse product = productService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Product created successfully", product));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    @Operation(summary = "Update product", description = "Update product details")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductCreateRequest request) {
        ProductResponse product = productService.updateProduct(id, request);
        return ResponseEntity.ok(ApiResponse.success("Product updated successfully", product));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete product", description = "Delete product by ID")
    public ResponseEntity<ApiResponse<String>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success("Product deleted successfully", null));
    }
    
    @GetMapping("/low-stock")
    @Operation(summary = "Get low stock products", description = "Retrieve products with low stock levels")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getLowStockProducts() {
        List<ProductResponse> products = productService.getLowStockProducts();
        return ResponseEntity.ok(ApiResponse.success(products));
    }
    
    @GetMapping("/categories")
    @Operation(summary = "Get all categories", description = "Retrieve all product categories")
    public ResponseEntity<ApiResponse<List<String>>> getAllCategories() {
        List<String> categories = productService.getAllCategories();
        return ResponseEntity.ok(ApiResponse.success(categories));
    }
    
    @PatchMapping("/{id}/stock")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('STAFF')")
    @Operation(summary = "Update product stock", description = "Update product stock quantity")
    public ResponseEntity<ApiResponse<ProductResponse>> updateStock(@PathVariable Long id, @RequestParam Integer stock) {
        ProductResponse product = productService.updateStock(id, stock);
        return ResponseEntity.ok(ApiResponse.success("Stock updated successfully", product));
    }
}