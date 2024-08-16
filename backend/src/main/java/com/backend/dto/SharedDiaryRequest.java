package com.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SharedDiaryRequest {

    private String title;
    private int coverImage;
    private Long userId;
}
