package com.example.CRM.controller;

import com.example.CRM.model.Customer;
import com.example.CRM.repository.CustomerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class CustomerControllerTest {

    @Mock
    private CustomerRepository customerRepository;

    @InjectMocks
    private CustomerController customerController;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetAllCustomers() {
        Customer c1 = new Customer();
        c1.setName("Test Customer");
        Page<Customer> page = new PageImpl<>(Arrays.asList(c1));
        
        when(customerRepository.findAll(any(PageRequest.class))).thenReturn(page);

        Page<Customer> result = customerController.getAllCustomers(PageRequest.of(0, 10));
        assertEquals(1, result.getContent().size());
        assertEquals("Test Customer", result.getContent().get(0).getName());
    }

    @Test
    public void testGetCustomerById() {
        Customer c1 = new Customer();
        c1.setId(1L);
        c1.setName("John Doe");
        
        when(customerRepository.findById(1L)).thenReturn(Optional.of(c1));

        ResponseEntity<Customer> response = customerController.getCustomerById(1L);
        assertTrue(response.getStatusCode().is2xxSuccessful());
        assertEquals(1L, response.getBody().getId());
        assertEquals("John Doe", response.getBody().getName());
    }

    @Test
    public void testCreateCustomer() {
        Customer c1 = new Customer();
        c1.setName("New Customer");
        
        when(customerRepository.save(any(Customer.class))).thenReturn(c1);

        Customer response = customerController.createCustomer(c1);
        assertEquals("New Customer", response.getName());
    }
}
