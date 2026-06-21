package com.garage.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "mechanics")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Mechanic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name", nullable = false, length = 50)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 50)
    private String lastName;

    @Column(unique = true, nullable = false, length = 20)
    private String phone;

    @Column(unique = true, length = 100)
    private String email;

    @Column(length = 100)
    private String specialization;

    @Column(name = "hourly_rate")
    private Double hourlyRate;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private MechanicStatus status = MechanicStatus.AVAILABLE;

    @CreationTimestamp
    @Column(name = "hired_date", updatable = false)
    private LocalDateTime hiredDate;

    @OneToMany(mappedBy = "mechanic")
    private List<ServiceRequest> serviceRequests = new ArrayList<>();

    public enum MechanicStatus {
        AVAILABLE, BUSY, ON_LEAVE
    }
}
