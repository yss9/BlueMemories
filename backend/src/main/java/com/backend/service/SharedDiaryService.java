package com.backend.service;

import org.springframework.stereotype.Service;


import com.backend.domain.SharedDiary;
import com.backend.domain.SharedDiaryContent;
import com.backend.domain.SharedDiaryUser;
import com.backend.domain.User;
import com.backend.dto.DiaryDto;
import com.backend.dto.SentimentResult;
import com.backend.dto.SharedDiaryDto;
import com.backend.repository.SharedDiaryContentRepository;
import com.backend.repository.SharedDiaryRepository;
import com.backend.repository.SharedDiaryUserRepository;
import com.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SharedDiaryService {

    @Autowired
    private SharedDiaryRepository sharedDiaryRepository;

    @Autowired
    private SharedDiaryUserRepository sharedDiaryUserRepository;

    @Autowired
    private SharedDiaryContentRepository sharedDiaryContentRepository;

    @Autowired
    private SentimentAnalysisService sentimentAnalysisService;

    @Autowired
    private RecommendService recommendService;

    @Autowired
    private S3Service s3Service;

    @Autowired
    private UserRepository userRepository;

    public SharedDiary createSharedDiary(SharedDiaryDto request, String userId){
        User user = userRepository.findByUserId(userId);
        SharedDiary sharedDiary = new SharedDiary();
        sharedDiary.setTitle(request.getTitle());
        sharedDiary.setCoverImageUrl(request.getCoverImageUrl());
        sharedDiary.setUser(user);
        sharedDiaryRepository.save(sharedDiary);
        SharedDiaryUser sharedDiaryUser = new SharedDiaryUser();
        sharedDiaryUser.setSharedDiary(sharedDiary);
        sharedDiaryUser.setUser(user);
        sharedDiaryUserRepository.save(sharedDiaryUser);
        return sharedDiary;
    }

    public void deleteSharedDiary(Long id){
        sharedDiaryRepository.deleteById(id);
    }

    public SharedDiaryContent createSharedDiaryContent(DiaryDto diaryDto, String userId, MultipartFile imageFile){
        SharedDiaryContent sharedDiaryContent = new SharedDiaryContent();

        SentimentResult sentimentResult = sentimentAnalysisService.analyzeSentiment(diaryDto.getContent()).block();
        String sentiment = sentimentResult.getDocument().getSentiment();
        Double confidenceNegative = sentimentResult.getDocument().getConfidence().getNegative();
        Double confidencePositive = sentimentResult.getDocument().getConfidence().getPositive();
        Double confidenceNeutral = sentimentResult.getDocument().getConfidence().getNeutral();

        sharedDiaryContent.setSharedDiary((sharedDiaryRepository.findById(diaryDto.getId())).get());
        sharedDiaryContent.setContent(diaryDto.getContent());
        sharedDiaryContent.setTitle(diaryDto.getTitle());
        sharedDiaryContent.setConfidenceNegative(confidenceNegative);
        sharedDiaryContent.setConfidencePositive(confidencePositive);
        sharedDiaryContent.setConfidenceNeutral(confidenceNeutral);
        sharedDiaryContent.setSentiment(sentiment);
        sharedDiaryContent.setUser(userRepository.findByUserId(userId));

        List<String> recommendations = recommendService.recommendSearch(confidencePositive, confidenceNeutral, confidenceNegative);
        sharedDiaryContent.setKeyword1(recommendations.get(0));
        sharedDiaryContent.setKeyword2(recommendations.get(1));
        sharedDiaryContent.setKeyword3(recommendations.get(2));
        sharedDiaryContent.setKeyword4(recommendations.get(3));

        // 이미지 업로드 및 URL 설정
        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                String imageUrl = s3Service.uploadFile(imageFile);
                sharedDiaryContent.setImageUrl(imageUrl);
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload image", e);
            }
        }
        return sharedDiaryContentRepository.save(sharedDiaryContent);
    }

    public SharedDiary getSharedDiaryById(Long id){
        Optional<SharedDiary> sharedDiary = sharedDiaryRepository.findById(id);
        return sharedDiary.get();
    }

    private SharedDiaryDto convertToDto(SharedDiary sharedDiary) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy. MM. dd.");

        SharedDiaryDto dto = new SharedDiaryDto();
        dto.setId(sharedDiary.getId());
        dto.setTitle(sharedDiary.getTitle());
        dto.setCoverImageUrl(sharedDiary.getCoverImageUrl());
        dto.setCreatedAt(sharedDiary.getCreatedAt().format(formatter)); // 날짜 포맷 변환

        return dto;
    }

    public List<SharedDiaryDto> getSharedDiariesByUser(String userId) {
        User user = userRepository.findByUserId(userId);
        List<SharedDiaryUser> sharedDiaryUsers = sharedDiaryUserRepository.findAllByUser(user);

        // sharedDiaryUsers 리스트에서 각 SharedDiary를 가져와 리스트로 변환
        List<SharedDiary> sharedDiaries = sharedDiaryUsers.stream()
                .map(SharedDiaryUser::getSharedDiary)
                .collect(Collectors.toList());

        // DTO 변환 후 반환
        return sharedDiaries.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // 참여중인 멤버 검색
    public List<String> getSharedDiaryMember(Long sharedDiaryId) {
        SharedDiary sharedDiary = sharedDiaryRepository.findById(sharedDiaryId)
                .orElseThrow(() -> new RuntimeException("Shared diary not found"));

        List<SharedDiaryUser> bySharedDiary = sharedDiaryUserRepository.findBySharedDiary(sharedDiary);
        System.out.println("bySharedDiary = " + bySharedDiary);
        // 멤버들의 닉네임을 추출하여 리스트로 반환
        return bySharedDiary.stream()
                .map(sharedDiaryUser -> sharedDiaryUser.getUser().getNickname())
                .collect(Collectors.toList());
    }

}
