package com.example.ERP_System.services;

import com.example.ERP_System.models.Customer;
import java.util.List;

public interface CustomerService {

    List<Customer> getAllCustomers();
    Customer getCustomerById(Long id);
    Customer createCustomer(Customer customer);
}
