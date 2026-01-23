package com.example.ERP_System.repository;

import com.example.ERP_System.models.Role;
import com.example.ERP_System.models.ERole;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Integer>{
    Optional<Role> findByName(ERole name);
}
