package com.college.controller;

import com.college.entity.Fee;
import com.college.service.FeeService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fees")
@RequiredArgsConstructor
@Tag(name = "Fees", description = "Fee management endpoints")
@SecurityRequirement(name = "bearerAuth")
public class FeeController {

    private final FeeService feeService;

    @GetMapping
    public ResponseEntity<List<Fee>> getAllFees() {
        return ResponseEntity.ok(feeService.getAllFees());
    }

    @GetMapping("/{studentId}")
    public ResponseEntity<Fee> getFeeByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(feeService.getFeeByStudent(studentId));
    }

    @PostMapping("/student/{studentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Fee> createFee(@PathVariable Long studentId, @RequestBody Fee fee) {
        return ResponseEntity.ok(feeService.createFee(studentId, fee));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Fee> updateFee(@PathVariable Long id, @RequestBody Fee fee) {
        return ResponseEntity.ok(feeService.updateFee(id, fee));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteFee(@PathVariable Long id) {
        feeService.deleteFee(id);
        return ResponseEntity.noContent().build();
    }
}
