package com.inventoryms.service.impl;

import com.inventoryms.dto.request.ProductCreateRequest;
import com.inventoryms.dto.response.PageResponse;
import com.inventoryms.dto.response.ProductResponse;
import com.inventoryms.entity.Product;
import com.inventoryms.enums.ProductStatus;
import com.inventoryms.exception.DuplicateResourceException;
import com.inventoryms.exception.ResourceNotFoundException;
import com.inventoryms.mapper.ProductMapper;
import com.inventoryms.repository.ProductRepository;
import com.inventoryms.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductServiceImpl implements ProductService {
    
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    
    @Override
    @Transactional(readOnly = true)
    public PageResponse<ProductResponse> getAllProducts(Pageable pageable) {
        Page<Product> products = productRepository.findAll(pageable);
        Page<ProductResponse> productResponses = products.map(productMapper::toResponse);
        return new PageResponse<>(productResponses);
    }
    
    @Override
    @Transactional(readOnly = true)
    public PageResponse<ProductResponse> getProductsByFilters(String name, String sku, String category, ProductStatus status, Pageable pageable) {
        Page<Product> products = productRepository.findByFilters(name, sku, category, status, pageable);
        Page<ProductResponse> productResponses = products.map(productMapper::toResponse);
        return new PageResponse<>(productResponses);
    }
    
    @Override
    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return productMapper.toResponse(product);
    }
    
    @Override
    public ProductResponse createProduct(ProductCreateRequest request) {
        if (productRepository.existsBySku(request.getSku())) {
            throw new DuplicateResourceException("Product already exists with SKU: " + request.getSku());
        }
        
        Product product = productMapper.toEntity(request);
        Product savedProduct = productRepository.save(product);
        return productMapper.toResponse(savedProduct);
    }
    
    @Override
    public ProductResponse updateProduct(Long id, ProductCreateRequest request) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        
        if (!existingProduct.getSku().equals(request.getSku()) && 
            productRepository.existsBySku(request.getSku())) {
            throw new DuplicateResourceException("Product already exists with SKU: " + request.getSku());
        }
        
        productMapper.updateEntity(request, existingProduct);
        Product savedProduct = productRepository.save(existingProduct);
        return productMapper.toResponse(savedProduct);
    }
    
    @Override
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getLowStockProducts() {
        List<Product> lowStockProducts = productRepository.findLowStockProducts();
        return lowStockProducts.stream()
                .map(productMapper::toResponse)
                .toList();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<String> getAllCategories() {
        return productRepository.findAllCategories();
    }
    
    @Override
    public ProductResponse updateStock(Long id, Integer newStock) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        
        product.setCurrentStock(newStock);
        Product savedProduct = productRepository.save(product);
        return productMapper.toResponse(savedProduct);
    }
}