package com.example.ERP_System.services;

import java.util.List;

import com.example.ERP_System.models.Invoice;
import com.example.ERP_System.models.SalesOrder;

public interface SalesService {

    SalesOrder createSalesOrder(SalesOrder salesOrder);
    Invoice generateInvoice(Long salesOrderId);
    List<SalesOrder> getAllSalesOrders();
    SalesOrder getSalesOrderById(Long id);
}
