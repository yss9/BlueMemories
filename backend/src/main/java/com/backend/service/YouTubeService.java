package com.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
public class YouTubeService {

    @Value("${youtube_api.key}")
    private String apiKey;

    private final WebClient webClient;

    public YouTubeService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://www.googleapis.com/youtube/v3").build();
    }

    public Flux<String> searchVideos(List<String> queries) {
        return Flux.fromIterable(queries)
                .flatMap(this::searchVideo)
                .map(this::extractVideoId)
                .filter(videoId -> videoId != null && !videoId.isEmpty());
    }

    private Mono<String> searchVideo(String query) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/search")
                        .queryParam("part", "snippet")
                        .queryParam("q", query)
                        .queryParam("type", "video")
                        .queryParam("key", apiKey)
                        .build())
                .retrieve()
                .bodyToMono(String.class);
    }

    private String extractVideoId(String response) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            JsonNode root = objectMapper.readTree(response);
            JsonNode items = root.path("items");
            if (items.isArray() && items.size() > 0) {
                JsonNode firstItem = items.get(0);
                return firstItem.path("id").path("videoId").asText();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}