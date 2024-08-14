package com.backend.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@Entity
public class SharedDiaryContent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 1000)
    private String content;

    private String title;

    private String weather;

    private String date;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "shared_diary_id")
    private SharedDiary sharedDiary;

    @OneToMany(mappedBy = "sharedDiaryContent", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Comment> comments;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;


    private String sentiment;
    private Double confidenceNegative;
    private Double confidenceNeutral;
    private Double confidencePositive;

    private String keyword1;
    private String keyword2;
    private String keyword3;
    private String keyword4;

    @Column(length = 2048)
    private String imageUrl;

}
