package com.college.controller;

import com.college.entity.Marks;
import com.college.service.MarksService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/marks")
@RequiredArgsConstructor
@Tag(name = "Marks", description = "Marks management endpoints")
@SecurityRequirement(name = "bearerAuth")
public class MarksController {

    private final MarksService marksService;

    @GetMapping
    public ResponseEntity<List<Marks>> getAllMarks() {
        return ResponseEntity.ok(marksService.getAllMarks());
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Marks>> getMarksByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(marksService.getMarksByStudent(studentId));
    }

    @PostMapping("/student/{studentId}")
    public ResponseEntity<Marks> addMarks(@PathVariable Long studentId, @RequestBody Marks marks) {
        return ResponseEntity.ok(marksService.addMarks(studentId, marks));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Marks> updateMarks(@PathVariable Long id, @RequestBody Marks marks) {
        return ResponseEntity.ok(marksService.updateMarks(id, marks));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMarks(@PathVariable Long id) {
        marksService.deleteMarks(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/avg-by-dept")
    public ResponseEntity<Map<String, Double>> getAvgByDept() {
        return ResponseEntity.ok(marksService.getAverageMarksByDepartment());
    }
}
