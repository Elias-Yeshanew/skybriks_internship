package com.garage.service;

import com.garage.dto.InventoryRequest;
import com.garage.dto.InventoryResponse;
import com.garage.entity.InventoryItem;
import com.garage.exception.ResourceNotFoundException;
import com.garage.repository.InventoryItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class InventoryService {

    private final InventoryItemRepository inventoryRepository;

    public List<InventoryResponse> getAll() {
        return inventoryRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public InventoryResponse getById(Long id) {
        return toResponse(findOrThrow(id));
    }

    public List<InventoryResponse> getLowStock() {
        return inventoryRepository.findLowStockItems().stream()
            .map(this::toResponse).collect(Collectors.toList());
    }

    public List<InventoryResponse> getByCategory(InventoryItem.ItemCategory category) {
        return inventoryRepository.findByCategory(category).stream()
            .map(this::toResponse).collect(Collectors.toList());
    }

    public List<InventoryResponse> search(String term) {
        return inventoryRepository.search(term).stream()
            .map(this::toResponse).collect(Collectors.toList());
    }

    public InventoryResponse create(InventoryRequest req) {
        InventoryItem item = InventoryItem.builder()
            .name(req.getName())
            .category(req.getCategory())
            .quantity(req.getQuantity())
            .minQuantity(req.getMinQuantity())
            .unitPrice(req.getUnitPrice())
            .supplier(req.getSupplier())
            .sku(req.getSku())
            .build();
        return toResponse(inventoryRepository.save(item));
    }

    public InventoryResponse update(Long id, InventoryRequest req) {
        InventoryItem item = findOrThrow(id);
        item.setName(req.getName());
        item.setCategory(req.getCategory());
        item.setQuantity(req.getQuantity());
        item.setMinQuantity(req.getMinQuantity());
        item.setUnitPrice(req.getUnitPrice());
        item.setSupplier(req.getSupplier());
        item.setSku(req.getSku());
        return toResponse(inventoryRepository.save(item));
    }

    public InventoryResponse adjustQuantity(Long id, int delta) {
        InventoryItem item = findOrThrow(id);
        int newQty = item.getQuantity() + delta;
        if (newQty < 0) throw new IllegalArgumentException("Quantity cannot go below zero");
        item.setQuantity(newQty);
        return toResponse(inventoryRepository.save(item));
    }

    public void delete(Long id) {
        findOrThrow(id);
        inventoryRepository.deleteById(id);
    }

    private InventoryItem findOrThrow(Long id) {
        return inventoryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("InventoryItem", id));
    }

    private InventoryResponse toResponse(InventoryItem i) {
        return InventoryResponse.builder()
            .id(i.getId())
            .name(i.getName())
            .category(i.getCategory())
            .quantity(i.getQuantity())
            .minQuantity(i.getMinQuantity())
            .unitPrice(i.getUnitPrice())
            .supplier(i.getSupplier())
            .sku(i.getSku())
            .lowStock(i.isLowStock())
            .lastUpdated(i.getLastUpdated())
            .build();
    }
}
