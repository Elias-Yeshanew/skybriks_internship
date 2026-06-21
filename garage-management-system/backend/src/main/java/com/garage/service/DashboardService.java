package com.garage.service;

import com.garage.dto.DashboardStats;
import com.garage.dto.MonthlyRevenue;
import com.garage.entity.ServiceRequest;
import com.garage.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Month;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final CustomerRepository customerRepository;
    private final VehicleRepository vehicleRepository;
    private final ServiceRequestRepository serviceRequestRepository;
    private final InventoryItemRepository inventoryRepository;
    private final ServiceRequestService serviceRequestService;

    public DashboardStats getStats() {
        LocalDate now = LocalDate.now();
        LocalDate startOfMonth = now.withDayOfMonth(1);

        long pending = serviceRequestRepository.countByStatus(ServiceRequest.ServiceStatus.PENDING);
        long inProgress = serviceRequestRepository.countByStatus(ServiceRequest.ServiceStatus.IN_PROGRESS);
        long completedMonth = serviceRequestRepository
            .findByStatus(ServiceRequest.ServiceStatus.COMPLETED).stream()
            .filter(sr -> sr.getCompletionDate() != null
                && !sr.getCompletionDate().isBefore(startOfMonth))
            .count();

        BigDecimal revenue = serviceRequestRepository.sumRevenueForPeriod(startOfMonth, now);

        long lowStock = inventoryRepository.findLowStockItems().size();

        // Monthly revenue for current year
        List<Object[]> rawRevenue = serviceRequestRepository.monthlyRevenue(now.getYear());
        List<MonthlyRevenue> monthlyList = buildMonthlyRevenue(rawRevenue);

        // Last 10 service requests
        var recentRequests = serviceRequestRepository.findAll().stream()
            .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
            .limit(10)
            .map(serviceRequestService::toResponse)
            .toList();

        return DashboardStats.builder()
            .totalCustomers(customerRepository.count())
            .totalVehicles(vehicleRepository.count())
            .pendingRequests(pending)
            .inProgressRequests(inProgress)
            .completedThisMonth(completedMonth)
            .revenueThisMonth(revenue != null ? revenue : BigDecimal.ZERO)
            .lowStockItems(lowStock)
            .monthlyRevenue(monthlyList)
            .recentRequests(recentRequests)
            .build();
    }

    private List<MonthlyRevenue> buildMonthlyRevenue(List<Object[]> raw) {
        List<MonthlyRevenue> result = new ArrayList<>();
        for (Object[] row : raw) {
            int monthNum = ((Number) row[0]).intValue();
            BigDecimal rev = row[1] instanceof BigDecimal
                ? (BigDecimal) row[1]
                : BigDecimal.valueOf(((Number) row[1]).doubleValue());
            result.add(new MonthlyRevenue(Month.of(monthNum).name(), rev));
        }
        return result;
    }
}
