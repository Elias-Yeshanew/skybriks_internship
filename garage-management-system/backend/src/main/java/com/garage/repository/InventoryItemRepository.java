package com.garage.repository;

import com.garage.entity.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryItemRepository extends JpaRepository<InventoryItem, Long> {

    List<InventoryItem> findByCategory(InventoryItem.ItemCategory category);

    @Query("SELECT i FROM InventoryItem i WHERE i.quantity <= i.minQuantity")
    List<InventoryItem> findLowStockItems();

    boolean existsBySku(String sku);

    @Query("SELECT i FROM InventoryItem i WHERE LOWER(i.name) LIKE LOWER(CONCAT('%', :term, '%')) " +
           "OR LOWER(i.supplier) LIKE LOWER(CONCAT('%', :term, '%'))")
    List<InventoryItem> search(String term);
}
