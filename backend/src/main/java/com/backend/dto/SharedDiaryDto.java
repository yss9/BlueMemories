package com.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SharedDiaryDto {

    private Long id;
    private String title;
    private String coverImageUrl;
    private String createdAt;


}
