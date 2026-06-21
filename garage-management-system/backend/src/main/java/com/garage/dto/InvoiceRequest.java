package com.garage.dto;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.math.BigDecimal;
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class InvoiceRequest {
    @NotNull private Long serviceRequestId;
    private BigDecimal laborCost;
    private BigDecimal partsCost;
    private String notes;
}
