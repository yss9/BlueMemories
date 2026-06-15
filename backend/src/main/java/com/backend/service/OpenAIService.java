package com.backend.service;

import com.backend.dto.OpenAIRequest;
import com.backend.dto.OpenAIResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
public class OpenAIService implements AiChatClient {

    private final WebClient webClient;

    @Value("${gpt_api.key}")
    private String gptKey;

    @Value("${openai.model:gpt-4o-mini}")
    private String model;

    public OpenAIService(WebClient.Builder webClientBuilder,
                         @Value("${openai.base-url:https://api.openai.com/v1}") String baseUrl) {
        this.webClient = webClientBuilder.baseUrl(baseUrl).build();
    }

    @Override
    public String providerName() {
        return "openai";
    }

    @Override
    public Mono<String> getChatResponse(String prompt) {
        OpenAIRequest request = new OpenAIRequest(model, List.of(new OpenAIRequest.Message("user", prompt)));

        return webClient.post()
                .uri("/chat/completions")
                .header("Authorization", "Bearer " + gptKey)
                .header("Content-Type", "application/json")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(OpenAIResponse.class)
                .map(response -> response.getChoices().get(0).getMessage().getContent());
    }
}
