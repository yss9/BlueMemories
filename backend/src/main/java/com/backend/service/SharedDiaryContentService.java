package com.backend.service;

import com.backend.domain.SharedDiary;
import com.backend.domain.SharedDiaryContent;
import com.backend.domain.User;
import com.backend.dto.SentimentResult;
import com.backend.dto.SharedDiaryContentRequest;
import com.backend.repository.SharedDiaryContentRepository;
import com.backend.repository.SharedDiaryRepository;
import com.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SharedDiaryContentService {

    @Autowired
    private SharedDiaryContentRepository sharedDiaryContentRepository;

    @Autowired
    private SharedDiaryRepository sharedDiaryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SentimentAnalysisService sentimentAnalysisService;

    @Autowired
    private RecommendService recommendService;

    @Autowired
    private S3Service s3Service;


    // 공유 일기장 컨텐츠 생성
    public SharedDiaryContent createSharedDiaryContent(SharedDiaryContentRequest request, String userId, MultipartFile imageFile) {
        User user = userRepository.findByUserId(userId);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        SharedDiary sharedDiary = sharedDiaryRepository.findById(request.getSharedDiaryId())
                .orElseThrow(() -> new RuntimeException("Shared diary not found"));

        SentimentResult sentimentResult = sentimentAnalysisService.analyzeSentiment(request.getContent()).block();
        String sentiment = sentimentResult.getDocument().getSentiment();
        Double confidenceNegative = sentimentResult.getDocument().getConfidence().getNegative();
        Double confidencePositive = sentimentResult.getDocument().getConfidence().getPositive();
        Double confidenceNeutral = sentimentResult.getDocument().getConfidence().getNeutral();

        SharedDiaryContent content = new SharedDiaryContent();
        content.setTitle(request.getTitle());
        content.setContent(request.getContent());
        content.setWeather(request.getWeather());
        content.setDate(request.getDate());
        content.setSentiment(sentiment);
        content.setConfidenceNegative(confidenceNegative);
        content.setConfidenceNeutral(confidenceNeutral);
        content.setConfidencePositive(confidencePositive);

        List<String> recommendations = recommendService.recommendSearchWord(confidencePositive, confidenceNeutral, confidenceNegative);
        content.setKeyword1(recommendations.get(0));
        content.setKeyword2(recommendations.get(1));
        content.setKeyword3(recommendations.get(2));
        content.setKeyword4(recommendations.get(3));

        content.setUser(user);
        content.setSharedDiary(sharedDiary);

        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                String imageUrl = s3Service.uploadFile(imageFile);
                content.setImageUrl(imageUrl);
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload image", e);
            }
        }

        return sharedDiaryContentRepository.save(content);
    }

    // 공유 일기장 컨텐츠 ID로 컨텐츠 데이터 로드
    public SharedDiaryContentRequest getSharedDiaryContentById(Long sharedDiaryContentId){
        Optional<SharedDiaryContent> sharedDiaryContent = sharedDiaryContentRepository.findById(sharedDiaryContentId);
        return convertToDto(sharedDiaryContent.get());
    }

    // 공유 일기장 ID로 모든 컨텐츠 조회
    public List<SharedDiaryContentRequest> getSharedDiaryContentsBySharedDiaryId(Long sharedDiaryId) {
        SharedDiary sharedDiary = sharedDiaryRepository.findById(sharedDiaryId)
                .orElseThrow(() -> new RuntimeException("Shared diary not found"));

        return sharedDiaryContentRepository.findBySharedDiary(sharedDiary)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // 공유 일기장의 컨텐츠들을 오름차순으로 조회
    public List<SharedDiaryContentRequest> getSharedDiaryContentsOrderByAsc(Long sharedDiaryId) {
        SharedDiary sharedDiary = sharedDiaryRepository.findById(sharedDiaryId)
                .orElseThrow(() -> new RuntimeException("Shared diary not found"));
        return sharedDiaryContentRepository.findBySharedDiaryOrderByDateAsc(sharedDiary)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // 공유 일기장의 컨텐츠들을 내림차순으로 조회
    public List<SharedDiaryContentRequest> getSharedDiaryContentsOrderByDesc(Long sharedDiaryId) {
        SharedDiary sharedDiary = sharedDiaryRepository.findById(sharedDiaryId)
                .orElseThrow(() -> new RuntimeException("Shared diary not found"));
        return sharedDiaryContentRepository.findBySharedDiaryOrderByDateDesc(sharedDiary)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // 제목으로 컨텐츠 검색
    public List<SharedDiaryContentRequest> searchContentsByTitle(String title) {
        return sharedDiaryContentRepository.findByTitleContaining(title)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // 본문 내용으로 컨텐츠 검색
    public List<SharedDiaryContentRequest> searchContentsByContent(String content) {
        return sharedDiaryContentRepository.findByContentContaining(content)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // 닉네임으로 컨텐츠 검색
    public List<SharedDiaryContentRequest> searchContentsByNickname(String nickname) {
        return sharedDiaryContentRepository.findByUser_NicknameContaining(nickname)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }


    // SharedDiaryContent를 SharedDiaryContentRequest DTO로 변환하는 메서드
    private SharedDiaryContentRequest convertToDto(SharedDiaryContent content) {
        SharedDiaryContentRequest dto = new SharedDiaryContentRequest();
        String nickname = content.getUser().getNickname();
        dto.setId(content.getId());
        dto.setTitle(content.getTitle());
        dto.setContent(content.getContent());
        dto.setWeather(content.getWeather());
        dto.setDate(content.getDate());
        dto.setNickname(nickname);
        dto.setSentiment(content.getSentiment());
        dto.setConfidenceNegative(content.getConfidenceNegative());
        dto.setConfidenceNeutral(content.getConfidenceNeutral());
        dto.setConfidencePositive(content.getConfidencePositive());
        dto.setKeyword1(content.getKeyword1());
        dto.setKeyword2(content.getKeyword2());
        dto.setKeyword3(content.getKeyword3());
        dto.setKeyword4(content.getKeyword4());
        dto.setImageUrl(content.getImageUrl());
        dto.setSharedDiaryId(content.getSharedDiary().getId());
        return dto;
    }
}