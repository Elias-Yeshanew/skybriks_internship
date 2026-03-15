package com.example.Intern_Management_System.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Intern_Management_System.entity.Batch;

import java.time.LocalDate;

@Repository
public interface BatchRepository extends JpaRepository<Batch, Long> {
    boolean existsByStartDate(LocalDate startDate);
}
