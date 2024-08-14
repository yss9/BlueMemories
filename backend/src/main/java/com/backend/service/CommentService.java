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
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private DiaryRepository diaryRepository;

    @Autowired
    private UserRepository userRepository;

    public List<CreateCommentRequest> getDiaryComments(Long diaryId) {
        Optional<Diary> diary = diaryRepository.findById(diaryId);
        return commentRepository.findCommentsByDiary(diary.get()).stream()
                .map(comment -> new CreateCommentRequest(
                        comment.getDiary().getId(),
                        comment.getContent(),
                        comment.getUser().getNickname()))
                .collect(Collectors.toList());
    }

    public Comment createDiaryComment(Long diaryId, String userId, String content){
        Optional<Diary> diary = diaryRepository.findById(diaryId);
        User user = userRepository.findByUserId(userId);
        Comment comment = new Comment();
        comment.setDiary(diary.get());
        comment.setUser(user);
        comment.setContent(content);
        return commentRepository.save(comment);
    }

}
