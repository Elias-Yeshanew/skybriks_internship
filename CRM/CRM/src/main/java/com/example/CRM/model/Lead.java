package com.example.CRM.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "leads")
public class Lead {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String contactInfo;
    
    private String source; // e.g., Referral, Ads, Web
    private String status; // e.g., New, Contacted, Converted, Lost

    @ManyToOne
    @JoinColumn(name = "assigned_to", referencedColumnName = "id")
    private User assignedTo;

    private LocalDateTime createdAt = LocalDateTime.now();
}