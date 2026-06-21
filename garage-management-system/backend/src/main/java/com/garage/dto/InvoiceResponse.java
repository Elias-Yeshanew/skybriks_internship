package com.garage.dto;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class InvoiceResponse {
    private Long id;
    private String invoiceNumber;
    private Long serviceRequestId;
    private String serviceDescription;
    private Long customerId;
    private String customerName;
    private String customerPhone;
    private String vehicleInfo;
    private BigDecimal laborCost;
    private BigDecimal partsCost;
    private BigDecimal taxAmount;
    private BigDecimal totalAmount;
    private LocalDate issueDate;
    private LocalDate dueDate;
    private String status;
    private String notes;
    private LocalDateTime createdAt;
}
