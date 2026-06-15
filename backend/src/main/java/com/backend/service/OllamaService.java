package com.backend.service;

import com.backend.dto.OllamaRequest;
import com.backend.dto.OllamaResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
public class OllamaService implements AiChatClient {

    private final WebClient webClient;

    @Value("${ollama.model:qwen2.5:14b}")
    private String model;

    public OllamaService(WebClient.Builder webClientBuilder,
                         @Value("${ollama.base-url:http://localhost:11434}") String baseUrl) {
        this.webClient = webClientBuilder.baseUrl(baseUrl).build();
    }

    @Override
    public String providerName() {
        return "ollama";
    }

    @Override
    public Mono<String> getChatResponse(String prompt) {
        OllamaRequest request = new OllamaRequest(
                model,
                List.of(new OllamaRequest.Message("user", prompt)),
                false
        );

        return webClient.post()
                .uri("/api/chat")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(OllamaResponse.class)
                .map(response -> response.getMessage().getContent());
    }
}
