package com.backend.service;

import com.backend.domain.SharedDiary;
import com.backend.domain.SharedDiaryApplication;
import com.backend.domain.SharedDiaryUser;
import com.backend.domain.User;
import com.backend.dto.ApplicationDto;
import com.backend.repository.SharedDiaryApplicationRepository;
import com.backend.repository.SharedDiaryUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SharedDiaryApplicationService {

    @Autowired
    private SharedDiaryApplicationRepository applicationRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private SharedDiaryService sharedDiaryService;

    @Autowired
    private SharedDiaryUserRepository sharedDiaryUserRepository;

    // 초대하기
    public ApplicationDto inviteSharedDiary(String senderId, String receiverId, Long sharedDiaryId,String inviteMessage) {
        User sender = userService.findByUserId(senderId);
        User receiver = userService.findByUserId(receiverId);
        SharedDiary sharedDiary = sharedDiaryService.getSharedDiaryById(sharedDiaryId);

        SharedDiaryApplication application = new SharedDiaryApplication();
        application.setSharedDiary(sharedDiary);
        application.setReceiver(receiver);
        application.setSender(sender);
        application.setMessage(inviteMessage);
        applicationRepository.save(application);

        return convertToDto(application);
    }

    // 받은 신청 목록 확인
    public List<ApplicationDto> getReceivedApplications(String receiverId) {
        User user = userService.findByUserId(receiverId);
        return applicationRepository.findAllByReceiver(user)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // 보낸 신청 목록 확인
    public List<ApplicationDto> getSentApplications(String senderId) {
        User user = userService.findByUserId(senderId);
        return applicationRepository.findAllBySender(user)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // 수락하기
    public ApplicationDto acceptSharedDiaryRequest(Long id, String userId) {
        Optional<SharedDiaryApplication> application = applicationRepository.findById(id);
        if (application.isEmpty()) {
            throw new RuntimeException("Application not found");
        }

        User user = userService.findByUserId(userId);
        SharedDiary sharedDiary = application.get().getSharedDiary();

        SharedDiaryUser sharedDiaryUser = new SharedDiaryUser();
        sharedDiaryUser.setUser(user);
        sharedDiaryUser.setSharedDiary(sharedDiary);
        sharedDiaryUserRepository.save(sharedDiaryUser);

        applicationRepository.delete(application.get());

        return convertToDto(application.get());
    }

    // 거절하기
    public void refuseSharedDiaryRequest(Long id) {
        Optional<SharedDiaryApplication> application = applicationRepository.findById(id);
        if (application.isEmpty()) {
            throw new RuntimeException("Application not found");
        }
        applicationRepository.delete(application.get());
    }

    // 취소하기
    public void cancelSharedDiaryRequest(Long id) {
        Optional<SharedDiaryApplication> application = applicationRepository.findById(id);
        if (application.isEmpty()) {
            throw new RuntimeException("Application not found");
        }
        applicationRepository.delete(application.get());
    }

    // SharedDiaryApplication을 ApplicationDto로 변환하는 메서드
    private ApplicationDto convertToDto(SharedDiaryApplication application) {
        ApplicationDto dto = new ApplicationDto();
        dto.setId(application.getId());
        dto.setSenderId(application.getSender().getUserId());
        dto.setSenderName(application.getSender().getNickname());
        dto.setReceiverId(application.getReceiver().getUserId());
        dto.setReceiverName(application.getReceiver().getNickname());
        dto.setSharedDiaryId(application.getSharedDiary().getId());
        dto.setSharedDiaryTitle(application.getSharedDiary().getTitle());
        dto.setMessage(application.getMessage());
        return dto;
    }
}