package com.backend.service;// OpenAIService.java
import com.jav.bluememories.dto.OpenAIRequest;
import com.jav.bluememories.dto.OpenAIResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
public class OpenAIService {

    private final WebClient webClient;

    @Value("${gpt_api.key}")
    private String gptKey;

    @Autowired
    public OpenAIService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://api.openai.com/v1").build();
    }

    public Mono<String> getChatResponse(String prompt) {
        OpenAIRequest request = new OpenAIRequest("gpt-3.5-turbo", List.of(new OpenAIRequest.Message("user", prompt)));

        return webClient.post()
                .uri("/chat/completions")
                .header("Authorization", "Bearer " + gptKey)
                .bodyValue(request)
                .retrieve()
                .bodyToMono(OpenAIResponse.class)
                .map(response -> response.getChoices().get(0).getMessage().getContent());
    }
}
