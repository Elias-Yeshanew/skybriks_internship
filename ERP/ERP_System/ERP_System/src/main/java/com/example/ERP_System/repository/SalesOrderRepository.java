package com.example.ERP_System.repository;

import com.example.ERP_System.models.SalesOrder;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SalesOrderRepository extends JpaRepository<SalesOrder, Long> {
        Optional<SalesOrder> findById(String id);

}
