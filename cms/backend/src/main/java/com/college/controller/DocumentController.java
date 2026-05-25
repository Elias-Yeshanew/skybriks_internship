package com.college.controller;

import com.college.entity.Document;
import com.college.service.DocumentService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
@Tag(name = "Documents", description = "Document generation endpoints")
@SecurityRequirement(name = "bearerAuth")
public class DocumentController {

    private final DocumentService documentService;

    @Data
    static class DocumentRequest {
        private Long studentId;
        private String content;
    }

    @PostMapping("/bonafide")
    public ResponseEntity<Document> generateBonafide(@RequestBody DocumentRequest req,
                                                      Authentication auth) {
        return ResponseEntity.ok(
            documentService.generateDocument(req.getStudentId(),
                Document.DocumentType.BONAFIDE, req.getContent(), auth.getName()));
    }

    @GetMapping("/bonafide/{id}")
    public ResponseEntity<Document> getBonafide(@PathVariable Long id) {
        return ResponseEntity.ok(documentService.getDocumentById(id));
    }

    @PostMapping("/transfer-certificate")
    public ResponseEntity<Document> generateTC(@RequestBody DocumentRequest req,
                                               Authentication auth) {
        return ResponseEntity.ok(
            documentService.generateDocument(req.getStudentId(),
                Document.DocumentType.TRANSFER_CERTIFICATE, req.getContent(), auth.getName()));
    }

    @GetMapping("/transfer-certificate/{id}")
    public ResponseEntity<Document> getTC(@PathVariable Long id) {
        return ResponseEntity.ok(documentService.getDocumentById(id));
    }

    @PostMapping("/marksheet")
    public ResponseEntity<Document> generateMarksheet(@RequestBody DocumentRequest req,
                                                       Authentication auth) {
        return ResponseEntity.ok(
            documentService.generateDocument(req.getStudentId(),
                Document.DocumentType.MARKSHEET, req.getContent(), auth.getName()));
    }

    @GetMapping("/marksheet/{id}")
    public ResponseEntity<Document> getMarksheet(@PathVariable Long id) {
        return ResponseEntity.ok(documentService.getDocumentById(id));
    }

    @GetMapping
    public ResponseEntity<List<Document>> getAllDocuments() {
        return ResponseEntity.ok(documentService.getAllDocuments());
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Document>> getByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(documentService.getDocumentsByStudent(studentId));
    }
}
