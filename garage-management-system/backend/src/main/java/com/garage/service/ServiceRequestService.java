package com.garage.service;

import com.garage.dto.ServiceRequestCreate;
import com.garage.dto.ServiceRequestResponse;
import com.garage.dto.StatusUpdateRequest;
import com.garage.entity.Mechanic;
import com.garage.entity.ServiceRequest;
import com.garage.entity.Vehicle;
import com.garage.exception.ResourceNotFoundException;
import com.garage.repository.ServiceRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ServiceRequestService {

    private final ServiceRequestRepository serviceRequestRepository;
    private final VehicleService vehicleService;
    private final MechanicService mechanicService;

    public List<ServiceRequestResponse> getAll() {
        return serviceRequestRepository.findAll().stream()
            .map(this::toResponse).collect(Collectors.toList());
    }

    public ServiceRequestResponse getById(Long id) {
        return toResponse(findOrThrow(id));
    }

    public List<ServiceRequestResponse> getByStatus(ServiceRequest.ServiceStatus status) {
        return serviceRequestRepository.findByStatus(status).stream()
            .map(this::toResponse).collect(Collectors.toList());
    }

    public List<ServiceRequestResponse> getByCustomer(Long customerId) {
        return serviceRequestRepository.findByCustomerId(customerId).stream()
            .map(this::toResponse).collect(Collectors.toList());
    }

    public List<ServiceRequestResponse> getByVehicle(Long vehicleId) {
        return serviceRequestRepository.findByVehicleId(vehicleId).stream()
            .map(this::toResponse).collect(Collectors.toList());
    }

    public ServiceRequestResponse create(ServiceRequestCreate req) {
        Vehicle vehicle = vehicleService.findOrThrow(req.getVehicleId());

        ServiceRequest sr = ServiceRequest.builder()
            .vehicle(vehicle)
            .description(req.getDescription())
            .estimatedCost(req.getEstimatedCost())
            .notes(req.getNotes())
            .status(ServiceRequest.ServiceStatus.PENDING)
            .requestDate(LocalDate.now())
            .build();

        if (req.getMechanicId() != null) {
            sr.setMechanic(mechanicService.findOrThrow(req.getMechanicId()));
        }

        return toResponse(serviceRequestRepository.save(sr));
    }

    public ServiceRequestResponse updateStatus(Long id, StatusUpdateRequest req) {
        ServiceRequest sr = findOrThrow(id);
        sr.setStatus(req.getStatus());

        if (req.getActualCost() != null) sr.setActualCost(req.getActualCost());
        if (req.getNotes() != null) sr.setNotes(req.getNotes());

        if (req.getStatus() == ServiceRequest.ServiceStatus.COMPLETED) {
            sr.setCompletionDate(LocalDate.now());
            // Update mechanic status to AVAILABLE
            if (sr.getMechanic() != null) {
                Mechanic mechanic = sr.getMechanic();
                mechanic.setStatus(Mechanic.MechanicStatus.AVAILABLE);
            }
        }

        if (req.getStatus() == ServiceRequest.ServiceStatus.IN_PROGRESS && sr.getMechanic() != null) {
            sr.getMechanic().setStatus(Mechanic.MechanicStatus.BUSY);
        }

        return toResponse(serviceRequestRepository.save(sr));
    }

    public ServiceRequestResponse assignMechanic(Long id, Long mechanicId) {
        ServiceRequest sr = findOrThrow(id);
        sr.setMechanic(mechanicService.findOrThrow(mechanicId));
        return toResponse(serviceRequestRepository.save(sr));
    }

    public void delete(Long id) {
        findOrThrow(id);
        serviceRequestRepository.deleteById(id);
    }

    public ServiceRequest findOrThrow(Long id) {
        return serviceRequestRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("ServiceRequest", id));
    }

    public ServiceRequestResponse toResponse(ServiceRequest sr) {
        String vehicleInfo = sr.getVehicle() != null
            ? sr.getVehicle().getYear() + " " + sr.getVehicle().getMake() + " "
              + sr.getVehicle().getModel() + " (" + sr.getVehicle().getLicensePlate() + ")"
            : null;

        String customerName = (sr.getVehicle() != null && sr.getVehicle().getCustomer() != null)
            ? sr.getVehicle().getCustomer().getFirstName() + " " + sr.getVehicle().getCustomer().getLastName()
            : null;

        Long customerId = (sr.getVehicle() != null && sr.getVehicle().getCustomer() != null)
            ? sr.getVehicle().getCustomer().getId() : null;

        String mechanicName = sr.getMechanic() != null
            ? sr.getMechanic().getFirstName() + " " + sr.getMechanic().getLastName() : null;

        return ServiceRequestResponse.builder()
            .id(sr.getId())
            .vehicleId(sr.getVehicle() != null ? sr.getVehicle().getId() : null)
            .vehicleInfo(vehicleInfo)
            .customerId(customerId)
            .customerName(customerName)
            .mechanicId(sr.getMechanic() != null ? sr.getMechanic().getId() : null)
            .mechanicName(mechanicName)
            .description(sr.getDescription())
            .status(sr.getStatus())
            .estimatedCost(sr.getEstimatedCost())
            .actualCost(sr.getActualCost())
            .requestDate(sr.getRequestDate())
            .completionDate(sr.getCompletionDate())
            .notes(sr.getNotes())
            .createdAt(sr.getCreatedAt())
            .build();
    }
}
