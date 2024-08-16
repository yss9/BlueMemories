package com.backend.service;

import com.backend.domain.SharedDiary;
import com.backend.domain.SharedDiaryApplication;
import com.backend.domain.SharedDiaryUser;
import com.backend.domain.User;
import com.backend.repository.SharedDiaryApplicationRepository;
import com.backend.repository.SharedDiaryUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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

    //초대하기
    public SharedDiaryApplication inviteSharedDiary(String senderId, String receiverId, Long sharedDiaryId){
        User sender = userService.findByUserId(senderId);
        User receiver = userService.findByUserId(receiverId);
        SharedDiary sharedDiary = sharedDiaryService.getSharedDiaryById(sharedDiaryId);

        SharedDiaryApplication application = new SharedDiaryApplication();
        application.setSharedDiary(sharedDiary);
        application.setReceiver(receiver);
        application.setSender(sender);
        applicationRepository.save(application);
        return application;
    }

    //받은 신청 목록 확인
    public List<SharedDiaryApplication> getReceivedApplications(String receiverId){
        User user = userService.findByUserId(receiverId);
        return applicationRepository.findAllByReceiver(user);
    }

    //보낸 신청 목록 확인
    public List<SharedDiaryApplication> getSentApplications(String senderId){
        User user = userService.findByUserId(senderId);
        return applicationRepository.findAllBySender(user);
    }

    //수락하기
    public SharedDiaryUser acceptSharedDiaryRequest(Long id, String userId){
        Optional<SharedDiaryApplication> application = applicationRepository.findById(id);
        User user = userService.findByUserId(userId);
        SharedDiary sharedDiary = application.get().getSharedDiary();
        SharedDiaryUser sharedDiaryUser = new SharedDiaryUser();
        sharedDiaryUser.setUser(user);
        sharedDiaryUser.setSharedDiary(sharedDiary);
        applicationRepository.delete(application.get());
        return sharedDiaryUserRepository.save(sharedDiaryUser);
    }

    //거절하기
    public void refuseSharedDiaryRequest(Long id){
        Optional<SharedDiaryApplication> application = applicationRepository.findById(id);
        applicationRepository.delete(application.get());
    }

    //취소하기
    public void cancelSharedDiaryRequest(Long id){
        Optional<SharedDiaryApplication> application = applicationRepository.findById(id);
        applicationRepository.delete(application.get());
    }


}
