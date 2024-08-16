package com.backend.repository;

import com.backend.domain.SharedDiary;
import com.backend.domain.SharedDiaryApplication;
import com.backend.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SharedDiaryApplicationRepository extends JpaRepository<SharedDiaryApplication, Long> {

    List<SharedDiaryApplication> findAllByReceiver(User receiver);
    List<SharedDiaryApplication> findAllBySender(User sender);

    Optional<SharedDiaryApplication> findBySharedDiary(SharedDiary sharedDiary);

}
