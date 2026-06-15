package com.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
public class AiChatService {

    private final List<AiChatClient> clients;
    private final String provider;

    public AiChatService(List<AiChatClient> clients,
                         @Value("${ai.provider:ollama}") String provider) {
        this.clients = clients;
        this.provider = provider;
    }

    public Mono<String> getChatResponse(String prompt) {
        AiChatClient client = clients.stream()
                .filter(candidate -> candidate.providerName().equalsIgnoreCase(provider))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Unsupported AI provider: " + provider));

        return client.getChatResponse(prompt);
    }
}
