package com.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AiSentimentResponse {
    private String sentiment;
    private double positive;
    private double neutral;
    private double negative;
}
