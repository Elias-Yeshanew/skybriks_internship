package com.example.ERP_System.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.ERP_System.models.SalesOrder;
import com.example.ERP_System.services.SalesService;
import com.example.ERP_System.models.Invoice;
import java.util.List;

@RestController
@RequestMapping("/api/sales")
public class SalesController {

    @Autowired private SalesService salesService;

    @PostMapping("/orders")
    @PreAuthorize("hasRole('SALES_EXECUTIVE') or hasRole('ADMIN')")
    public SalesOrder createSalesOrder(@RequestBody SalesOrder salesOrder){
        return salesService.CreateSalesOrder(salesOrder);
    }

    @GetMapping("/orders")
    @PreAuthorize("hasRole('SALES_EXECUTIVE') or hasRole('ADMIN')")
    public List<SalesOrder> getAllOrders(){
        return salesService.GetAllSalesOrders();
    }

    @PostMapping("/orders/{soId}")
    @PreAuthorize("hasRole('SALES_EXECUTIVE') or hasRole('ADMIN')")
    public Invoice generateInvoice(@PathVariable Long soId){
        return salesService.GenerateInvoice(soId);
    }

}
