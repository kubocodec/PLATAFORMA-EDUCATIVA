package com.platform.educativa.model.dto;

import com.platform.educativa.model.enums.FileType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DownloadLinkDto {
    private Long id;
    private Long moduleId;
    private String title;
    private String description;
    private String url;
    private boolean isLocalFile;
    private FileType fileType;
    private Integer orderIndex;
}
