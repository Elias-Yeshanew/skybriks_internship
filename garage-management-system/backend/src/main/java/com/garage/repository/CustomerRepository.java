package com.garage.repository;

import com.garage.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    boolean existsByPhone(String phone);
    boolean existsByEmail(String email);
    Optional<Customer> findByPhone(String phone);
    Optional<Customer> findByEmail(String email);

    @Query("SELECT c FROM Customer c WHERE " +
           "LOWER(c.firstName) LIKE LOWER(CONCAT('%', :term, '%')) OR " +
           "LOWER(c.lastName) LIKE LOWER(CONCAT('%', :term, '%')) OR " +
           "c.phone LIKE CONCAT('%', :term, '%') OR " +
           "LOWER(c.email) LIKE LOWER(CONCAT('%', :term, '%'))")
    List<Customer> search(String term);
}
