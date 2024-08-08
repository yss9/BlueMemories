package com.backend.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 200)
    private String content;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "diary_id", nullable = true)
    private Diary diary;

    @ManyToOne
    @JoinColumn(name = "shared_diary_content_id", nullable = true)
    private SharedDiaryContent sharedDiaryContent;

}