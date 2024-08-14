package com.backend.repository;

import com.backend.domain.Comment;
import com.backend.domain.Diary;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findCommentsByDiary(Diary diary);
}
