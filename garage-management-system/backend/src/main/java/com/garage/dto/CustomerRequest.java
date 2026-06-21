package com.garage.dto;
import jakarta.validation.constraints.*;
import lombok.*;
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class CustomerRequest {
    @NotBlank(message = "First name is required") @Size(min=2,max=50) private String firstName;
    @NotBlank(message = "Last name is required") @Size(min=2,max=50) private String lastName;
    @NotBlank(message = "Phone is required") @Pattern(regexp="^[0-9+\\-\\s]{7,20}$") private String phone;
    @Email private String email;
    private String address;
}
