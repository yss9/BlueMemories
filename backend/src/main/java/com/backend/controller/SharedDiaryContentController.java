package com.backend.controller;

import com.backend.domain.SharedDiaryContent;
import com.backend.dto.ApplicationDto;
import com.backend.dto.SharedDiaryContentRequest;
import com.backend.service.SharedDiaryContentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/shared-diary-content")
public class SharedDiaryContentController {

    @Autowired
    private SharedDiaryContentService sharedDiaryContentService;

    // 공유 일기장 컨텐츠 생성
    @PostMapping("/create")
    public SharedDiaryContent createSharedDiaryContent(
            @RequestPart("data") SharedDiaryContentRequest request,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return sharedDiaryContentService.createSharedDiaryContent(request, userId, imageFile);
    }

    // 공유 일기장 ID로 모든 컨텐츠 조회
    @GetMapping("/{id}")
    public List<SharedDiaryContentRequest> getSharedDiaryContentsBySharedDiaryId(@PathVariable Long id) {
        return sharedDiaryContentService.getSharedDiaryContentsBySharedDiaryId(id);
    }

    // 공유 일기장 컨텐츠 오름차순 조회
    @GetMapping("/{sharedDiaryId}/asc")
    public List<SharedDiaryContentRequest> getSharedDiaryContentsOrderByAsc(@PathVariable Long sharedDiaryId) {
        return sharedDiaryContentService.getSharedDiaryContentsOrderByAsc(sharedDiaryId);
    }

    // 공유 일기장 컨텐츠 내림차순 조회
    @GetMapping("/{sharedDiaryId}/desc")
    public List<SharedDiaryContentRequest> getSharedDiaryContentsOrderByDesc(@PathVariable Long sharedDiaryId) {
        return sharedDiaryContentService.getSharedDiaryContentsOrderByDesc(sharedDiaryId);
    }

    // 제목으로 컨텐츠 검색
    @GetMapping("/search/title")
    public List<SharedDiaryContentRequest> searchContentsByTitle(@RequestParam String title) {
        return sharedDiaryContentService.searchContentsByTitle(title);
    }

    // 본문 내용으로 컨텐츠 검색
    @GetMapping("/search/content")
    public List<SharedDiaryContentRequest> searchContentsByContent(@RequestParam String content) {
        return sharedDiaryContentService.searchContentsByContent(content);
    }

    // 닉네임으로 컨텐츠 검색
    @GetMapping("/search/nickname")
    public List<SharedDiaryContentRequest> searchContentsByNickname(@RequestParam String nickname) {
        return sharedDiaryContentService.searchContentsByNickname(nickname);
    }

    @GetMapping("/get-content/{id}")
    public SharedDiaryContentRequest getContentById(@PathVariable Long id){
        return sharedDiaryContentService.getSharedDiaryContentById(id);
    }
}