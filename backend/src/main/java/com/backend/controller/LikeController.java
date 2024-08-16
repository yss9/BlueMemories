package com.backend.controller;


import com.backend.domain.UserLikes;
import com.backend.dto.LikeDto;
import com.backend.service.LikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
public class LikeController {

    @Autowired
    private LikeService likeService;

    @GetMapping("/get-like/{diaryId}")
    public boolean checkLikeDiary(@PathVariable Long diaryId){
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return likeService.checkUserLike(diaryId, userId);
    }

    @PostMapping("/push-like")
    public boolean pushLikeDiary(@RequestBody LikeDto diaryId){
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        System.out.println("LikeController.pushLikeDiary");
        return likeService.pushLikeDiary(diaryId.getDiaryId(), userId);
    }

}
