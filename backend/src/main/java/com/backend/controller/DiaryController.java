package com.backend.controller;

import com.backend.domain.Diary;
import com.backend.dto.DiaryDto;
import com.backend.dto.DiarySentimentDto;
import com.backend.service.DiaryServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class DiaryController {

    @Autowired
    private DiaryServiceImpl diaryServiceImpl;

    @PostMapping("/diaries")
    public Mono<Diary> createDiary(@RequestPart("diary") DiaryDto diaryDto,
                                   @RequestPart(value = "image", required = false) MultipartFile imageFile) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return diaryServiceImpl.createDiary(diaryDto, userId, imageFile);
    }

    @GetMapping("/check/{date}")
    public String checkDiaryExists(@PathVariable String date) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return diaryServiceImpl.checkDiaryExists(userId, date) ? "exist" : "don't_exist";
    }

    @GetMapping("/diary/{date}")
    public DiaryDto getDiaryByDate(@PathVariable String date) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return diaryServiceImpl.getDiaryByDate(userId, date);
    }

    @GetMapping("/get-diary/{id}")
    public DiaryDto getDiaryById(@PathVariable Long id){
        return diaryServiceImpl.getDiaryById(id);
    }

    @GetMapping("/diaries/{year}/{month}")
    public List<DiarySentimentDto> getDiariesByMonth(@PathVariable int year, @PathVariable int month) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return diaryServiceImpl.getDiariesByMonth(userId, year, month);
    }

    @GetMapping("/diaries/users")
    public List<DiaryDto> getDiariesByPublic(){
        return diaryServiceImpl.getDiariesByPublic();
    }


    // 제목으로 다이어리 검색
    @GetMapping("/search/title")
    public List<DiarySentimentDto> searchDiariesByTitle(@RequestParam String keyword) {
        return diaryServiceImpl.searchDiariesByTitle(keyword);
    }

    // 내용으로 다이어리 검색
    @GetMapping("/search/content")
    public List<DiarySentimentDto> searchDiariesByContent(@RequestParam String keyword) {
        return diaryServiceImpl.searchDiariesByContent(keyword);
    }
}