package com.backend.repository;

import com.backend.domain.SharedDiary;
import com.backend.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SharedDiaryRepository extends JpaRepository<SharedDiary, Long> {
    List<SharedDiary> findAllByUser(User user);
}
