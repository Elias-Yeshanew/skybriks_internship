package com.example.ERP_System.services;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.ERP_System.models.Invoice;
import com.example.ERP_System.repository.InvoiceRepository;
import com.example.ERP_System.repository.SalesOrderRepository;
import com.example.ERP_System.models.SalesOrder;

import jakarta.transaction.Transactional;

@Service
public class InvoiceServiceImpl implements InvoiceService{

    @Autowired
    private InvoiceRepository invoiceRepository;
    @Autowired
    private SalesOrderRepository salesOrderRepository;

    @Override
    @Transactional
    public Invoice createInvoiceFromOrder(Long salesOrderId){
        return invoiceRepository.findBySalesOrderId(salesOrderId).orElseGet(() ->{
            SalesOrder order = salesOrderRepository.findById(salesOrderId).orElseThrow(() -> new RuntimeException("Oderd not Found with sales order " + salesOrderId));
            double subtotal = order.getTotalAmount();
            double tax = subtotal * 0.15;

            Invoice invoice = new Invoice();
            invoice.setSalesOrder(order);
            invoice.setInvoiceNumber("INV-" + UUID.randomUUID().toString().substring(0,8).toUpperCase());
            invoice.setInvoiceDate(LocalDateTime.now());
            invoice.setTaxAmount(tax);
            invoice.setTotalPayable(subtotal + tax);
            invoice.setStatus("UNPAID");

            return invoiceRepository.save(invoice);
        });
    }

    @Override
    public Invoice getInvoiceByOrderId(Long salesOrderId){
        return invoiceRepository.findBySalesOrderId(salesOrderId)
            .orElseThrow(() -> new RuntimeException("Invoice not found for order: " + salesOrderId));
    }

    @Override
    public List<Invoice> getAllInvoices(){
        return invoiceRepository.findAll();
    }
}
