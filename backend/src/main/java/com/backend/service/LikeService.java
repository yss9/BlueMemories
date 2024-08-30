package com.backend.service;

import com.backend.domain.Diary;
import com.backend.domain.User;
import com.backend.domain.UserLikes;
import com.backend.repository.DiaryRepository;
import com.backend.repository.UserLikeRepository;
import com.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

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
        Optional<Diary> optionalDiary = diaryRepository.findById(diaryId);
        Diary diary = optionalDiary.get();
        return userLikeRepository.existsByDiaryAndUser(diary, user);
    }

    public boolean pushLikeDiary(Long diaryId, String userId){

        Optional<Diary> optionalDiary = diaryRepository.findById(diaryId);
        Diary diary = optionalDiary.get();
        User user = userRepository.findByUserId(userId);
        boolean isPush = userLikeRepository.existsByDiaryAndUser(diary, user);
        if(!isPush){
            UserLikes userLikes = new UserLikes();
            userLikes.setDiary(diary);
            userLikes.setUser(user);
            userLikeRepository.save(userLikes);
            diary.setLikeNum(diary.getLikeNum()+1);
            diaryRepository.save(diary);
            return true;
        }
        else{
            Optional<UserLikes> userLikes = userLikeRepository.findByDiaryAndUser(diary, user);
            UserLikes userLike = userLikes.get();
            userLikeRepository.delete(userLike);
            diary.setLikeNum(diary.getLikeNum()-1);
            diaryRepository.save(diary);
            return false;
        }
    }

}
