package com.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class RecommendService {

    @Autowired
    private OpenAIService openAIService;

    @Autowired
    private YouTubeService youTubeService;

    public List<String> recommendSearch(Double confidencePositive, Double confidenceNeutral, Double confidenceNegative) {
        String prompt = "감정 수치가 부정 : " + confidenceNegative + "%, 중립 : " + confidenceNeutral + "%, 긍정 : " + confidencePositive +
                "%일 때 들을만한 노래 두 곡과 유튜브에서 볼만한 동영상 검색어 두 가지를 추천해줘 검색 응답 형태는 1. 노래: 노래 제목 - 가수 이름, 2. 노래: 노래 제목 - 가수 이름, 3. 검색어: 검색어 내용, 4. 검색어: 검색어 내용 형태로 응답해줘";

        Mono<String> chatResponse = openAIService.getChatResponse(prompt);
        String response = chatResponse.block();
        System.out.println("response = " + response);

        List<String> results = new ArrayList<>();

        // 정규 표현식을 사용하여 노래와 검색어를 추출
        Pattern recommendationPattern = Pattern.compile("\\d+\\. (노래|검색어):\\s*(.+)");
        Matcher matcher = recommendationPattern.matcher(response);

        while (matcher.find()) {
            results.add(matcher.group(2).trim());
        }

        // 결과 확인
        System.out.println("Extracted recommendations: " + results);

        // 유튜브 동영상 검색
        List<String> videoUrls = youTubeService.searchVideos(results).collectList().block();

        System.out.println("videoUrls = " + videoUrls);

        // 결과에 유튜브 동영상 URL 추가
        if (videoUrls != null && !videoUrls.isEmpty()) {
            results.addAll(videoUrls);
        } else {
            System.out.println("No videos found for the provided queries.");
        }

        return results;
    }
}