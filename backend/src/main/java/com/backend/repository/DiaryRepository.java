package com.backend.repository;

import com.backend.domain.Diary;
import com.backend.domain.SharedDiaryContent;
import com.backend.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DiaryRepository extends JpaRepository<Diary, Long> {

    boolean existsByUserAndDate(User user, String date);
    Optional<Diary> findByUserAndDate(User user, String date);
    List<Diary> findByUserAndDateBetweenOrderByDateDesc(User user, String startDate, String endDate);
    Optional<Diary> findById(Long id);
    List<Diary> findByIsPrivate(Boolean isPrivate);

    List<Diary> findByTitleContaining(String title);

    List<Diary> findByContentContaining(String content);


}
