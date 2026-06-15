package com.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class AiRecommendationResponse {
    private List<String> songs = new ArrayList<>();
    private List<String> searchKeywords = new ArrayList<>();
}
