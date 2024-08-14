package com.backend.controller;

import com.backend.domain.Comment;
import com.backend.dto.CreateCommentRequest;
import com.backend.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CommentController {

    @Autowired
    private CommentService commentService;

    @GetMapping("/get-comments/{id}")
    public List<CreateCommentRequest> getDiaryComment(@PathVariable Long id){
        return commentService.getDiaryComments(id);

    }

    @PostMapping("/create-comment")
    public Comment createDiaryComment(@RequestBody CreateCommentRequest request){
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return commentService.createDiaryComment(request.getDiaryId(), userId, request.getContent());
    }

}
