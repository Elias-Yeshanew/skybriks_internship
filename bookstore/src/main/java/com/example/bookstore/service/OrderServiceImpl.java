package com.example.bookstore.service;

import java.util.List;
import java.util.ArrayList;
import org.springframework.stereotype.Service;
import com.example.bookstore.entity.*;
import com.example.bookstore.repository.*;
import com.example.bookstore.exception.ResourceNotFoundException;



@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    public OrderServiceImpl(OrderRepository orderRepository, BookRepository bookRepository, UserRepository userRepository){
        this.orderRepository = orderRepository;
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Order placeOrder(String userEmail, List<Long> bookIds) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email " + userEmail));

        List<OrderItem> orderItems = new ArrayList<>();
        double total = 0.0;

        for (Long bookId : bookIds){
            Book book =  bookRepository.findById(bookId)
                    .orElseThrow(() -> new ResourceNotFoundException("Book not found with id " + bookId));

            OrderItem item = new OrderItem();
            item.setBook(book);
            item.setQuantity(1); // Default quantity to 1 for simplicity
            item.setPrice(book.getPrice());

            total += book.getPrice();
            orderItems.add(item);
        }

        Order order = new Order();
        order.setUser(user);
        order.setOrderItems(orderItems);
        order.setTotalAmount(total);
        order.setOrderStatus(OrderStatus.PENDING);
        order.setPaymentStatus(paymentStatus.PENDING);

        return orderRepository.save(order);
    }

    @Override
    public List<Order> getAllOrders(){
        return orderRepository.findAll();
    }

    @Override
    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id " + id));
    }

    @Override
    public Order updateOrderStatus(Long id, String status){
        Order order  = getOrderById(id);
        order.setOrderStatus(OrderStatus.valueOf(status));

        return orderRepository.save(order);
    }

    @Override
    public Order updatePaymentStatus(Long id, String status){
        Order order = getOrderById(id);
        order.setPaymentStatus(paymentStatus.valueOf(status));

        return orderRepository.save(order);
    }


}