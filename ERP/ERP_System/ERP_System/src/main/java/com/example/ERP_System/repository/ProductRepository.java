package com.example.ERP_System.repository;

import com.example.ERP_System.models.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long>{

    Optional<Product> findBySku(String sku);

    @Query("SELECT COUNT(p) FROM Product p WHERE p.currentStock <= p.reorderLevel")
    long countLowStockProducts();
}
