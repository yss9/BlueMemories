package com.backend.service;

import com.backend.domain.Diary;
import com.backend.dto.DiaryDto;

import java.util.List;

public interface DiaryService {
    Diary createDiary(DiaryDto diaryDto, String userId);
    boolean checkDiaryExists(String userId, String date);
    Diary getDiaryByDate(String userId, String date);
    List<Diary> getDiariesByMonth(String userId, int year, int month);
    List<DiaryDto> getDiariesByPublic();
}