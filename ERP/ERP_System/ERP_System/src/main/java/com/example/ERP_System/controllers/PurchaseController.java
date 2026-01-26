package com.example.ERP_System.controllers;

import com.example.ERP_System.models.PurchaseOrder;
import com.example.ERP_System.models.Grn;
import com.example.ERP_System.services.PurchaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/purchases")
public class PurchaseController {

    @Autowired private PurchaseService purchaseService;

    @PostMapping("/orders")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PURCHASE_MANAGER')")
    public PurchaseOrder createOrder(@RequestBody PurchaseOrder order) {
        return purchaseService.createPurchaseOrder(order);
    }

    @GetMapping("/orders")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PURCHASE_MANAGER')")
    public List<PurchaseOrder> getAllOrders() {
        return purchaseService.getAllPurchaseOrders();
    }

    @PostMapping("/grn/{poId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('INVENTORY_MANAGER')")
    public Grn receiveItems(@PathVariable Long poId, @RequestParam String receivedBy) {
        return purchaseService.createGrn(poId, receivedBy);
    }
}