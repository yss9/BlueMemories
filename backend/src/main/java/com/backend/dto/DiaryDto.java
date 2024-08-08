package com.backend.dto;

import com.jav.bluememories.domain.Comment;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class DiaryDto {
    private String title;
    private String weather;
    private Boolean isPrivate;
    private String content;
    private String date;
    private String confidence;
    private Double negative;
    private Double positive;
    private Double neutral;
    private String keyword1;
    private String keyword2;
    private String keyword3;
    private String keyword4;
    private Integer likeNum;
    private List<Comment> comments;
}