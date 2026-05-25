package com.college.service;

import com.college.entity.Marks;
import com.college.entity.Student;
import com.college.repository.MarksRepository;
import com.college.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MarksService {

    private final MarksRepository marksRepository;
    private final StudentRepository studentRepository;

    public List<Marks> getAllMarks() {
        return marksRepository.findAll();
    }

    public List<Marks> getMarksByStudent(Long studentId) {
        return marksRepository.findByStudentId(studentId);
    }

    public Marks addMarks(Long studentId, Marks marks) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        marks.setStudent(student);
        return marksRepository.save(marks);
    }

    public Marks updateMarks(Long id, Marks updated) {
        Marks marks = marksRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Marks not found"));
        marks.setSubject(updated.getSubject());
        marks.setMarksObtained(updated.getMarksObtained());
        marks.setMaxMarks(updated.getMaxMarks());
        marks.setSemester(updated.getSemester());
        return marksRepository.save(marks);
    }

    public void deleteMarks(Long id) {
        marksRepository.deleteById(id);
    }

    public Map<String, Double> getAverageMarksByDepartment() {
        return marksRepository.avgMarksByDepartment().stream()
                .collect(Collectors.toMap(
                        row -> (String) row[0],
                        row -> Math.round((Double) row[1] * 100.0) / 100.0
                ));
    }
}
