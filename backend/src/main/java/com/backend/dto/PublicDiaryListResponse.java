package com.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class PublicDiaryListResponse {

    private Long id;
    private String title;
    private String sentiment;
    private LocalDateTime createdAt;
    private String nickname;
    private Long commentCount;
    private Long likeCount;
    private String thumbnailUrl;

    public PublicDiaryListResponse withThumbnailUrl(String thumbnailUrl) {
        return new PublicDiaryListResponse(
                id,
                title,
                sentiment,
                createdAt,
                nickname,
                commentCount,
                likeCount,
                thumbnailUrl
        );
    }
}
