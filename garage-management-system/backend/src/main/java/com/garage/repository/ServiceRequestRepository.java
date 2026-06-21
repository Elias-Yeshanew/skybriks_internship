package com.garage.repository;

import com.garage.entity.ServiceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {

    List<ServiceRequest> findByStatus(ServiceRequest.ServiceStatus status);
    List<ServiceRequest> findByVehicleId(Long vehicleId);
    List<ServiceRequest> findByMechanicId(Long mechanicId);

    @Query("SELECT s FROM ServiceRequest s WHERE s.vehicle.customer.id = :customerId")
    List<ServiceRequest> findByCustomerId(Long customerId);

    long countByStatus(ServiceRequest.ServiceStatus status);

    @Query("SELECT COALESCE(SUM(s.actualCost), 0) FROM ServiceRequest s " +
           "WHERE s.status = 'COMPLETED' AND s.completionDate BETWEEN :start AND :end")
    BigDecimal sumRevenueForPeriod(LocalDate start, LocalDate end);

    @Query("SELECT MONTH(s.completionDate) as month, COALESCE(SUM(s.actualCost), 0) as revenue " +
           "FROM ServiceRequest s WHERE s.status = 'COMPLETED' AND YEAR(s.completionDate) = :year " +
           "GROUP BY MONTH(s.completionDate) ORDER BY MONTH(s.completionDate)")
    List<Object[]> monthlyRevenue(int year);
}
