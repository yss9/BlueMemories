package com.backend.repository;

import com.backend.domain.SharedDiaryUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SharedDiaryUserRepository extends JpaRepository<SharedDiaryUser, Long> {
}
