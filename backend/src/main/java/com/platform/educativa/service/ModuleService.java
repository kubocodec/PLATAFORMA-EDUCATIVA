package com.platform.educativa.service;

import com.platform.educativa.model.dto.*;
import com.platform.educativa.model.entity.*;
import com.platform.educativa.model.entity.Module;
import com.platform.educativa.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ModuleService {

    private final ModuleRepository moduleRepository;
    private final CourseRepository courseRepository;
    private final VideoContentRepository videoContentRepository;
    private final TextContentRepository textContentRepository;
    private final DownloadLinkRepository downloadLinkRepository;

    public List<ModuleDto> getModulesByCourse(Long courseId) {
        return moduleRepository.findByCourseIdAndActiveTrueOrderByOrderIndexAsc(courseId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public ModuleDto getModuleById(Long id) {
        Module module = moduleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Módulo no encontrado con id: " + id));
        return mapToDto(module);
    }

    @Transactional
    public ModuleDto createModule(ModuleRequest request) {
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new IllegalArgumentException("Curso no encontrado con id: " + request.getCourseId()));

        Module module = Module.builder()
                .course(course)
                .title(request.getTitle())
                .description(request.getDescription())
                .type(request.getType())
                .orderIndex(request.getOrderIndex())
                .build();

        return mapToDto(moduleRepository.save(module));
    }

    @Transactional
    public ModuleDto updateModule(Long id, ModuleRequest request) {
        Module module = moduleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Módulo no encontrado con id: " + id));
        
        module.setTitle(request.getTitle());
        module.setDescription(request.getDescription());
        module.setType(request.getType());
        module.setOrderIndex(request.getOrderIndex());
        module.setActive(request.isActive());

        return mapToDto(moduleRepository.save(module));
    }

    @Transactional
    public void deleteModule(Long id) {
        if (!moduleRepository.existsById(id)) {
            throw new IllegalArgumentException("Módulo no encontrado con id: " + id);
        }
        moduleRepository.deleteById(id);
    }

    // Métodos para contenidos (Agregados individualmente)
    
    @Transactional
    public VideoContentDto addVideoContent(VideoContentRequest request) {
        Module module = moduleRepository.findById(request.getModuleId())
                .orElseThrow(() -> new IllegalArgumentException("Módulo no encontrado"));
                
        VideoContent video = VideoContent.builder()
                .module(module)
                .title(request.getTitle())
                .description(request.getDescription())
                .videoUrl(request.getVideoUrl())
                .isLocalFile(request.isLocalFile())
                .durationMinutes(request.getDurationMinutes())
                .orderIndex(request.getOrderIndex())
                .build();
                
        return mapVideoToDto(videoContentRepository.save(video));
    }

    @Transactional
    public TextContentDto addTextContent(TextContentRequest request) {
        Module module = moduleRepository.findById(request.getModuleId())
                .orElseThrow(() -> new IllegalArgumentException("Módulo no encontrado"));
                
        TextContent text = TextContent.builder()
                .module(module)
                .title(request.getTitle())
                .content(request.getContent())
                .orderIndex(request.getOrderIndex())
                .build();
                
        return mapTextToDto(textContentRepository.save(text));
    }

    @Transactional
    public DownloadLinkDto addDownloadLink(DownloadLinkRequest request) {
        Module module = moduleRepository.findById(request.getModuleId())
                .orElseThrow(() -> new IllegalArgumentException("Módulo no encontrado"));
                
        DownloadLink link = DownloadLink.builder()
                .module(module)
                .title(request.getTitle())
                .description(request.getDescription())
                .url(request.getUrl())
                .isLocalFile(request.isLocalFile())
                .fileType(request.getFileType())
                .orderIndex(request.getOrderIndex())
                .build();
                
        return mapLinkToDto(downloadLinkRepository.save(link));
    }

    @Transactional
    public VideoContentDto updateVideoContent(Long contentId, VideoContentRequest request) {
        VideoContent video = videoContentRepository.findById(contentId)
                .orElseThrow(() -> new IllegalArgumentException("Contenido de video no encontrado"));
        video.setTitle(request.getTitle());
        video.setDescription(request.getDescription());
        video.setVideoUrl(request.getVideoUrl());
        video.setDurationMinutes(request.getDurationMinutes());
        return mapVideoToDto(videoContentRepository.save(video));
    }

    @Transactional
    public TextContentDto updateTextContent(Long contentId, TextContentRequest request) {
        TextContent text = textContentRepository.findById(contentId)
                .orElseThrow(() -> new IllegalArgumentException("Contenido de texto no encontrado"));
        text.setTitle(request.getTitle());
        text.setContent(request.getContent());
        return mapTextToDto(textContentRepository.save(text));
    }

    @Transactional
    public DownloadLinkDto updateDownloadLink(Long contentId, DownloadLinkRequest request) {
        DownloadLink link = downloadLinkRepository.findById(contentId)
                .orElseThrow(() -> new IllegalArgumentException("Enlace de descarga no encontrado"));
        link.setTitle(request.getTitle());
        link.setDescription(request.getDescription());
        link.setUrl(request.getUrl());
        link.setFileType(request.getFileType());
        return mapLinkToDto(downloadLinkRepository.save(link));
    }

    // Mappers
    private ModuleDto mapToDto(Module module) {
        ModuleDto dto = ModuleDto.builder()
                .id(module.getId())
                .courseId(module.getCourse().getId())
                .title(module.getTitle())
                .description(module.getDescription())
                .type(module.getType())
                .orderIndex(module.getOrderIndex())
                .active(module.isActive())
                .build();

        // Mapeo condicional de las colecciones para evitar lazy loading exceptions
        if (module.getVideos() != null) {
            dto.setVideos(module.getVideos().stream().map(this::mapVideoToDto).collect(Collectors.toList()));
        }
        if (module.getTexts() != null) {
            dto.setTexts(module.getTexts().stream().map(this::mapTextToDto).collect(Collectors.toList()));
        }
        if (module.getDownloads() != null) {
            dto.setDownloads(module.getDownloads().stream().map(this::mapLinkToDto).collect(Collectors.toList()));
        }
        return dto;
    }

    private VideoContentDto mapVideoToDto(VideoContent video) {
        return VideoContentDto.builder()
                .id(video.getId())
                .moduleId(video.getModule().getId())
                .title(video.getTitle())
                .description(video.getDescription())
                .videoUrl(video.getVideoUrl())
                .isLocalFile(video.isLocalFile())
                .durationMinutes(video.getDurationMinutes())
                .orderIndex(video.getOrderIndex())
                .build();
    }

    private TextContentDto mapTextToDto(TextContent text) {
        return TextContentDto.builder()
                .id(text.getId())
                .moduleId(text.getModule().getId())
                .title(text.getTitle())
                .content(text.getContent())
                .orderIndex(text.getOrderIndex())
                .build();
    }

    private DownloadLinkDto mapLinkToDto(DownloadLink link) {
        return DownloadLinkDto.builder()
                .id(link.getId())
                .moduleId(link.getModule().getId())
                .title(link.getTitle())
                .description(link.getDescription())
                .url(link.getUrl())
                .isLocalFile(link.isLocalFile())
                .fileType(link.getFileType())
                .orderIndex(link.getOrderIndex())
                .build();
    }
}
