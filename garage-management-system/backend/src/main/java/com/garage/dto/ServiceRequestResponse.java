package com.garage.dto;
import com.garage.entity.ServiceRequest;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class ServiceRequestResponse {
    private Long id;
    private Long vehicleId;
    private String vehicleInfo;
    private Long customerId;
    private String customerName;
    private Long mechanicId;
    private String mechanicName;
    private String description;
    private ServiceRequest.ServiceStatus status;
    private BigDecimal estimatedCost;
    private BigDecimal actualCost;
    private LocalDate requestDate;
    private LocalDate completionDate;
    private String notes;
    private LocalDateTime createdAt;
}
