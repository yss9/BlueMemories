package com.backend.repository;

import com.backend.domain.Diary;
import com.backend.domain.User;
import com.backend.domain.UserLikes;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserLikeRepository extends JpaRepository<UserLikes, Long> {
    boolean existsByDiaryAndUser(Diary diary, User user);
    Optional<UserLikes> findByDiaryAndUser(Diary diary, User user);
}
