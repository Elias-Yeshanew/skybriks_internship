package com.garage.dto;
import com.garage.entity.Mechanic;
import jakarta.validation.constraints.*;
import lombok.*;
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class MechanicRequest {
    @NotBlank private String firstName;
    @NotBlank private String lastName;
    @NotBlank private String phone;
    @Email private String email;
    private String specialization;
    private Double hourlyRate;
    private Mechanic.MechanicStatus status;
}
