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
public class Diary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String weather;

    private Boolean isPrivate;

    private Integer likeNum;

    private String date;

    @Column(length = 1000)
    private String content;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "diary", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Comment> comments;

    @OneToMany(mappedBy = "diary", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<UserLikes> userLikes;

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