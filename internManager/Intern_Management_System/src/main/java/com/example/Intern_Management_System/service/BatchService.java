package com.example.Intern_Management_System.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Intern_Management_System.entity.Batch;
import com.example.Intern_Management_System.repository.BatchRepository;

import java.util.List;

@Service
public class BatchService {
    
    @Autowired
    private BatchRepository batchRepository;
    
    public Batch createBatch(Batch batch) {
        if (batchRepository.existsByStartDate(batch.getStartDate())) {
            throw new IllegalArgumentException("A batch with this start date already exists.");
        }
        
        if (batch.getStartDate() != null){
            batch.setEndDate(batch.getStartDate().plusMonths(6));
        }   
        return batchRepository.save(batch);
    }

    public void deleteBatch(Long id) {
        batchRepository.deleteById(id);
    }

    public List<Batch> getAllBatches(){
        return batchRepository.findAll();
    }

    public Batch getBatchById(Long id) {
        return batchRepository.findById(id).orElse(null);
    }
}
