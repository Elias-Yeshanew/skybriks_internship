package com.example.CRM.controller;

import com.example.CRM.model.Lead;
import com.example.CRM.repository.LeadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/leads")
@CrossOrigin(origins = "http://localhost:3000")
public class LeadController {

    @Autowired
    private LeadRepository leadRepository;

    @GetMapping
    public Page<Lead> getAllLeads(Pageable pageable) {
        return leadRepository.findAll(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Lead> getLeadById(@PathVariable Long id) {
        return leadRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Lead createLead(@RequestBody Lead lead) {
        if (lead.getStatus() == null) lead.setStatus("New");
        return leadRepository.save(lead);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Lead> updateLead(@PathVariable Long id, @RequestBody Lead leadDetails) {
        return leadRepository.findById(id)
                .map(lead -> {
                    leadDetails.setId(id);
                    if (leadDetails.getCreatedAt() == null) leadDetails.setCreatedAt(lead.getCreatedAt());
                    if (leadDetails.getAssignedTo() == null) leadDetails.setAssignedTo(lead.getAssignedTo());
                    return ResponseEntity.ok(leadRepository.save(leadDetails));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/status")
    public Lead updateLeadStatus(@PathVariable Long id, @RequestBody String status) {
        Lead lead = leadRepository.findById(id).orElseThrow();
        lead.setStatus(status);
        return leadRepository.save(lead);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLead(@PathVariable Long id) {
        leadRepository.deleteById(id);
        return ResponseEntity.ok("Lead deleted successfully");
    }
}