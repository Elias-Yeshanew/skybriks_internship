package com.garage.dto;
import com.garage.entity.InventoryItem;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class InventoryRequest {
    @NotBlank private String name;
    @NotNull private InventoryItem.ItemCategory category;
    @NotNull @Min(0) private Integer quantity;
    @NotNull @Min(0) private Integer minQuantity;
    private BigDecimal unitPrice;
    private String supplier;
    private String sku;
}
