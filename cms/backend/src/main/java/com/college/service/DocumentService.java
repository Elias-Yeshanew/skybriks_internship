package com.college.service;

import com.college.entity.Document;
import com.college.entity.Student;
import com.college.entity.User;
import com.college.repository.DocumentRepository;
import com.college.repository.StudentRepository;
import com.college.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;

    public Document generateDocument(Long studentId, Document.DocumentType type,
                                     String content, String creatorEmail) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        User creator = userRepository.findByEmail(creatorEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Document doc = Document.builder()
                .student(student)
                .documentType(type)
                .issueDate(LocalDate.now())
                .content(content != null ? content : generateDefaultContent(student, type))
                .createdBy(creator)
                .build();

        return documentRepository.save(doc);
    }

    public Document getDocumentById(Long id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found"));
    }

    public List<Document> getDocumentsByStudent(Long studentId) {
        return documentRepository.findByStudentId(studentId);
    }

    public List<Document> getAllDocuments() {
        return documentRepository.findAll();
    }

    private String generateDefaultContent(Student student, Document.DocumentType type) {
        return switch (type) {
            case BONAFIDE -> String.format(
                "This is to certify that %s (Roll No: %s) is a bonafide student of %s department, " +
                "Year %d, at this institution.",
                student.getName(), student.getRollNumber(), student.getDepartment(), student.getYear());
            case TRANSFER_CERTIFICATE -> String.format(
                "This is to certify that %s (Roll No: %s) has successfully completed their studies " +
                "in %s department and is hereby issued this Transfer Certificate.",
                student.getName(), student.getRollNumber(), student.getDepartment());
            case MARKSHEET -> String.format(
                "Marksheet for %s (Roll No: %s), Department: %s, Year: %d.",
                student.getName(), student.getRollNumber(), student.getDepartment(), student.getYear());
        };
    }
}
