package com.backend.controller;

import com.jav.bluememories.domain.Diary;
import com.jav.bluememories.dto.DiaryDto;
import com.jav.bluememories.service.DiaryServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class DiaryController {

    @Autowired
    private DiaryServiceImpl diaryServiceImpl;

    @PostMapping("/diaries")
    public Diary createDiary(@RequestBody DiaryDto diaryDto) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return diaryServiceImpl.createDiary(diaryDto, userId);
    }

    @GetMapping("/check/{date}")
    public String checkDiaryExists(@PathVariable String date) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return diaryServiceImpl.checkDiaryExists(userId, date) ? "exist" : "don't_exist";
    }

    @GetMapping("/diary/{date}")
    public Diary getDiaryByDate(@PathVariable String date) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return diaryServiceImpl.getDiaryByDate(userId, date);
    }

    @GetMapping("/diaries/{year}/{month}")
    public List<Diary> getDiariesByMonth(@PathVariable int year, @PathVariable int month) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return diaryServiceImpl.getDiariesByMonth(userId, year, month);
    }
}