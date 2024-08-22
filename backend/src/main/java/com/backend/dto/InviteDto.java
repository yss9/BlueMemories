package com.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InviteDto {

    private String receiverId;
    private Long sharedDiaryId;
    private String inviteMessage;
}
