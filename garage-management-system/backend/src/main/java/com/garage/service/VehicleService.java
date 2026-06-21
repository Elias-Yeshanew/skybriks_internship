package com.garage.service;

import com.garage.dto.VehicleRequest;
import com.garage.dto.VehicleResponse;
import com.garage.entity.Customer;
import com.garage.entity.Vehicle;
import com.garage.exception.ResourceConflictException;
import com.garage.exception.ResourceNotFoundException;
import com.garage.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final CustomerService customerService;

    public List<VehicleResponse> getAll() {
        return vehicleRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public VehicleResponse getById(Long id) {
        return toResponse(findOrThrow(id));
    }

    public List<VehicleResponse> getByCustomer(Long customerId) {
        return vehicleRepository.findByCustomerId(customerId).stream()
            .map(this::toResponse).collect(Collectors.toList());
    }

    public VehicleResponse create(VehicleRequest req) {
        if (vehicleRepository.existsByLicensePlate(req.getLicensePlate()))
            throw new ResourceConflictException("License plate already registered: " + req.getLicensePlate());

        Customer customer = customerService.findOrThrow(req.getCustomerId());

        Vehicle vehicle = Vehicle.builder()
            .licensePlate(req.getLicensePlate().toUpperCase())
            .make(req.getMake())
            .model(req.getModel())
            .year(req.getYear())
            .vinNumber(req.getVinNumber())
            .customer(customer)
            .build();

        return toResponse(vehicleRepository.save(vehicle));
    }

    public VehicleResponse update(Long id, VehicleRequest req) {
        Vehicle vehicle = findOrThrow(id);

        if (!vehicle.getLicensePlate().equals(req.getLicensePlate())
                && vehicleRepository.existsByLicensePlate(req.getLicensePlate()))
            throw new ResourceConflictException("License plate already in use: " + req.getLicensePlate());

        Customer customer = customerService.findOrThrow(req.getCustomerId());

        vehicle.setLicensePlate(req.getLicensePlate().toUpperCase());
        vehicle.setMake(req.getMake());
        vehicle.setModel(req.getModel());
        vehicle.setYear(req.getYear());
        vehicle.setVinNumber(req.getVinNumber());
        vehicle.setCustomer(customer);

        return toResponse(vehicleRepository.save(vehicle));
    }

    public void delete(Long id) {
        findOrThrow(id);
        vehicleRepository.deleteById(id);
    }

    public Vehicle findOrThrow(Long id) {
        return vehicleRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Vehicle", id));
    }

    private VehicleResponse toResponse(Vehicle v) {
        return VehicleResponse.builder()
            .id(v.getId())
            .licensePlate(v.getLicensePlate())
            .make(v.getMake())
            .model(v.getModel())
            .year(v.getYear())
            .vinNumber(v.getVinNumber())
            .customerId(v.getCustomer() != null ? v.getCustomer().getId() : null)
            .customerName(v.getCustomer() != null
                ? v.getCustomer().getFirstName() + " " + v.getCustomer().getLastName() : null)
            .build();
    }
}
