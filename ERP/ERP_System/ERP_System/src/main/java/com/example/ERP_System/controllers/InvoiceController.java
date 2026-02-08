package com.example.ERP_System.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.ERP_System.services.InvoiceService;
import com.example.ERP_System.models.Invoice;

import java.util.List;

@RestController
@RequestMapping("/api/invoices")
@CrossOrigin(origins = "*")
public class InvoiceController {

    @Autowired private InvoiceService invoiceService;

    @PostMapping("/generate/{orderId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_ACCOUNTANT')")
    public Invoice generate(@PathVariable Long orderId){
        return invoiceService.createInvoiceFromOrder(orderId);
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_ACCOUNTANT')")
    public List<Invoice> list(){
        return invoiceService.getAllInvoices();
    }
}
