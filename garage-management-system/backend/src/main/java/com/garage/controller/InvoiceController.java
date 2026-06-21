package com.garage.controller;

import com.garage.dto.InvoiceRequest;
import com.garage.dto.InvoiceResponse;
import com.garage.service.InvoiceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;

    @GetMapping
    public ResponseEntity<List<InvoiceResponse>> getAll() {
        return ResponseEntity.ok(invoiceService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InvoiceResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(invoiceService.getById(id));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<InvoiceResponse>> getByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(invoiceService.getByCustomer(customerId));
    }

    @PostMapping
    public ResponseEntity<InvoiceResponse> generate(@Valid @RequestBody InvoiceRequest req) {
        return ResponseEntity.ok(invoiceService.generate(req));
    }

    @PatchMapping("/{id}/pay")
    public ResponseEntity<InvoiceResponse> markAsPaid(@PathVariable Long id) {
        return ResponseEntity.ok(invoiceService.markAsPaid(id));
    }
}
