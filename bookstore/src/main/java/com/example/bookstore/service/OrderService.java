package com.example.bookstore.service;

import java.util.List;
import com.example.bookstore.entity.Order;

public interface OrderService {

    Order placeOrder(String userEmail, List<Long> bookIds);

    List<Order> getAllOrders();

    Order getOrderById(Long id);

    Order updateOrderStatus(Long id, String status);

    Order updatePaymentStatus(Long id, String status);

}
