package com.backend.service;

import com.backend.domain.Diary;
import com.backend.domain.User;
import com.backend.domain.UserLikes;
import com.backend.repository.DiaryRepository;
import com.backend.repository.UserLikeRepository;
import com.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LikeService {

    @Autowired
    private UserLikeRepository userLikeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DiaryRepository diaryRepository;

    public boolean checkUserLike(Long diaryId, String userId){
        User user = userRepository.findByUserId(userId);
        if (user == null) {
            throw new IllegalArgumentException("User not found: " + userId);
        }

        Diary diary = diaryRepository.findById(diaryId)
                .orElseThrow(() -> new IllegalArgumentException("Diary not found: " + diaryId));
        return userLikeRepository.existsByDiaryAndUser(diary, user);
    }

    public boolean pushLikeDiary(Long diaryId, String userId){

        Diary diary = diaryRepository.findById(diaryId)
                .orElseThrow(() -> new IllegalArgumentException("Diary not found: " + diaryId));
        User user = userRepository.findByUserId(userId);
        if (user == null) {
            throw new IllegalArgumentException("User not found: " + userId);
        }

        int currentLikeNum = diary.getLikeNum() == null ? 0 : diary.getLikeNum();
        boolean isPush = userLikeRepository.existsByDiaryAndUser(diary, user);
        if(!isPush){
            UserLikes userLikes = new UserLikes();
            userLikes.setDiary(diary);
            userLikes.setUser(user);
            userLikeRepository.save(userLikes);
            diary.setLikeNum(currentLikeNum + 1);
            diaryRepository.save(diary);
            return true;
        }
        else{
            UserLikes userLike = userLikeRepository.findByDiaryAndUser(diary, user)
                    .orElseThrow(() -> new IllegalStateException("Like not found"));
            userLikeRepository.delete(userLike);
            diary.setLikeNum(Math.max(currentLikeNum - 1, 0));
            diaryRepository.save(diary);
            return false;
        }
    }

}
