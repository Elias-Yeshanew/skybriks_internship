package com.example.ERP_System.services;

import com.example.ERP_System.payload.DashboardSummary;
import com.example.ERP_System.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DashboardServiceImpl implements DashboardService{

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private SalesOrderRepository salesOrderRepository;

    @Autowired
    private PurchaseOrderRepository purchaseOrderRepository;


    @Override
    public DashboardSummary getDashboardSummary(){
        long products = productRepository.count();
        long customers = customerRepository.count();
        Double sales = salesOrderRepository.sumTotalSales();
        Double purchase = purchaseOrderRepository.sumTotalPurchase();
        long lowStock = productRepository.countLowStockProducts();
        long pending = purchaseOrderRepository.countPendingOrders();

        return new DashboardSummary(
            products,
            customers,
            sales != null ? sales : 0.0,
            purchase != null ? purchase : 0.0,
            lowStock,
            pending
        );
    }
}