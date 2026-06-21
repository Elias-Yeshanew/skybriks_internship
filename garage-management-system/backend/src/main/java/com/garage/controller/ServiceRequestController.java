package com.garage.controller;

import com.garage.dto.ServiceRequestCreate;
import com.garage.dto.ServiceRequestResponse;
import com.garage.dto.StatusUpdateRequest;
import com.garage.entity.ServiceRequest;
import com.garage.service.ServiceRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/service-requests")
@RequiredArgsConstructor
public class ServiceRequestController {

    private final ServiceRequestService serviceRequestService;

    @GetMapping
    public ResponseEntity<List<ServiceRequestResponse>> getAll(
            @RequestParam(required = false) String status) {
        if (status != null) {
            return ResponseEntity.ok(serviceRequestService.getByStatus(
                ServiceRequest.ServiceStatus.valueOf(status.toUpperCase())));
        }
        return ResponseEntity.ok(serviceRequestService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceRequestResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(serviceRequestService.getById(id));
    }

    @PostMapping
    public ResponseEntity<ServiceRequestResponse> create(@Valid @RequestBody ServiceRequestCreate req) {
        return ResponseEntity.ok(serviceRequestService.create(req));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ServiceRequestResponse> updateStatus(
            @PathVariable Long id, @Valid @RequestBody StatusUpdateRequest req) {
        return ResponseEntity.ok(serviceRequestService.updateStatus(id, req));
    }

    @PatchMapping("/{id}/assign/{mechanicId}")
    public ResponseEntity<ServiceRequestResponse> assignMechanic(
            @PathVariable Long id, @PathVariable Long mechanicId) {
        return ResponseEntity.ok(serviceRequestService.assignMechanic(id, mechanicId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        serviceRequestService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
