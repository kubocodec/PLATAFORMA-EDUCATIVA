package com.platform.educativa.repository;

import com.platform.educativa.model.entity.VideoContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VideoContentRepository extends JpaRepository<VideoContent, Long> {
    List<VideoContent> findByModuleIdOrderByOrderIndexAsc(Long moduleId);
}
