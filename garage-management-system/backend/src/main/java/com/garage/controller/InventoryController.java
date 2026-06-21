package com.garage.controller;

import com.garage.dto.InventoryRequest;
import com.garage.dto.InventoryResponse;
import com.garage.entity.InventoryItem;
import com.garage.service.InventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping
    public ResponseEntity<List<InventoryResponse>> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category) {
        if (search != null && !search.isBlank()) return ResponseEntity.ok(inventoryService.search(search));
        if (category != null) return ResponseEntity.ok(inventoryService.getByCategory(InventoryItem.ItemCategory.valueOf(category.toUpperCase())));
        return ResponseEntity.ok(inventoryService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InventoryResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(inventoryService.getById(id));
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<InventoryResponse>> getLowStock() {
        return ResponseEntity.ok(inventoryService.getLowStock());
    }

    @PostMapping
    public ResponseEntity<InventoryResponse> create(@Valid @RequestBody InventoryRequest req) {
        return ResponseEntity.ok(inventoryService.create(req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<InventoryResponse> update(@PathVariable Long id, @Valid @RequestBody InventoryRequest req) {
        return ResponseEntity.ok(inventoryService.update(id, req));
    }

    @PatchMapping("/{id}/adjust")
    public ResponseEntity<InventoryResponse> adjust(@PathVariable Long id, @RequestBody Map<String, Integer> body) {
        return ResponseEntity.ok(inventoryService.adjustQuantity(id, body.get("delta")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        inventoryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
