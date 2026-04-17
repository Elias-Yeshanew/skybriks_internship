package com.example.CRM.controller;

import com.example.CRM.model.Sale;
import com.example.CRM.repository.SaleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sales")
@CrossOrigin(origins = "http://localhost:3000")
public class SaleController {

    @Autowired
    private SaleRepository saleRepository;

    @GetMapping
    public Page<Sale> getAllSales(Pageable pageable) {
        return saleRepository.findAll(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Sale> getSaleById(@PathVariable Long id) {
        return saleRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Sale createSale(@RequestBody Sale sale) {
        return saleRepository.save(sale);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Sale> updateSale(@PathVariable Long id, @RequestBody Sale saleDetails) {
        return saleRepository.findById(id)
                .map(sale -> {
                    saleDetails.setId(id);
                    if (saleDetails.getCreatedAt() == null) saleDetails.setCreatedAt(sale.getCreatedAt());
                    if (saleDetails.getAssignedTo() == null) saleDetails.setAssignedTo(sale.getAssignedTo());
                    if (saleDetails.getCustomer() == null) saleDetails.setCustomer(sale.getCustomer());
                    return ResponseEntity.ok(saleRepository.save(saleDetails));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSale(@PathVariable Long id) {
        saleRepository.deleteById(id);
        return ResponseEntity.ok("Sale deleted successfully");
    }
}
