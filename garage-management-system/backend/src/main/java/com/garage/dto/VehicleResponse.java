package com.garage.dto;
import lombok.*;
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class VehicleResponse {
    private Long id;
    private String licensePlate;
    private String make;
    private String model;
    private Integer year;
    private String vinNumber;
    private Long customerId;
    private String customerName;
}
