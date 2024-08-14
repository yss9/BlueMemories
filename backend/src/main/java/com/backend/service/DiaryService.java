package com.backend.service;

import com.backend.domain.Diary;
import com.backend.dto.DiaryDto;
import com.backend.dto.DiarySentimentDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface DiaryService {
    Diary createDiary(DiaryDto diaryDto, String userId, MultipartFile imageFile);
    boolean checkDiaryExists(String userId, String date);
    DiaryDto getDiaryByDate(String userId, String date);
    List<DiarySentimentDto> getDiariesByMonth(String userId, int year, int month);
    List<DiaryDto> getDiariesByPublic();
}