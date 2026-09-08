package com.backend.controller;

import com.backend.domain.SharedDiary;
import com.backend.dto.SharedDiaryDto;
import com.backend.service.SharedDiaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class SharedDiaryController {

    @Autowired
    private SharedDiaryService sharedDiaryService;

    //공유일기장 만들기
    @PostMapping("/create-shared-diary")
    public SharedDiary createSharedDiary(@RequestBody SharedDiaryDto sharedDiaryDto) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
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
    //공유일기장 멤버 조회
    @GetMapping("/shared-diary-members/{id}")
    public List<String> getSharedDiaryMember(@PathVariable Long id){
        return sharedDiaryService.getSharedDiaryMember(id);
    }
}
