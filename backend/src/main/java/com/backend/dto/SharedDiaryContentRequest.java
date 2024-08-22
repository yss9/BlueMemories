package com.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SharedDiaryContentRequest {
    private String content;
    private String title;
    private String weather;
    private String date;
    private String sentiment;
    private String nickname;
    private Double confidenceNegative;
    private Double confidenceNeutral;
    private Double confidencePositive;
    private String keyword1;
    private String keyword2;
    private String keyword3;
    private String keyword4;
    private String imageUrl;
    private Long sharedDiaryId;
}