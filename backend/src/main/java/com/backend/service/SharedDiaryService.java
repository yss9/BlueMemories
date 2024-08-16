package com.backend.service;

import org.springframework.stereotype.Service;


import com.backend.domain.SharedDiary;
import com.backend.domain.SharedDiaryContent;
import com.backend.domain.SharedDiaryUser;
import com.backend.domain.User;
import com.backend.dto.DiaryDto;
import com.backend.dto.SentimentResult;
import com.backend.dto.SharedDiaryRequest;
import com.backend.repository.SharedDiaryContentRepository;
import com.backend.repository.SharedDiaryRepository;
import com.backend.repository.SharedDiaryUserRepository;
import com.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

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

    public SharedDiary createSharedDiary(SharedDiaryRequest request, User user){
        SharedDiary sharedDiary = new SharedDiary();
        sharedDiary.setTitle(request.getTitle());
        sharedDiary.setCoverImage(request.getCoverImage());
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
}
