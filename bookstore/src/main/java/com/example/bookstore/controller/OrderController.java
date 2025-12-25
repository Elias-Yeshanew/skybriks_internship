package com.example.bookstore.controller;

import com.example.bookstore.service.OrderService;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.* ;
import java.util.List;
import com.example.bookstore.entity.Order;


@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    // @PreAuthorize("hasRole('ADMIN')")
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    @GetMapping("/{id}")
    // @PreAuthorize("hasRole('ADMIN') or hasRole('CUSTOMER')")
    public OrderService getOrderService() {
        return orderService;
    }

    @PostMapping
    // @PreAuthorize("hasRole('CUSTOMER')")
    public Order placeOrder(@RequestParam String userEmail, @RequestBody List<Long> bookIds) {
        return orderService.placeOrder(userEmail, bookIds);
    }

    @PutMapping("/{id}/status")
    // @PreAuthorize("hasRole('ADMIN')")
    public Order updateOrderStatus(@PathVariable Long id, @RequestBody String status) {
        return orderService.updateOrderStatus(id, status);
    }

    @PutMapping("/{id}/payment-status")
    // @PreAuthorize("hasRole('ADMIN')")
    public Order updatePaymentStatus(@PathVariable Long id, @RequestBody String status) {
        return orderService.updatePaymentStatus(id, status);
    }

}
