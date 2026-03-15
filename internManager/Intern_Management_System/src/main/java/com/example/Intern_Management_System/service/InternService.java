package com.example.Intern_Management_System.service;

import java.time.format.DateTimeFormatter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Intern_Management_System.repository.InternRepository;
import com.example.Intern_Management_System.entity.Intern;
import java.util.List;

@Service
public class InternService {

    @Autowired
    private InternRepository internRepository;

    public Intern registerIntern(Intern intern) {
        String generatedId = generateCustomId(intern);
        intern.setInternIdStr(generatedId);

        return internRepository.save(intern);
    }

    private String generateCustomId(Intern intern) {
        String prefix = intern.getIdCardType().equalsIgnoreCase("Premium") ? "EMP" : "TDA";

        String datePart = intern.getJoiningDate().format(DateTimeFormatter.ofPattern("yyyyMMdd"));

        long countOnThatDay = internRepository.countByJoiningDate(intern.getJoiningDate());

        String sequence = String.format("%03d", countOnThatDay + 1);

        return prefix + datePart + "-" + sequence;
    }

    public List<Intern> getAllInterns() {
        return internRepository.findAll();
    }

    public void deleteIntern(Long id) {
        internRepository.deleteById(id);
    }

    public Intern getInternById(Long id) {
        return internRepository.findById(id).orElseThrow(() -> new RuntimeException("Intern not found"));
    }

    public Intern updateIntern(Long id, Intern internDetails) {
        Intern existingIntern = internRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Intern not found"));
        existingIntern.setName(internDetails.getName());
        existingIntern.setEmail(internDetails.getEmail());
        existingIntern.setPhone(internDetails.getPhone());
        existingIntern.setIdCardType(internDetails.getIdCardType());
        existingIntern.setBatch(internDetails.getBatch());

        return internRepository.save(existingIntern);
    }
}
