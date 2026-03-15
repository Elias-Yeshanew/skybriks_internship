package com.example.Intern_Management_System.entity;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "interns")
@Data
public class Intern {
    
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @Column(unique=true, nullable=false)
    private String internIdStr;

    private String name;
    private String email;
    private String phone;
    private String idCardType;
    private LocalDate joiningDate;

    @ManyToOne
    @JoinColumn(name="batch_id", nullable=false)
    @JsonIgnoreProperties("interns")
    private Batch batch;
}
