package com.college.controller;

import com.college.repository.DocumentRepository;
import com.college.repository.StudentRepository;
import com.college.service.FeeService;
import com.college.service.MarksService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Dashboard summary endpoints")
@SecurityRequirement(name = "bearerAuth")
public class DashboardController {

    private final StudentRepository studentRepository;
    private final FeeService feeService;
    private final MarksService marksService;
    private final DocumentRepository documentRepository;

    @Data
    @Builder
    static class DashboardStats {
        private long totalStudents;
        private BigDecimal totalFeesCollected;
        private BigDecimal totalFeesPending;
        private long totalDocuments;
        private Map<String, Double> averageMarksByDept;
    }

    @GetMapping
    public ResponseEntity<DashboardStats> getDashboard() {
        DashboardStats stats = DashboardStats.builder()
                .totalStudents(studentRepository.count())
                .totalFeesCollected(feeService.getTotalCollected())
                .totalFeesPending(feeService.getTotalPending())
                .totalDocuments(documentRepository.count())
                .averageMarksByDept(marksService.getAverageMarksByDepartment())
                .build();
        return ResponseEntity.ok(stats);
    }
}
