package com.backend.service;

import com.backend.domain.Diary;
import com.backend.domain.User;
import com.backend.dto.DiaryDto;
import com.backend.dto.DiarySentimentDto;
import com.backend.dto.SentimentResult;
import com.backend.repository.DiaryRepository;
import com.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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

    @Autowired
    private S3Service s3Service;


    @Override
    public Diary createDiary(DiaryDto diaryDto, String userId, MultipartFile imageFile) {
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

        List<String> recommendations = recommendService.recommendSearchWord(confidencePositive, confidenceNeutral, confidenceNegative);
        diary.setKeyword1(recommendations.get(0));
        diary.setKeyword2(recommendations.get(1));
        diary.setKeyword3(recommendations.get(2));
        diary.setKeyword4(recommendations.get(3));

        // 이미지 업로드 및 URL 설정
        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                String imageUrl = s3Service.uploadFile(imageFile);
                diary.setImageUrl(imageUrl);
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload image", e);
            }
        }

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
    public DiaryDto getDiaryByDate(String userId, String date) {
        User user = userRepository.findByUserId(userId);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        Diary diary = diaryRepository.findByUserAndDate(user, date).orElse(null);
        if (diary == null) {
            throw new RuntimeException("Diary not found");
        }

        // Diary를 DiaryDto로 변환
        DiaryDto diaryDto = new DiaryDto(
                diary.getId(),
                diary.getTitle(),
                diary.getContent(),
                diary.getUser().getNickname(),
                diary.getImageUrl()
        );
        diaryDto.setDate(diary.getDate());
        diaryDto.setWeather(diary.getWeather());
        diaryDto.setConfidence(String.valueOf(diary.getSentiment()));
        diaryDto.setNegative(diary.getConfidenceNegative());
        diaryDto.setPositive(diary.getConfidencePositive());
        diaryDto.setNeutral(diary.getConfidenceNeutral());
        diaryDto.setKeyword1(diary.getKeyword1());
        diaryDto.setKeyword2(diary.getKeyword2());
        diaryDto.setKeyword3(diary.getKeyword3());
        diaryDto.setKeyword4(diary.getKeyword4());
        diaryDto.setLikeNum(diary.getLikeNum());

        return diaryDto;
    }

    public List<DiarySentimentDto> getDiariesByMonth(String userId, int year, int month) {
        User user = userRepository.findByUserId(userId);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        LocalDate startDate = YearMonth.of(year, month).atDay(1);
        LocalDate endDate = YearMonth.of(year, month).atEndOfMonth();
        return diaryRepository.findByUserAndDateBetweenOrderByDateDesc(user, startDate.toString(), endDate.toString())
                .stream()
                .map(diary -> new DiarySentimentDto(diary.getId(),diary.getDate(), diary.getSentiment(), diary.getTitle()
                        , diary.getContent(), diary.getConfidencePositive(), diary.getConfidenceNeutral()
                        , diary.getConfidenceNegative(), diary.getImageUrl()))
                .collect(Collectors.toList());
    }

    @Override
    public List<DiaryDto> getDiariesByPublic() {
        List<Diary> diaries = diaryRepository.findByIsPrivate(false);
        List<DiaryDto> diaryDtos = new ArrayList<>();
        for (Diary diary : diaries) {
            DiaryDto dto = new DiaryDto(diary.getId(), diary.getTitle(), diary.getContent(), diary.getUser().getNickname(),diary.getImageUrl());
            diaryDtos.add(dto);
        }

        return diaryDtos;
    }

    public DiaryDto getDiaryById(Long id){
        Optional<Diary> diaryOptional = diaryRepository.findById(id);
        Diary diary = diaryOptional.get();
        DiaryDto diaryDto = new DiaryDto(
                diary.getId(),
                diary.getTitle(),
                diary.getContent(),
                diary.getUser().getNickname(),
                diary.getImageUrl()
        );
        diaryDto.setDate(diary.getDate());
        diaryDto.setWeather(diary.getWeather());
        diaryDto.setConfidence(String.valueOf(diary.getSentiment()));
        diaryDto.setNegative(diary.getConfidenceNegative());
        diaryDto.setPositive(diary.getConfidencePositive());
        diaryDto.setNeutral(diary.getConfidenceNeutral());
        diaryDto.setKeyword1(diary.getKeyword1());
        diaryDto.setKeyword2(diary.getKeyword2());
        diaryDto.setKeyword3(diary.getKeyword3());
        diaryDto.setKeyword4(diary.getKeyword4());
        diaryDto.setLikeNum(diary.getLikeNum());

        return diaryDto;
    }


    // 제목으로 다이어리 검색
    public List<DiarySentimentDto> searchDiariesByTitle(String keyword) {
        List<Diary> diaries = diaryRepository.findByTitleContaining(keyword);
        return diaries.stream()
                .map(diary -> new DiarySentimentDto(
                        diary.getId(),
                        diary.getDate(),
                        diary.getSentiment(),
                        diary.getTitle(),
                        diary.getContent(),
                        diary.getConfidencePositive(),
                        diary.getConfidenceNeutral(),
                        diary.getConfidenceNegative(),
                        diary.getImageUrl()
                ))
                .collect(Collectors.toList());
    }

    // 내용으로 다이어리 검색
    public List<DiarySentimentDto> searchDiariesByContent(String keyword) {
        List<Diary> diaries = diaryRepository.findByContentContaining(keyword);
        return diaries.stream()
                .map(diary -> new DiarySentimentDto(
                        diary.getId(),
                        diary.getDate(),
                        diary.getSentiment(),
                        diary.getTitle(),
                        diary.getContent(),
                        diary.getConfidencePositive(),
                        diary.getConfidenceNeutral(),
                        diary.getConfidenceNegative(),
                        diary.getImageUrl()
                ))
                .collect(Collectors.toList());
    }


}