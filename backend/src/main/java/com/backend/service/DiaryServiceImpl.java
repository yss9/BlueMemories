package com.backend.service;

import com.backend.domain.Diary;
import com.backend.domain.User;
import com.backend.dto.DiaryDto;
import com.backend.dto.SentimentResult;
import com.backend.repository.DiaryRepository;
import com.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
@Service
public class DiaryServiceImpl implements DiaryService {

    @Autowired
    private DiaryRepository diaryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SentimentAnalysisService sentimentAnalysisService;

    @Autowired
    private RecommendService recommendService;

    @Override
    public Diary createDiary(DiaryDto diaryDto, String userId) {
        User user = userRepository.findByUserId(userId);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        SentimentResult sentimentResult = sentimentAnalysisService.analyzeSentiment(diaryDto.getContent()).block();
        String sentiment = sentimentResult.getDocument().getSentiment();
        Double confidenceNegative = sentimentResult.getDocument().getConfidence().getNegative();
        Double confidencePositive = sentimentResult.getDocument().getConfidence().getPositive();
        Double confidenceNeutral = sentimentResult.getDocument().getConfidence().getNeutral();

        Diary diary = new Diary();
        diary.setTitle(diaryDto.getTitle());
        diary.setWeather(diaryDto.getWeather());
        diary.setIsPrivate(diaryDto.getIsPrivate());
        diary.setLikeNum(0);
        diary.setUser(user);
        diary.setContent(diaryDto.getContent());
        diary.setDate(diaryDto.getDate());

        diary.setSentiment(sentiment);
        diary.setConfidenceNegative(confidenceNegative);
        diary.setConfidenceNeutral(confidenceNeutral);
        diary.setConfidencePositive(confidencePositive);

        List<String> recommendations = recommendService.recommendSearch(confidencePositive, confidenceNeutral, confidenceNegative);
        diary.setKeyword1(recommendations.get(0));
        diary.setKeyword2(recommendations.get(1));
        diary.setKeyword3(recommendations.get(2));
        diary.setKeyword4(recommendations.get(3));

        return diaryRepository.save(diary);
    }

    @Override
    public boolean checkDiaryExists(String userId, String date) {
        User user = userRepository.findByUserId(userId);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        return diaryRepository.existsByUserAndDate(user, date);
    }

    @Override
    public Diary getDiaryByDate(String userId, String date) {
        User user = userRepository.findByUserId(userId);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        return diaryRepository.findByUserAndDate(user, date).orElse(null);
    }

    @Override
    public List<Diary> getDiariesByMonth(String userId, int year, int month) {
        User user = userRepository.findByUserId(userId);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        LocalDate startDate = YearMonth.of(year, month).atDay(1);
        LocalDate endDate = YearMonth.of(year, month).atEndOfMonth();
        return diaryRepository.findByUserAndDateBetween(user, startDate.toString(), endDate.toString());
    }

    @Override
    public List<DiaryDto> getDiariesByPublic() {
        List<Diary> diaries = diaryRepository.findByIsPrivate(false);
        List<DiaryDto> diaryDtos = new ArrayList<>();
        for (Diary diary : diaries) {
            DiaryDto dto = new DiaryDto(diary.getId(), diary.getTitle(), diary.getContent(), diary.getUser().getNickname());
            diaryDtos.add(dto);
        }

        return diaryDtos;
    }

}