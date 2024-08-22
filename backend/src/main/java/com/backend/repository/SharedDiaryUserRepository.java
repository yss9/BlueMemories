package com.backend.repository;

import com.backend.domain.SharedDiary;
import com.backend.domain.SharedDiaryUser;
import com.backend.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SharedDiaryUserRepository extends JpaRepository<SharedDiaryUser, Long> {

    List<SharedDiaryUser> findBySharedDiary(SharedDiary sharedDiary);
    List<SharedDiaryUser> findAllByUser(User user);
}
