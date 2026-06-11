package com.platform.educativa.service;

import com.platform.educativa.model.dto.CourseDto;
import com.platform.educativa.model.dto.CourseRequest;
import com.platform.educativa.model.entity.Brand;
import com.platform.educativa.model.entity.Course;
import com.platform.educativa.repository.BrandRepository;
import com.platform.educativa.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final BrandRepository brandRepository;

    public List<CourseDto> getAllCourses(boolean activeOnly) {
        List<Course> courses = activeOnly ? courseRepository.findByActiveTrue() : courseRepository.findAll();
        return courses.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<CourseDto> getCoursesByBrand(Long brandId) {
        return courseRepository.findByBrandIdAndActiveTrue(brandId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public CourseDto getCourseById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Curso no encontrado con id: " + id));
        return mapToDto(course);
    }

    @Transactional
    public CourseDto createCourse(CourseRequest request) {
        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new IllegalArgumentException("Marca no encontrada con id: " + request.getBrandId()));

        Course course = Course.builder()
                .brand(brand)
                .title(request.getTitle())
                .description(request.getDescription())
                .coverImageUrl(request.getCoverImageUrl())
                .orderIndex(request.getOrderIndex())
                .build();

        return mapToDto(courseRepository.save(course));
    }

    @Transactional
    public CourseDto updateCourse(Long id, CourseRequest request) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Curso no encontrado con id: " + id));
        
        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new IllegalArgumentException("Marca no encontrada con id: " + request.getBrandId()));

        course.setBrand(brand);
        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setCoverImageUrl(request.getCoverImageUrl());
        course.setOrderIndex(request.getOrderIndex());
        course.setActive(request.isActive());

        return mapToDto(courseRepository.save(course));
    }

    @Transactional
    public void deleteCourse(Long id) {
        if (!courseRepository.existsById(id)) {
            throw new IllegalArgumentException("Curso no encontrado con id: " + id);
        }
        courseRepository.deleteById(id);
    }

    private CourseDto mapToDto(Course course) {
        return CourseDto.builder()
                .id(course.getId())
                .brandId(course.getBrand().getId())
                .brandName(course.getBrand().getName())
                .title(course.getTitle())
                .description(course.getDescription())
                .coverImageUrl(course.getCoverImageUrl())
                .orderIndex(course.getOrderIndex())
                .active(course.isActive())
                .createdAt(course.getCreatedAt())
                .build();
    }
}
