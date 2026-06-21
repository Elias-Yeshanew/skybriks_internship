package com.garage.dto;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class DashboardStats {
    private long totalCustomers;
    private long totalVehicles;
    private long pendingRequests;
    private long inProgressRequests;
    private long completedThisMonth;
    private BigDecimal revenueThisMonth;
    private long lowStockItems;
    private List<MonthlyRevenue> monthlyRevenue;
    private List<ServiceRequestResponse> recentRequests;
}
