package com.platform.educativa.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CertificateDto {
    private Long id;
    private Long userId;
    private String userName;
    private Long courseId;
    private String courseName;
    private String pdfUrl;
    private LocalDateTime issuedAt;
}
