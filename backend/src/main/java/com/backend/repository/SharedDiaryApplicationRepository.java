package com.backend.repository;

import com.backend.domain.SharedDiaryApplication;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SharedDiaryApplicationRepository extends JpaRepository<SharedDiaryApplication, Long> {
}
