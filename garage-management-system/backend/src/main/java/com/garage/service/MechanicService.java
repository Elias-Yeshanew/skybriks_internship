package com.garage.service;

import com.garage.dto.MechanicRequest;
import com.garage.dto.MechanicResponse;
import com.garage.entity.Mechanic;
import com.garage.exception.ResourceConflictException;
import com.garage.exception.ResourceNotFoundException;
import com.garage.repository.MechanicRepository;
import com.garage.repository.ServiceRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class MechanicService {

    private final MechanicRepository mechanicRepository;
    private final ServiceRequestRepository serviceRequestRepository;

    public List<MechanicResponse> getAll() {
        return mechanicRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public MechanicResponse getById(Long id) {
        return toResponse(findOrThrow(id));
    }

    public List<MechanicResponse> getAvailable() {
        return mechanicRepository.findByStatus(Mechanic.MechanicStatus.AVAILABLE)
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public MechanicResponse create(MechanicRequest req) {
        if (mechanicRepository.existsByPhone(req.getPhone()))
            throw new ResourceConflictException("Phone already registered: " + req.getPhone());

        Mechanic mechanic = Mechanic.builder()
            .firstName(req.getFirstName())
            .lastName(req.getLastName())
            .phone(req.getPhone())
            .email(req.getEmail())
            .specialization(req.getSpecialization())
            .hourlyRate(req.getHourlyRate())
            .status(req.getStatus() != null ? req.getStatus() : Mechanic.MechanicStatus.AVAILABLE)
            .build();

        return toResponse(mechanicRepository.save(mechanic));
    }

    public MechanicResponse update(Long id, MechanicRequest req) {
        Mechanic mechanic = findOrThrow(id);

        if (!mechanic.getPhone().equals(req.getPhone()) && mechanicRepository.existsByPhone(req.getPhone()))
            throw new ResourceConflictException("Phone already in use");

        mechanic.setFirstName(req.getFirstName());
        mechanic.setLastName(req.getLastName());
        mechanic.setPhone(req.getPhone());
        mechanic.setEmail(req.getEmail());
        mechanic.setSpecialization(req.getSpecialization());
        mechanic.setHourlyRate(req.getHourlyRate());
        if (req.getStatus() != null) mechanic.setStatus(req.getStatus());

        return toResponse(mechanicRepository.save(mechanic));
    }

    public void delete(Long id) {
        findOrThrow(id);
        mechanicRepository.deleteById(id);
    }

    public Mechanic findOrThrow(Long id) {
        return mechanicRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Mechanic", id));
    }

    private MechanicResponse toResponse(Mechanic m) {
        long activeJobs = serviceRequestRepository.findByMechanicId(m.getId()).stream()
            .filter(sr -> sr.getStatus() == com.garage.entity.ServiceRequest.ServiceStatus.IN_PROGRESS)
            .count();

        return MechanicResponse.builder()
            .id(m.getId())
            .firstName(m.getFirstName())
            .lastName(m.getLastName())
            .phone(m.getPhone())
            .email(m.getEmail())
            .specialization(m.getSpecialization())
            .hourlyRate(m.getHourlyRate())
            .status(m.getStatus())
            .hiredDate(m.getHiredDate())
            .activeJobs((int) activeJobs)
            .build();
    }
}
