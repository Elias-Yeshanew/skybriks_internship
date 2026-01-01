package com.example.bookstore.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping ;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.bookstore.entity.Order;
import com.example.bookstore.service.OrderService;


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
