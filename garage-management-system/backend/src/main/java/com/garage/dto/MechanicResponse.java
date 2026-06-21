package com.garage.dto;
import com.garage.entity.Mechanic;
import lombok.*;
import java.time.LocalDateTime;
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class MechanicResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String phone;
    private String email;
    private String specialization;
    private Double hourlyRate;
    private Mechanic.MechanicStatus status;
    private LocalDateTime hiredDate;
    private int activeJobs;
}
