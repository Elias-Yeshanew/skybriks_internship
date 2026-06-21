package com.garage.service;

import com.garage.dto.ServiceRequestCreate;
import com.garage.dto.ServiceRequestResponse;
import com.garage.dto.StatusUpdateRequest;
import com.garage.entity.*;
import com.garage.exception.ResourceNotFoundException;
import com.garage.repository.ServiceRequestRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ServiceRequestServiceTest {

    @Mock private ServiceRequestRepository serviceRequestRepository;
    @Mock private VehicleService vehicleService;
    @Mock private MechanicService mechanicService;

    @InjectMocks private ServiceRequestService serviceRequestService;

    private Vehicle sampleVehicle;
    private ServiceRequest sampleSR;

    @BeforeEach
    void setUp() {
        Customer customer = Customer.builder().id(1L).firstName("Sara").lastName("Haile").build();
        sampleVehicle = Vehicle.builder().id(1L).licensePlate("AA-12345")
            .make("Toyota").model("Camry").year(2020).customer(customer).build();

        sampleSR = ServiceRequest.builder()
            .id(1L).vehicle(sampleVehicle).description("Oil change")
            .status(ServiceRequest.ServiceStatus.PENDING)
            .estimatedCost(new BigDecimal("500.00")).build();
    }

    @Test
    void createServiceRequest_shouldSucceed() {
        ServiceRequestCreate req = new ServiceRequestCreate(1L, null, "Oil change", new BigDecimal("500.00"), null);
        when(vehicleService.findOrThrow(1L)).thenReturn(sampleVehicle);
        when(serviceRequestRepository.save(any())).thenReturn(sampleSR);

        ServiceRequestResponse response = serviceRequestService.create(req);

        assertNotNull(response);
        assertEquals("Oil change", response.getDescription());
        assertEquals(ServiceRequest.ServiceStatus.PENDING, response.getStatus());
    }

    @Test
    void updateStatus_shouldChangeToCompleted() {
        StatusUpdateRequest statusReq = new StatusUpdateRequest(
            ServiceRequest.ServiceStatus.COMPLETED, new BigDecimal("550.00"), "Done");
        when(serviceRequestRepository.findById(1L)).thenReturn(Optional.of(sampleSR));
        when(serviceRequestRepository.save(any())).thenReturn(sampleSR);

        serviceRequestService.updateStatus(1L, statusReq);

        assertEquals(ServiceRequest.ServiceStatus.COMPLETED, sampleSR.getStatus());
        assertNotNull(sampleSR.getCompletionDate());
    }

    @Test
    void getById_shouldThrow_whenNotFound() {
        when(serviceRequestRepository.findById(999L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> serviceRequestService.getById(999L));
    }
}
