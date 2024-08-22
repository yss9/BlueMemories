package com.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApplicationDto {
    private Long id;
    private String senderId;
    private String senderName;
    private String receiverId;
    private String receiverName;
    private Long sharedDiaryId;
    private String sharedDiaryTitle;
    private String message;
}