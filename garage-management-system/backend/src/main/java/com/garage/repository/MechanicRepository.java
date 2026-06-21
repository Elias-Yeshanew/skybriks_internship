package com.garage.repository;

import com.garage.entity.Mechanic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MechanicRepository extends JpaRepository<Mechanic, Long> {
    List<Mechanic> findByStatus(Mechanic.MechanicStatus status);
    boolean existsByPhone(String phone);
    boolean existsByEmail(String email);
}
