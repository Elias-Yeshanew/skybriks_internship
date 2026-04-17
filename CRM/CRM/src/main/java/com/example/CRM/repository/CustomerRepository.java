// CustomerRepository.java
package com.example.CRM.repository;

import com.example.CRM.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
}
