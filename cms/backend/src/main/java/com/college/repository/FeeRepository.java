package com.college.repository;

import com.college.entity.Fee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface FeeRepository extends JpaRepository<Fee, Long> {
    Optional<Fee> findByStudentId(Long studentId);
    List<Fee> findByPaymentStatus(Fee.PaymentStatus status);

    @Query("SELECT SUM(f.paidAmount) FROM Fee f")
    BigDecimal totalPaidAmount();

    @Query("SELECT SUM(f.dueAmount) FROM Fee f")
    BigDecimal totalDueAmount();
}
