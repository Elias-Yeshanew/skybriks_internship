package com.example.Intern_Management_System.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Intern_Management_System.service.InternService;
import com.example.Intern_Management_System.entity.Intern;

@RestController
@RequestMapping("/api/interns")
@CrossOrigin(origins = { "http://localhost:4200", "http://localhost:4201" })
public class InternController {

    @Autowired
    private InternService internService;

    @PostMapping
    public ResponseEntity<Intern> addIntern(@RequestBody Intern intern) {
        return ResponseEntity.ok(internService.registerIntern(intern));
    }

    @GetMapping
    public ResponseEntity<List<Intern>> getAllInterns() {
        return ResponseEntity.ok(internService.getAllInterns());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Intern> getInternById(@PathVariable Long id) {
        return ResponseEntity.ok(internService.getInternById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteIntern(@PathVariable Long id) {
        internService.deleteIntern(id);
        return ResponseEntity.ok("Intern deleted successfully");
    }

    @PutMapping("/{id}")
    public ResponseEntity<Intern> updateIntern(@PathVariable Long id, @RequestBody Intern internDetails) {
        return ResponseEntity.ok(internService.updateIntern(id, internDetails));
    }

}
