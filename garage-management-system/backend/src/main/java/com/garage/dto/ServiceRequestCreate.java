package com.garage.dto;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class ServiceRequestCreate {
    @NotNull private Long vehicleId;
    private Long mechanicId;
    @NotBlank private String description;
    private BigDecimal estimatedCost;
    private String notes;
}
