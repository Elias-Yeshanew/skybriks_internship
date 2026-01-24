package com.example.ERP_System.repository;

import com.example.ERP_System.models.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    
}
