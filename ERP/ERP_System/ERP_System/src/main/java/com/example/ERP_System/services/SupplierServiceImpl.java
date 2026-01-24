package com.example.ERP_System.services;

import com.example.ERP_System.models.Supplier;
import com.example.ERP_System.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupplierServiceImpl implements SupplierService {

    @Autowired
    private SupplierRepository supplierRepository;

    @Override
    public List<Supplier> getAllSuppliers(){
        return supplierRepository.findAll();
    }

    @Override
    public Supplier getSupplierById(Long id){
        return supplierRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + id));
    }

    @Override
    public Supplier createSupplier(Supplier supplier){
        return supplierRepository.save(supplier);
    }
}
