package com.example.ERP_System.services;

import com.example.ERP_System.models.SalesOrder;
import com.example.ERP_System.models.Invoice;
import java.util.List;

public interface SalesService {

    SalesOrder CreateSalesOrder(SalesOrder salesOrder);
    Invoice GenerateInvoice(Long salesOrderId);
    List<SalesOrder> GetAllSalesOrders();
    SalesOrder GetSalesOrderById(Long id);
}
