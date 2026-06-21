package com.garage.dto;
import com.garage.entity.InventoryItem;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class InventoryResponse {
    private Long id;
    private String name;
    private InventoryItem.ItemCategory category;
    private Integer quantity;
    private Integer minQuantity;
    private BigDecimal unitPrice;
    private String supplier;
    private String sku;
    private boolean lowStock;
    private LocalDateTime lastUpdated;
}
