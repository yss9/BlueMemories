package com.backend.controller;

import com.backend.domain.SharedDiary;
import com.backend.dto.SharedDiaryDto;
import com.backend.service.SharedDiaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class SharedDiaryController {

    @Autowired
    private SharedDiaryService sharedDiaryService;

    @Value("${coverImage.base.url}")
    private String coverImageBaseUrl;

    @Value("${coverImage.coverImage2}")
    private String coverImage2;

    @Value("${coverImage.coverImage3}")
    private String coverImage3;

    @Value("${coverImage.coverImage4}")
    private String coverImage4;

    @Value("${coverImage.coverImage5}")
    private String coverImage5;

    //공유일기장 만들기
    @PostMapping("/create-shared-diary")
    public SharedDiary createSharedDiary(@RequestBody SharedDiaryDto sharedDiaryDto) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String coverImageUrl = getCoverImageUrl(sharedDiaryDto.getCoverImageUrl());
        sharedDiaryDto.setCoverImageUrl(coverImageUrl);
        return sharedDiaryService.createSharedDiary(sharedDiaryDto, userId);
    }

    //공유일기장 목록
    @GetMapping("/list-shared-diary")
    public List<SharedDiaryDto> getSharedDiaries(){
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return sharedDiaryService.getSharedDiariesByUser(userId);
    }

    //공유일기장 삭제하기
    @DeleteMapping("/delete-shared-diary/{id}")
    public void deleteSharedDiary(@PathVariable Long id){
        sharedDiaryService.deleteSharedDiary(id);
    }


    // 공유 일기장 만들기
    private String getCoverImageUrl(String coverImageKey) {
        switch (coverImageKey) {
            case "coverImage2":
                return coverImageBaseUrl + coverImage2;
            case "coverImage3":
                return coverImageBaseUrl + coverImage3;
            case "coverImage4":
                return coverImageBaseUrl + coverImage4;
            case "coverImage5":
                return coverImageBaseUrl + coverImage5;
            default:
                throw new IllegalArgumentException("Invalid cover image key: " + coverImageKey);
        }
    }

    //공유일기장 멤버 조회
    @GetMapping("/shared-diary-members/{id}")
    public List<String> getSharedDiaryMember(@PathVariable Long id){
        return sharedDiaryService.getSharedDiaryMember(id);
    }
}
