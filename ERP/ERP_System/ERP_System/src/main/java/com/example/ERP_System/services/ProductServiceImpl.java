package com.example.ERP_System.services;

import com.example.ERP_System.models.Product;
import com.example.ERP_System.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public List<Product> getAllProducts(){
        return productRepository.findAll();
    }

    @Override
    public Product getProductById(Long id){
        return productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    @Override
    @Transactional
    public Product createProduct(Product product){
        if(productRepository.findBySku(product.getSku()).isPresent()){
            throw new RuntimeException("SKU already exists");
        }
        return productRepository.save(product);
    }

    @Override
    @Transactional
    public Product updateProduct(Long id, Product productDetails){
        Product product = getProductById(id);
        product.setName(productDetails.getName());
        product.setCategory(productDetails.getCategory());
        product.setUnitPrice(productDetails.getUnitPrice());
        product.setReorderLevel(productDetails.getReorderLevel());

        return productRepository.save(product);
    }

    @Override
    @Transactional
    public void deleteProduct(Long id){
        Product product = getProductById(id);
        productRepository.delete(product);
    }
}
