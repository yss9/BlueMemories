package com.backend.service;

import reactor.core.publisher.Mono;

public interface AiChatClient {
    String providerName();

    Mono<String> getChatResponse(String prompt);
}
