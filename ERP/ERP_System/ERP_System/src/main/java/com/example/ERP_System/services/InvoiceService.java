package com.example.ERP_System.services;

import com.example.ERP_System.models.Invoice;
import java.util.List;

public interface  InvoiceService {
    Invoice createInvoiceFromOrder(Long salesOrderId);
    Invoice getInvoiceByOrderId(Long salesOrderId);
    List<Invoice> getAllInvoices();
}
