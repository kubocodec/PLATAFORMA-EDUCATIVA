package com.platform.educativa.controller;

import com.platform.educativa.model.dto.CertificateDto;
import com.platform.educativa.model.entity.Certificate;
import com.platform.educativa.model.entity.User;
import com.platform.educativa.repository.CertificateRepository;
import com.platform.educativa.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/certificates")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CertificateController {

    private final CertificateRepository certificateRepository;
    private final UserRepository userRepository;

    @GetMapping("/my-certificates")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<CertificateDto>> getMyCertificates(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        List<CertificateDto> dtos = certificateRepository.findByUserId(user.getId()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    private CertificateDto mapToDto(Certificate c) {
        return CertificateDto.builder()
                .id(c.getId())
                .userId(c.getUser().getId())
                .userName(c.getUser().getFullName())
                .courseId(c.getCourse().getId())
                .courseName(c.getCourse().getTitle())
                .pdfUrl(c.getPdfUrl())
                .issuedAt(c.getIssuedAt())
                .build();
    }
}
