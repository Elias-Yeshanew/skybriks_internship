package com.example.ERP_System.payload;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardSummary {
    private long totalProducts;
    private long totalCustomers;
    private Double totalSalesAmount;
    private Double totalPurchaseAmount;
    private long lowStockCount;
    private long pendingOrders;
}