package com.platform.educativa.controller;

import com.platform.educativa.model.dto.*;
import com.platform.educativa.service.ModuleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/modules")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ModuleController {

    private final ModuleService moduleService;

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<ModuleDto>> getModulesByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(moduleService.getModulesByCourse(courseId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ModuleDto> getModuleById(@PathVariable Long id) {
        return ResponseEntity.ok(moduleService.getModuleById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ModuleDto> createModule(@Valid @RequestBody ModuleRequest request) {
        return new ResponseEntity<>(moduleService.createModule(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ModuleDto> updateModule(@PathVariable Long id, @Valid @RequestBody ModuleRequest request) {
        return ResponseEntity.ok(moduleService.updateModule(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteModule(@PathVariable Long id) {
        moduleService.deleteModule(id);
        return ResponseEntity.noContent().build();
    }

    // Endpoints para agregar contenido a un módulo
    
    @PostMapping("/video")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<VideoContentDto> addVideoContent(@Valid @RequestBody VideoContentRequest request) {
        return new ResponseEntity<>(moduleService.addVideoContent(request), HttpStatus.CREATED);
    }

    @PostMapping("/text")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TextContentDto> addTextContent(@Valid @RequestBody TextContentRequest request) {
        return new ResponseEntity<>(moduleService.addTextContent(request), HttpStatus.CREATED);
    }

    @PostMapping("/download")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DownloadLinkDto> addDownloadLink(@Valid @RequestBody DownloadLinkRequest request) {
        return new ResponseEntity<>(moduleService.addDownloadLink(request), HttpStatus.CREATED);
    }

    @PutMapping("/video/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<VideoContentDto> updateVideoContent(@PathVariable Long id, @Valid @RequestBody VideoContentRequest request) {
        return ResponseEntity.ok(moduleService.updateVideoContent(id, request));
    }

    @PutMapping("/text/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TextContentDto> updateTextContent(@PathVariable Long id, @Valid @RequestBody TextContentRequest request) {
        return ResponseEntity.ok(moduleService.updateTextContent(id, request));
    }

    @PutMapping("/download/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DownloadLinkDto> updateDownloadLink(@PathVariable Long id, @Valid @RequestBody DownloadLinkRequest request) {
        return ResponseEntity.ok(moduleService.updateDownloadLink(id, request));
    }
}
