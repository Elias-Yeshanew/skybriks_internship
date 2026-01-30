package com.example.ERP_System.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.ERP_System.models.SalesOrder;

public interface SalesOrderRepository extends JpaRepository<SalesOrder, Long> {
    Optional<SalesOrder> findById(String id);

    @Query("SELECT SUM(s.totalAmount) from SalesOrder s WHERE s.status = 'ORDERED'")
    Double sumTotalSales();
}
