package com.platform.educativa.repository;

import com.platform.educativa.model.entity.TextContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TextContentRepository extends JpaRepository<TextContent, Long> {
    List<TextContent> findByModuleIdOrderByOrderIndexAsc(Long moduleId);
}
