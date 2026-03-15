package com.example.Intern_Management_System.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.Intern_Management_System.entity.Intern;
import java.time.LocalDate;

@Repository
public interface InternRepository extends JpaRepository<Intern, Long> {
    long countByJoiningDate(LocalDate joiningDate);
    
}
