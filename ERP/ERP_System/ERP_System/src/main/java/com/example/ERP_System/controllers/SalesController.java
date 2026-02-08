package com.example.ERP_System.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.ERP_System.services.PdfService;
import com.example.ERP_System.models.SalesOrder;
import com.example.ERP_System.services.SalesService;
import com.example.ERP_System.services.InvoiceService;

import jakarta.servlet.http.HttpServletResponse;

import com.example.ERP_System.models.Invoice;

import java.util.List;
import java.io.IOException;


@RestController
@RequestMapping("/api/sales")
public class SalesController {

    @Autowired private SalesService salesService;
    @Autowired private PdfService pdfService;
    @Autowired private InvoiceService invoiceService;

    @PostMapping("/orders")
    @PreAuthorize("hasRole('SALES_EXECUTIVE') or hasRole('ADMIN')")
    public SalesOrder createSalesOrder(@RequestBody SalesOrder salesOrder){
        return salesService.createSalesOrder(salesOrder);
    }

    @GetMapping("/orders")
    @PreAuthorize("hasRole('SALES_EXECUTIVE') or hasRole('ADMIN')")
    public List<SalesOrder> getAllOrders(){
        return salesService.getAllSalesOrders();
    }

    @PostMapping("/orders/{soId}")
    @PreAuthorize("hasRole('SALES_EXECUTIVE') or hasRole('ADMIN')")
    public Invoice generateInvoice(@PathVariable Long soId){
        return salesService.generateInvoice(soId);
    }

    @GetMapping("/orders/{id}/pdf")
    public void exportToPDF(@PathVariable Long id, HttpServletResponse response) throws IOException {
        response.setContentType("application/pdf");
        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=invoice_" + id + ".pdf";
        response.setHeader(headerKey, headerValue);

        SalesOrder order = salesService.getOrderById(id);

        Invoice invoice = invoiceService.getInvoiceByOrderId(id);
        
        pdfService.generateInvoice(response, order, invoice);
    }

}
