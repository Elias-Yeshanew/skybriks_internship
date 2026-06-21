package com.garage.repository;

import com.garage.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    List<Invoice> findByCustomerId(Long customerId);
    List<Invoice> findByStatus(Invoice.InvoiceStatus status);
    Optional<Invoice> findByServiceRequestId(Long serviceRequestId);
    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);
    boolean existsByServiceRequestId(Long serviceRequestId);
}
