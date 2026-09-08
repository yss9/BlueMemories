package com.backend.service;

import com.backend.domain.Comment;
import com.backend.domain.Diary;
import com.backend.domain.User;
import com.backend.dto.CreateCommentRequest;
import com.backend.repository.CommentRepository;
import com.backend.repository.DiaryRepository;
import com.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private DiaryRepository diaryRepository;

    @Autowired
    private UserRepository userRepository;

    public List<CreateCommentRequest> getDiaryComments(Long diaryId) {
        Diary diary = diaryRepository.findById(diaryId)
                .orElseThrow(() -> new IllegalArgumentException("Diary not found: " + diaryId));

        return commentRepository.findCommentsByDiary(diary).stream()
                .map(comment -> new CreateCommentRequest(
                        comment.getDiary().getId(),
                        comment.getContent(),
                        comment.getUser().getNickname()))
                .collect(Collectors.toList());
    }

    public CreateCommentRequest createDiaryComment(Long diaryId, String userId, String content){
        Diary diary = diaryRepository.findById(diaryId)
                .orElseThrow(() -> new IllegalArgumentException("Diary not found: " + diaryId));
        User user = userRepository.findByUserId(userId);
        if (user == null) {
            throw new IllegalArgumentException("User not found: " + userId);
        }

        Comment comment = new Comment();
        comment.setDiary(diary);
        comment.setUser(user);
        comment.setContent(content);
        Comment savedComment = commentRepository.save(comment);

        return new CreateCommentRequest(
                savedComment.getDiary().getId(),
                savedComment.getContent(),
                savedComment.getUser().getNickname()
        );
    }

}
