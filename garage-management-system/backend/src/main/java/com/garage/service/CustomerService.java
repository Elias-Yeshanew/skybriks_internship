package com.garage.service;

import com.garage.dto.CustomerRequest;
import com.garage.dto.CustomerResponse;
import com.garage.entity.Customer;
import com.garage.exception.ResourceConflictException;
import com.garage.exception.ResourceNotFoundException;
import com.garage.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CustomerService {

    private final CustomerRepository customerRepository;

    public List<CustomerResponse> getAllCustomers() {
        return customerRepository.findAll().stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    public CustomerResponse getById(Long id) {
        return toResponse(findOrThrow(id));
    }

    public CustomerResponse create(CustomerRequest req) {
        if (customerRepository.existsByPhone(req.getPhone()))
            throw new ResourceConflictException("Phone number already registered: " + req.getPhone());
        if (req.getEmail() != null && customerRepository.existsByEmail(req.getEmail()))
            throw new ResourceConflictException("Email already registered: " + req.getEmail());

        Customer customer = Customer.builder()
            .firstName(req.getFirstName())
            .lastName(req.getLastName())
            .phone(req.getPhone())
            .email(req.getEmail())
            .address(req.getAddress())
            .build();

        return toResponse(customerRepository.save(customer));
    }

    public CustomerResponse update(Long id, CustomerRequest req) {
        Customer customer = findOrThrow(id);

        if (!customer.getPhone().equals(req.getPhone()) && customerRepository.existsByPhone(req.getPhone()))
            throw new ResourceConflictException("Phone number already in use: " + req.getPhone());

        customer.setFirstName(req.getFirstName());
        customer.setLastName(req.getLastName());
        customer.setPhone(req.getPhone());
        customer.setEmail(req.getEmail());
        customer.setAddress(req.getAddress());

        return toResponse(customerRepository.save(customer));
    }

    public void delete(Long id) {
        findOrThrow(id);
        customerRepository.deleteById(id);
    }

    public List<CustomerResponse> search(String term) {
        return customerRepository.search(term).stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    public Customer findOrThrow(Long id) {
        return customerRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Customer", id));
    }

    private CustomerResponse toResponse(Customer c) {
        return CustomerResponse.builder()
            .id(c.getId())
            .firstName(c.getFirstName())
            .lastName(c.getLastName())
            .email(c.getEmail())
            .phone(c.getPhone())
            .address(c.getAddress())
            .createdDate(c.getCreatedDate())
            .vehicleCount(c.getVehicles() != null ? c.getVehicles().size() : 0)
            .build();
    }
}
