// LeadRepository.java
package com.example.CRM.repository;

import com.example.CRM.model.Lead;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeadRepository extends JpaRepository<Lead, Long> {
}