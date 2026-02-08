package com.example.ERP_System.services;

import com.example.ERP_System.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import com.example.ERP_System.models.SalesOrderItem;
import com.example.ERP_System.models.Product;
import com.example.ERP_System.models.OrderStatus;
import com.example.ERP_System.models.Invoice;
import com.example.ERP_System.models.SalesOrder;

import java.util.List;
import  java.util.UUID;
import java.math.BigDecimal;

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

            total += product.getUnitPrice()
                    .multiply(BigDecimal.valueOf(item.getQuantity()))
                    .doubleValue();
        }

        order.setTotalAmount(total);
        order.setStatus(OrderStatus.ORDERED);
        return salesOrderRepository.save(order);
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
        invoice.setInvoiceNumber("INV-" + UUID.randomUUID().toString().substring(0,8).toUpperCase());

        double tax = so.getTotalAmount() * 0.15; // Assuming 15% tax rate
        invoice.setTaxAmount(tax);
        invoice.setTotalPayable(so.getTotalAmount() + tax);
        invoice.setStatus("UNPAID");
        System.out.println("Tax" + tax);
        return invoiceRepository.save(invoice);

    }

    @Override
    @Transactional
    public SalesOrder getSalesOrderById(Long id){
        return salesOrderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Sales Order not found with id " + id));
    }

    @Override
    @Transactional
    public SalesOrder getOrderById(Long id){
        return salesOrderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Sales Order not found with id " + id));
    }

    @Override
    public Invoice getInvoiceByOrderId(Long soId){
        return invoiceRepository.findBySalesOrderId(soId)
            .orElseThrow(() -> new  RuntimeException("Order not found by Order Id" + soId));
    }
}
