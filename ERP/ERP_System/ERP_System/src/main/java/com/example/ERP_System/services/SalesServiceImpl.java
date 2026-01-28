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

    @Override
    public List<SalesOrder> getAllSalesOrders(){
        return salesOrderRepository.findAll();
    }

    @Override
    @Transactional
    public Invoice generateInvoice(Long salesOrderId){
        SalesOrder so = salesOrderRepository.findById(salesOrderId)
                .orElseThrow(() -> new RuntimeException("Sales Order not found with id " + salesOrderId));
        
        Invoice invoice = new Invoice();
        invoice.setSalesOrder(so);
        invoice.setInvoiceNumber("INV-"+UUID.randomUUID().toString().substring(0,8).toUpperCase());

        double tax = so.getTotalPayable() * 0.15; 
        invoice.setTaxAmount(tax);
        invoice.setTotalPayable(so.getTotalPayable() + tax);
        invoice.setStatus("UNPAID");

        retrun invoiceRepository.save(invoice);

    }
}
