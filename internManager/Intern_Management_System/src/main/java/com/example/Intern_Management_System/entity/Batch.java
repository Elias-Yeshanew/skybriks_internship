package com.example.Intern_Management_System.entity;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "batches")
@Data
public class Batch {
    
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false)
    private LocalDate startDate;

    @Column(nullable=false)
    private LocalDate endDate;

    @OneToMany(mappedBy = "batch", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("batch")
    private List<Intern> interns;

}
