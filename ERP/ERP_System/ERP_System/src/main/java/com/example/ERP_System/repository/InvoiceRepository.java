package com.example.ERP_System.repository;

import com.example.ERP_System.models.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvoiceRepository  extends JpaRepository<Invoice, Long> {

}
