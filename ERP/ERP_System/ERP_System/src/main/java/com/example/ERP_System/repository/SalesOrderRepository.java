package com.example.ERP_System.repository;

import com.example.ERP_System.models.SalesOrder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SalesOrderRepository extends JpaRepository<SalesOrder, Long> {
    
}
