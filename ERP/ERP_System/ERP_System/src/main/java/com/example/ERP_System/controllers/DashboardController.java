package com.example.ERP_System.controllers;

import com.example.ERP_System.payload.DashboardSummary;
import com.example.ERP_System.services.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/summary")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SALES_EXECUTIVE') or hasRole('INVENTORY_MANAGER')")
    public DashboardSummary getDashboardSummary(){
        return dashboardService.getDashboardSummary();
    }
}