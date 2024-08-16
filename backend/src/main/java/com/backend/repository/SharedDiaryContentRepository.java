package com.backend.repository;

import com.backend.domain.SharedDiaryContent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SharedDiaryContentRepository extends JpaRepository<SharedDiaryContent, Long> {
}
