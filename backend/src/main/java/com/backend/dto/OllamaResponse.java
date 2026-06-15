package com.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OllamaResponse {
    private Message message;

    @Getter
    @Setter
    public static class Message {
        private String role;
        private String content;
    }
}
