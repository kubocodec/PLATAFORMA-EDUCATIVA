package com.platform.educativa.repository;

import com.platform.educativa.model.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByBrandIdAndActiveTrue(Long brandId);
    List<Course> findByActiveTrue();
}
