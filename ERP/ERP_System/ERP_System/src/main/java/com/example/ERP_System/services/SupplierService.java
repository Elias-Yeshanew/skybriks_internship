package com.example.ERP_System.services;

import com.example.ERP_System.models.Supplier;
import java.util.List;

public interface SupplierService {

    List<Supplier> getAllSuppliers();
    Supplier getSupplierById(Long id);
    Supplier createSupplier(Supplier supplier);
}
