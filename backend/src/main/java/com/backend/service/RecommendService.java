package com.backend.service;

import com.backend.dto.AiRecommendationResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;

@Service
public class RecommendService {

    private static final int MAX_ATTEMPTS = 2;
    private static final List<String> FALLBACK_SONGS = List.of("잔잔한 위로 노래", "기분 전환 노래");
    private static final List<String> FALLBACK_SEARCH_KEYWORDS = List.of("힐링 브이로그", "마음이 편안해지는 영상");

    private final AiChatService aiChatService;
    private final YouTubeService youTubeService;
    private final ObjectMapper objectMapper;

    public RecommendService(AiChatService aiChatService, YouTubeService youTubeService, ObjectMapper objectMapper) {
        this.aiChatService = aiChatService;
        this.youTubeService = youTubeService;
        this.objectMapper = objectMapper;
    }

    public Mono<List<String>> recommendSearchWord(Double confidencePositive, Double confidenceNeutral, Double confidenceNegative) {
        return recommendWithRetry(confidencePositive, confidenceNeutral, confidenceNegative)
                .flatMap(recommendations -> {
                    List<String> queries = new ArrayList<>();
                    queries.addAll(recommendations.getSongs());
                    queries.addAll(recommendations.getSearchKeywords());
                    return searchVideoIds(queries);
                });
    }

    private Mono<AiRecommendationResponse> recommendWithRetry(Double confidencePositive,
                                                              Double confidenceNeutral,
                                                              Double confidenceNegative) {
        String prompt = buildPrompt(confidencePositive, confidenceNeutral, confidenceNegative);
        String retryPrompt = buildRetryPrompt(confidencePositive, confidenceNeutral, confidenceNegative);
        return recommendAttempt(prompt, retryPrompt, 1);
    }

    private Mono<AiRecommendationResponse> recommendAttempt(String prompt, String retryPrompt, int attempt) {
        return aiChatService.getChatResponse(prompt)
                .map(response -> {
                    try {
                        AiRecommendationResponse recommendations = parseRecommendations(response);
                        validate(recommendations);
                        return recommendations;
                    } catch (Exception e) {
                        throw new IllegalArgumentException("Invalid AI recommendation response", e);
                    }
                })
                .onErrorResume(error -> {
                    if (attempt < MAX_ATTEMPTS) {
                        return recommendAttempt(retryPrompt, retryPrompt, attempt + 1);
                    }
                    return Mono.just(fallbackRecommendations());
                });
    }

    private String buildPrompt(Double confidencePositive, Double confidenceNeutral, Double confidenceNegative) {
        return """
                Recommend YouTube search queries from these diary sentiment scores.
                Return JSON only. No markdown. No explanation.
                Required schema:
                {"songs":["song title artist","song title artist"],"searchKeywords":["keyword","keyword"]}
                Rules:
                - songs must contain exactly 2 Korean or globally searchable music queries.
                - searchKeywords must contain exactly 2 non-music YouTube search queries.
                - Every item must be a non-empty string.
                Sentiment scores:
                negative: %s%%, neutral: %s%%, positive: %s%%
                """.formatted(confidenceNegative, confidenceNeutral, confidencePositive);
    }

    private String buildRetryPrompt(Double confidencePositive, Double confidenceNeutral, Double confidenceNegative) {
        return """
                Your previous response was invalid.
                Return valid JSON only. No markdown. No explanation.
                Required schema:
                {"songs":["song title artist","song title artist"],"searchKeywords":["keyword","keyword"]}
                songs length must be 2. searchKeywords length must be 2.
                Sentiment scores:
                negative: %s%%, neutral: %s%%, positive: %s%%
                """.formatted(confidenceNegative, confidenceNeutral, confidencePositive);
    }

    private AiRecommendationResponse parseRecommendations(String response) throws Exception {
        JsonNode node = objectMapper.readTree(response);
        return objectMapper.treeToValue(node, AiRecommendationResponse.class);
    }

    private void validate(AiRecommendationResponse recommendations) {
        if (recommendations.getSongs() == null || recommendations.getSearchKeywords() == null) {
            throw new IllegalArgumentException("songs and searchKeywords are required");
        }
        if (recommendations.getSongs().size() != 2 || recommendations.getSearchKeywords().size() != 2) {
            throw new IllegalArgumentException("songs and searchKeywords must each contain exactly 2 items");
        }
        if (!allValid(recommendations.getSongs()) || !allValid(recommendations.getSearchKeywords())) {
            throw new IllegalArgumentException("recommendation items must be non-empty strings");
        }
    }

    private boolean allValid(List<String> values) {
        return values.stream().allMatch(value -> value != null && !value.trim().isEmpty());
    }

    private AiRecommendationResponse fallbackRecommendations() {
        AiRecommendationResponse response = new AiRecommendationResponse();
        response.setSongs(FALLBACK_SONGS);
        response.setSearchKeywords(FALLBACK_SEARCH_KEYWORDS);
        return response;
    }

    private Mono<List<String>> searchVideoIds(List<String> queries) {
        return youTubeService.searchVideos(queries)
                .collectList()
                .map(this::ensureFourVideoIds)
                .onErrorResume(error -> {
                    List<String> fallbackQueries = new ArrayList<>();
                    fallbackQueries.addAll(FALLBACK_SONGS);
                    fallbackQueries.addAll(FALLBACK_SEARCH_KEYWORDS);
                    return youTubeService.searchVideos(fallbackQueries)
                            .collectList()
                            .map(this::ensureFourVideoIds)
                            .onErrorReturn(ensureFourVideoIds(List.of()));
                });
    }

    private List<String> ensureFourVideoIds(List<String> videoIds) {
        List<String> safeVideoIds = new ArrayList<>();
        if (videoIds != null) {
            safeVideoIds.addAll(videoIds);
        }

        while (safeVideoIds.size() < 4) {
            safeVideoIds.add("");
        }

        return safeVideoIds.subList(0, 4);
    }
}
