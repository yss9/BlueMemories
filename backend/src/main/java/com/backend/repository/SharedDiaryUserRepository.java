package com.backend.repository;

import com.backend.domain.SharedDiary;
import com.backend.domain.SharedDiaryUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SharedDiaryUserRepository extends JpaRepository<SharedDiaryUser, Long> {
    Optional<SharedDiaryUser> findBySharedDiary(SharedDiary sharedDiary);
}
