package com.backend.repository;

import com.backend.domain.SharedDiary;
import com.backend.domain.SharedDiaryContent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SharedDiaryContentRepository extends JpaRepository<SharedDiaryContent, Long> {

    List<SharedDiaryContent> findBySharedDiary(SharedDiary sharedDiary);

    List<SharedDiaryContent> findBySharedDiaryOrderByCreatedAtAsc(SharedDiary sharedDiary);

    List<SharedDiaryContent> findBySharedDiaryOrderByCreatedAtDesc(SharedDiary sharedDiary);

    List<SharedDiaryContent> findByTitleContaining(String title);

    List<SharedDiaryContent> findByContentContaining(String content);

    List<SharedDiaryContent> findByUser_NicknameContaining(String nickname);
}
