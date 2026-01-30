package com.example.ERP_System.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.ERP_System.models.PurchaseOrder;

public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {

    @Query("SELECT COUNT(s) FROM SalesOrder s WHERE s.status = 'PENDING'")
    long countPendingOrders();

    @Query("SELECT SUM(i.quantity * i.unitPrice) FROM PurchaseOrderItem i")
    Double sumTotalPurchase();
}
