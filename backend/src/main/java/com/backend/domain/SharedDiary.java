package com.backend.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
public class SharedDiary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 2048)
    private String coverImageUrl;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "sharedDiary", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SharedDiaryContent> sharedDiaryContents;

    @OneToMany(mappedBy = "sharedDiary")
    private Set<SharedDiaryUser> sharedDiaryUsers;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

}