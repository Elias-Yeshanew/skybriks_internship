package com.example.ERP_System.services;

import com.example.ERP_System.models.*;
import com.example.ERP_System.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import  java.util.UUID;

@Service
public class SalesServiceImpl implements SalesService {

    @Autowired
    private SalesOrderRepository salesOrderRepository;
    @Autowired
    private InvoiceRepository invoiceRepository;
    @Autowired
    private ProductRepository productRepository;

    @Override
    @Transactional
    public SalesOrder createSalesOrder(SalesOrder order){
        double total = 0;

        for (SalesOrderItem item : order.getItems()){
            Product product = productRepository.findById(item.getProduct().getId())
                    .orElseThrow(() -> new RuntimeException("Product not fouund with id " + item.getProduct().getId()));

            if (product.getCurrentStock() < item.getQuantity()){
                throw new RuntimeException("Insufficient stock for product " + product.getName());
            }

            product.setCurrentStock(product.getCurrentStock() - item.getQuantity());
            productRepository.save(product);

            total += product.getUnitPrice() * item.getQuantity();
        }

        order.setTotalAmount(total);
        order.setStatus(OrderStatus.ORDERED);
        retrun salesOrderRepository.save(order);
    }
}
