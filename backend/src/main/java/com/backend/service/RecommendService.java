package com.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class RecommendService {

    @Autowired
    private OpenAIService openAIService;

    @Autowired
    private YouTubeService youTubeService;

    public List<String> recommendSearchWord(Double confidencePositive, Double confidenceNeutral, Double confidenceNegative) {
        String prompt = "감정 수치가 부정 : " + confidenceNegative + "%, 중립 : " + confidenceNeutral + "%, 긍정 : " + confidencePositive +
                "%일 때 들을만한 노래 두 곡과 유튜브에서 볼만한 동영상 검색어 두 가지를 추천해줘 검색 응답 형태는 1. 노래: 노래 제목 - 가수 이름, 2. 노래: 노래 제목 - 가수 이름, 3. 검색어: 검색어 내용, 4. 검색어: 검색어 내용 형태로 응답해줘";

        Mono<String> chatResponse = openAIService.getChatResponse(prompt);
        String response = chatResponse.block();

        List<String> results = new ArrayList<>();

        // 정규 표현식을 사용하여 노래와 검색어를 추출
        Pattern recommendationPattern = Pattern.compile("\\d+\\. (노래|검색어):\\s*(.+)");
        Matcher matcher = recommendationPattern.matcher(response);

        while (matcher.find()) {
            results.add(matcher.group(2).trim());
        }

        // 유튜브 동영상 검색
        List<String> videoUrls = youTubeService.searchVideos(results).collectList().block();

        return videoUrls;
    }

//    public List<String> recommendDiaryTheme() {
//        String prompt = "오늘의 감정을 드러낼 수 있는 일기를 작성하고 싶어, 일기에 대한 주제를 4가지만 선정해줘. 각 주제마다 마지막에 // 으로 각 주제를 구분할 수 있으면 좋겠어.";
//        Mono<String> chatResponse = openAIService.getChatResponse(prompt);
//        String response = chatResponse.block();  // 비동기 작업을 동기적으로 처리
//
//        // 결과 문자열을 "//"로 분리
//        List<String> results = new ArrayList<>();
//        if (response != null && !response.isEmpty()) {
//            results = Arrays.asList(response.split("//"));
//        }
//
//        // 각 주제 문자열의 앞뒤 공백을 제거
//        results.replaceAll(String::trim);
//
//        return results;
//    }

}