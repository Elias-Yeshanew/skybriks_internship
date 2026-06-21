package com.garage.controller;

import com.garage.dto.MechanicRequest;
import com.garage.dto.MechanicResponse;
import com.garage.service.MechanicService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mechanics")
@RequiredArgsConstructor
public class MechanicController {

    private final MechanicService mechanicService;

    @GetMapping
    public ResponseEntity<List<MechanicResponse>> getAll() {
        return ResponseEntity.ok(mechanicService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MechanicResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(mechanicService.getById(id));
    }

    @GetMapping("/available")
    public ResponseEntity<List<MechanicResponse>> getAvailable() {
        return ResponseEntity.ok(mechanicService.getAvailable());
    }

    @PostMapping
    public ResponseEntity<MechanicResponse> create(@Valid @RequestBody MechanicRequest req) {
        return ResponseEntity.ok(mechanicService.create(req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MechanicResponse> update(@PathVariable Long id, @Valid @RequestBody MechanicRequest req) {
        return ResponseEntity.ok(mechanicService.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        mechanicService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
