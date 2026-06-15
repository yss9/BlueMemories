package com.backend.service;

import com.backend.dto.AiSentimentResponse;
import com.backend.dto.SentimentResult;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class SentimentAnalysisService {

    private static final int MAX_ATTEMPTS = 2;

    private final AiChatService aiChatService;
    private final ObjectMapper objectMapper;

    public SentimentAnalysisService(AiChatService aiChatService, ObjectMapper objectMapper) {
        this.aiChatService = aiChatService;
        this.objectMapper = objectMapper;
    }

    public Mono<SentimentResult> analyzeSentiment(String content) {
        return Mono.fromCallable(() -> analyzeWithRetry(content));
    }

    private SentimentResult analyzeWithRetry(String content) {
        String prompt = buildPrompt(content);

        for (int attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
            try {
                String response = aiChatService.getChatResponse(prompt).block();
                AiSentimentResponse sentiment = parseSentiment(response);
                validate(sentiment);
                return toSentimentResult(sentiment);
            } catch (Exception ignored) {
                prompt = buildRetryPrompt(content);
            }
        }

        return fallback();
    }

    private String buildPrompt(String content) {
        return """
                Analyze this diary sentiment.
                Return JSON only. No markdown. No explanation.
                Required schema:
                {"sentiment":"positive|neutral|negative","positive":0,"neutral":0,"negative":0}
                Rules:
                - positive, neutral, negative must be numbers from 0 to 100.
                - positive + neutral + negative must equal 100.
                - sentiment must be the key with the highest score.
                Diary:
                %s
                """.formatted(content);
    }

    private String buildRetryPrompt(String content) {
        return """
                Your previous response was invalid.
                Return valid JSON only. No markdown. No explanation.
                Schema:
                {"sentiment":"positive|neutral|negative","positive":0,"neutral":0,"negative":0}
                The three scores must add up to exactly 100.
                Diary:
                %s
                """.formatted(content);
    }

    private AiSentimentResponse parseSentiment(String response) throws Exception {
        JsonNode node = objectMapper.readTree(response);
        return objectMapper.treeToValue(node, AiSentimentResponse.class);
    }

    private void validate(AiSentimentResponse response) {
        if (response.getSentiment() == null) {
            throw new IllegalArgumentException("Sentiment is required");
        }

        String sentiment = response.getSentiment();
        if (!sentiment.equals("positive") && !sentiment.equals("neutral") && !sentiment.equals("negative")) {
            throw new IllegalArgumentException("Invalid sentiment: " + sentiment);
        }

        double positive = response.getPositive();
        double neutral = response.getNeutral();
        double negative = response.getNegative();

        if (!isValidScore(positive) || !isValidScore(neutral) || !isValidScore(negative)) {
            throw new IllegalArgumentException("Scores must be between 0 and 100");
        }

        int total = (int) Math.round(positive + neutral + negative);
        if (total != 100) {
            throw new IllegalArgumentException("Scores must add up to 100");
        }

        double max = Math.max(positive, Math.max(neutral, negative));
        if ((sentiment.equals("positive") && positive != max)
                || (sentiment.equals("neutral") && neutral != max)
                || (sentiment.equals("negative") && negative != max)) {
            throw new IllegalArgumentException("Sentiment must match highest score");
        }
    }

    private boolean isValidScore(double score) {
        return score >= 0 && score <= 100;
    }

    private SentimentResult toSentimentResult(AiSentimentResponse response) {
        SentimentResult result = new SentimentResult();
        SentimentResult.Document document = new SentimentResult.Document();
        SentimentResult.Confidence confidence = new SentimentResult.Confidence();

        confidence.setPositive(response.getPositive());
        confidence.setNeutral(response.getNeutral());
        confidence.setNegative(response.getNegative());
        document.setSentiment(response.getSentiment());
        document.setConfidence(confidence);
        result.setDocument(document);

        return result;
    }

    private SentimentResult fallback() {
        AiSentimentResponse response = new AiSentimentResponse();
        response.setSentiment("neutral");
        response.setPositive(20);
        response.setNeutral(60);
        response.setNegative(20);
        return toSentimentResult(response);
    }
}
