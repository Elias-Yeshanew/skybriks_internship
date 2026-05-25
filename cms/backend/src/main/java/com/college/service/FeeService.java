package com.college.service;

import com.college.entity.Fee;
import com.college.entity.Student;
import com.college.repository.FeeRepository;
import com.college.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FeeService {

    private final FeeRepository feeRepository;
    private final StudentRepository studentRepository;

    public List<Fee> getAllFees() {
        return feeRepository.findAll();
    }

    public Fee getFeeByStudent(Long studentId) {
        return feeRepository.findByStudentId(studentId)
                .orElseThrow(() -> new RuntimeException("Fee record not found for student: " + studentId));
    }

    public Fee createFee(Long studentId, Fee fee) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        fee.setStudent(student);
        fee.setDueAmount(fee.getTotalAmount().subtract(fee.getPaidAmount()));
        fee.setPaymentStatus(resolveStatus(fee));
        return feeRepository.save(fee);
    }

    public Fee updateFee(Long id, Fee updated) {
        Fee fee = feeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fee not found"));
        fee.setTotalAmount(updated.getTotalAmount());
        fee.setPaidAmount(updated.getPaidAmount());
        fee.setDueAmount(updated.getTotalAmount().subtract(updated.getPaidAmount()));
        fee.setPaymentStatus(resolveStatus(fee));
        fee.setPaymentDates(updated.getPaymentDates());
        return feeRepository.save(fee);
    }

    public void deleteFee(Long id) {
        feeRepository.deleteById(id);
    }

    public BigDecimal getTotalCollected() {
        BigDecimal val = feeRepository.totalPaidAmount();
        return val != null ? val : BigDecimal.ZERO;
    }

    public BigDecimal getTotalPending() {
        BigDecimal val = feeRepository.totalDueAmount();
        return val != null ? val : BigDecimal.ZERO;
    }

    private Fee.PaymentStatus resolveStatus(Fee fee) {
        if (fee.getDueAmount().compareTo(BigDecimal.ZERO) == 0) return Fee.PaymentStatus.PAID;
        if (fee.getPaidAmount().compareTo(BigDecimal.ZERO) == 0) return Fee.PaymentStatus.DUE;
        return Fee.PaymentStatus.PARTIAL;
    }
}
