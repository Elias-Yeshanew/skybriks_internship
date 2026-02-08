package com.example.ERP_System.repository;

import com.example.ERP_System.models.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InvoiceRepository  extends JpaRepository<Invoice, Long> {
    Optional<Invoice> findBySalesOrderId(Long sales_order_id);
}
