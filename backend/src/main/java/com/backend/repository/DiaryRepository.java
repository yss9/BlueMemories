package com.backend.repository;

import com.backend.domain.Diary;
import com.backend.domain.User;
import com.backend.dto.PublicDiaryListResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
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

    @Query(
            value = """
                    select new com.backend.dto.PublicDiaryListResponse(
                        d.id,
                        d.title,
                        d.sentiment,
                        d.createdAt,
                        u.nickname,
                        count(distinct c.id),
                        count(distinct l.id),
                        d.imageUrl
                    )
                    from Diary d
                    join d.user u
                    left join d.comments c
                    left join d.userLikes l
                    where d.isPrivate = false
                    group by d.id, d.title, d.sentiment, d.createdAt, u.nickname, d.imageUrl
                    """,
            countQuery = "select count(d) from Diary d where d.isPrivate = false"
    )
    Page<PublicDiaryListResponse> findPublicDiaryList(Pageable pageable);

    List<Diary> findByTitleContaining(String title);

    List<Diary> findByContentContaining(String content);


}
