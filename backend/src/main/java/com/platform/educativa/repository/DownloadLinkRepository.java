package com.platform.educativa.repository;

import com.platform.educativa.model.entity.DownloadLink;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DownloadLinkRepository extends JpaRepository<DownloadLink, Long> {
    List<DownloadLink> findByModuleIdOrderByOrderIndexAsc(Long moduleId);
}
