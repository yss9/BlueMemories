package com.backend.dto;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApplicationDto {
    private Long sender;
    private Long receiver;
    private Long sharedDiaryId;
}
