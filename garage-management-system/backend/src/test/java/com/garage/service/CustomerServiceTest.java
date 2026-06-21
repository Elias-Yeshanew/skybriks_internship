package com.garage.service;

import com.garage.dto.CustomerRequest;
import com.garage.dto.CustomerResponse;
import com.garage.entity.Customer;
import com.garage.exception.ResourceConflictException;
import com.garage.exception.ResourceNotFoundException;
import com.garage.repository.CustomerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CustomerServiceTest {

    @Mock private CustomerRepository customerRepository;
    @InjectMocks private CustomerService customerService;

    private Customer sampleCustomer;
    private CustomerRequest sampleRequest;

    @BeforeEach
    void setUp() {
        sampleCustomer = Customer.builder()
            .id(1L).firstName("Dawit").lastName("Bekele")
            .phone("0911234567").email("dawit@email.com").build();

        sampleRequest = new CustomerRequest("Dawit", "Bekele", "0911234567", "dawit@email.com", "Addis Ababa");
    }

    @Test
    void createCustomer_shouldSucceed_whenPhoneIsNew() {
        when(customerRepository.existsByPhone(any())).thenReturn(false);
        when(customerRepository.existsByEmail(any())).thenReturn(false);
        when(customerRepository.save(any(Customer.class))).thenReturn(sampleCustomer);

        CustomerResponse response = customerService.create(sampleRequest);

        assertNotNull(response);
        assertEquals("Dawit", response.getFirstName());
        assertEquals("Bekele", response.getLastName());
        verify(customerRepository).save(any(Customer.class));
    }

    @Test
    void createCustomer_shouldThrow_whenPhoneExists() {
        when(customerRepository.existsByPhone("0911234567")).thenReturn(true);
        assertThrows(ResourceConflictException.class, () -> customerService.create(sampleRequest));
        verify(customerRepository, never()).save(any());
    }

    @Test
    void getById_shouldReturnCustomer_whenExists() {
        when(customerRepository.findById(1L)).thenReturn(Optional.of(sampleCustomer));
        CustomerResponse response = customerService.getById(1L);
        assertNotNull(response);
        assertEquals(1L, response.getId());
    }

    @Test
    void getById_shouldThrow_whenNotFound() {
        when(customerRepository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> customerService.getById(99L));
    }

    @Test
    void getAllCustomers_shouldReturnList() {
        when(customerRepository.findAll()).thenReturn(List.of(sampleCustomer));
        List<CustomerResponse> customers = customerService.getAllCustomers();
        assertEquals(1, customers.size());
    }

    @Test
    void deleteCustomer_shouldSucceed_whenExists() {
        when(customerRepository.findById(1L)).thenReturn(Optional.of(sampleCustomer));
        doNothing().when(customerRepository).deleteById(1L);
        assertDoesNotThrow(() -> customerService.delete(1L));
        verify(customerRepository).deleteById(1L);
    }
}
