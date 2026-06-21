package com.garage.dto;
import jakarta.validation.constraints.*;
import lombok.*;
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class VehicleRequest {
    @NotBlank private String licensePlate;
    @NotBlank private String make;
    @NotBlank private String model;
    @Min(1900) @Max(2100) private Integer year;
    private String vinNumber;
    @NotNull private Long customerId;
}
