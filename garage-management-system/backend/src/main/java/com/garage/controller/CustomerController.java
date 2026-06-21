package com.garage.controller;

import com.garage.dto.CustomerRequest;
import com.garage.dto.CustomerResponse;
import com.garage.dto.VehicleResponse;
import com.garage.service.CustomerService;
import com.garage.service.VehicleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;
    private final VehicleService vehicleService;

    @GetMapping
    public ResponseEntity<List<CustomerResponse>> getAll(@RequestParam(required = false) String search) {
        if (search != null && !search.isBlank())
            return ResponseEntity.ok(customerService.search(search));
        return ResponseEntity.ok(customerService.getAllCustomers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(customerService.getById(id));
    }

    @PostMapping
    public ResponseEntity<CustomerResponse> create(@Valid @RequestBody CustomerRequest req) {
        return ResponseEntity.ok(customerService.create(req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomerResponse> update(@PathVariable Long id, @Valid @RequestBody CustomerRequest req) {
        return ResponseEntity.ok(customerService.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        customerService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/vehicles")
    public ResponseEntity<List<VehicleResponse>> getVehicles(@PathVariable Long id) {
        return ResponseEntity.ok(vehicleService.getByCustomer(id));
    }
}
