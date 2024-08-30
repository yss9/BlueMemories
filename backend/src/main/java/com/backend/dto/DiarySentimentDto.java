package com.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class DiarySentimentDto {

    private Long id;
    private String date;
    private String sentiment;
    private String title;
    private String content;
    private Double confidencePositive;
    private Double confidenceNeutral;
    private Double confidenceNegative;
    private String imageUrl;

}
