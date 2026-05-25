package com.college.repository;

import com.college.entity.Marks;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MarksRepository extends JpaRepository<Marks, Long> {
    List<Marks> findByStudentId(Long studentId);
    List<Marks> findByStudentIdAndSemester(Long studentId, Integer semester);

    @Query("SELECT s.department, AVG(m.marksObtained * 100.0 / m.maxMarks) " +
           "FROM Marks m JOIN m.student s GROUP BY s.department")
    List<Object[]> avgMarksByDepartment();
}
