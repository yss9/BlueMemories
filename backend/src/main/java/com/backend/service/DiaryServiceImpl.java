package com.backend.service;

import com.backend.domain.Diary;
import com.backend.domain.User;
import com.backend.dto.DiaryDto;
import com.backend.dto.DiarySentimentDto;
import com.backend.dto.PublicDiaryListResponse;
import com.backend.repository.DiaryRepository;
import com.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import reactor.core.scheduler.Schedulers;

@Service
public class DiaryServiceImpl implements DiaryService {

    private static final Logger log = LoggerFactory.getLogger(DiaryServiceImpl.class);

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
    public Mono<Diary> createDiary(DiaryDto diaryDto, String userId, MultipartFile imageFile) {
        User user = userRepository.findByUserId(userId);
        if (user == null) {
            return Mono.error(new RuntimeException("User not found"));
        }

        return sentimentAnalysisService.analyzeSentiment(diaryDto.getContent())
                .flatMap(sentimentResult -> {
                    String sentiment = sentimentResult.getDocument().getSentiment();
                    Double confidenceNegative = sentimentResult.getDocument().getConfidence().getNegative();
                    Double confidencePositive = sentimentResult.getDocument().getConfidence().getPositive();
                    Double confidenceNeutral = sentimentResult.getDocument().getConfidence().getNeutral();

                    return recommendService.recommendSearchWord(confidencePositive, confidenceNeutral, confidenceNegative)
                            .onErrorResume(error -> {
                                log.warn("Diary recommendation failed. Saving diary without recommendations: {}", error.getMessage());
                                return Mono.just(List.of("", "", "", ""));
                            })
                            .map(this::safeRecommendations)
                            .flatMap(recommendations -> Mono.fromCallable(() -> {
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

                                // 추천 결과가 있을 경우 설정
                                if (recommendations.size() >= 4) {
                                    diary.setKeyword1(recommendations.get(0));
                                    diary.setKeyword2(recommendations.get(1));
                                    diary.setKeyword3(recommendations.get(2));
                                    diary.setKeyword4(recommendations.get(3));
                                }

                                if (imageFile != null && !imageFile.isEmpty()) {
                                    try {
                                        String imageUrl = s3Service.uploadFile(imageFile);
                                        diary.setImageUrl(imageUrl);
                                    } catch (IOException e) {
                                        throw new RuntimeException("Failed to upload image", e);
                                    }
                                }

                                return diaryRepository.save(diary);
                            }).subscribeOn(Schedulers.boundedElastic()));
                });
    }

    private List<String> safeRecommendations(List<String> recommendations) {
        List<String> safeValues = new ArrayList<>();
        if (recommendations != null) {
            recommendations.stream()
                    .filter(value -> value != null && !value.trim().isEmpty())
                    .forEach(safeValues::add);
        }

        while (safeValues.size() < 4) {
            safeValues.add("");
        }

        return safeValues.subList(0, 4);
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

        DiaryDto diaryDto = new DiaryDto(
                diary.getId(),
                diary.getTitle(),
                diary.getContent(),
                diary.getUser().getNickname(),
                s3Service.createPresignedGetUrl(diary.getImageUrl())
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
                        , diary.getConfidenceNegative(), s3Service.createPresignedGetUrl(diary.getImageUrl())))
                .collect(Collectors.toList());
    }

    @Override
    public Page<PublicDiaryListResponse> getDiariesByPublic(Pageable pageable) {
        return diaryRepository.findPublicDiaryList(pageable)
                .map(response -> response.withThumbnailUrl(
                        s3Service.createPresignedGetUrl(response.getThumbnailUrl())
                ));
    }

    public DiaryDto getDiaryById(Long id){
        Optional<Diary> diaryOptional = diaryRepository.findById(id);
        Diary diary = diaryOptional.get();
        DiaryDto diaryDto = new DiaryDto(
                diary.getId(),
                diary.getTitle(),
                diary.getContent(),
                diary.getUser().getNickname(),
                s3Service.createPresignedGetUrl(diary.getImageUrl())
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
                        s3Service.createPresignedGetUrl(diary.getImageUrl())
                ))
                .collect(Collectors.toList());
    }

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
                        s3Service.createPresignedGetUrl(diary.getImageUrl())
                ))
                .collect(Collectors.toList());
    }


}
