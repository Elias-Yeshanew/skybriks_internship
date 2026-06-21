package com.garage.dto;
import com.garage.entity.ServiceRequest;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.math.BigDecimal;
@Data @NoArgsConstructor @AllArgsConstructor
public class StatusUpdateRequest {
    @NotNull private ServiceRequest.ServiceStatus status;
    private BigDecimal actualCost;
    private String notes;
}
