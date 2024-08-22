package com.backend.controller;

import com.backend.dto.ApplicationDto;
import com.backend.dto.InviteDto;
import com.backend.service.SharedDiaryApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/shared-diary-applications")
public class SharedDiaryApplicationController {

    @Autowired
    private SharedDiaryApplicationService sharedDiaryApplicationService;

    // 공유일기장 초대하기
    @PostMapping("/invite")
    public ApplicationDto inviteSharedDiary(@RequestBody InviteDto inviteDto) {
        String senderId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return sharedDiaryApplicationService.inviteSharedDiary(senderId, inviteDto.getReceiverId(), inviteDto.getSharedDiaryId(), inviteDto.getInviteMessage());
    }

    // 받은 신청 목록 확인
    @GetMapping("/received")
    public List<ApplicationDto> getReceivedApplications() {
        String receiverId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return sharedDiaryApplicationService.getReceivedApplications(receiverId);
    }

    // 보낸 신청 목록 확인
    @GetMapping("/sent")
    public List<ApplicationDto> getSentApplications() {
        String senderId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return sharedDiaryApplicationService.getSentApplications(senderId);
    }

    // 공유일기장 초대 수락하기
    @PostMapping("/accept/{id}")
    public ApplicationDto acceptSharedDiaryRequest(@PathVariable Long id) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return sharedDiaryApplicationService.acceptSharedDiaryRequest(id, userId);
    }

    // 공유일기장 초대 거절하기
    @DeleteMapping("/refuse/{id}")
    public void refuseSharedDiaryRequest(@PathVariable Long id) {
        sharedDiaryApplicationService.refuseSharedDiaryRequest(id);
    }

    // 공유일기장 초대 취소하기
    @DeleteMapping("/cancel/{id}")
    public void cancelSharedDiaryRequest(@PathVariable Long id) {
        sharedDiaryApplicationService.cancelSharedDiaryRequest(id);
    }
}