package com.backend.repository;

import com.backend.domain.SharedDiary;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SharedDiaryRepository extends JpaRepository<SharedDiary, Long> {
}
