package com.backend.domain;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Set;

@Getter
@Setter
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String userId;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true)
    private String nickname;

    @OneToMany(mappedBy = "user")
    private Set<SharedDiaryUser> sharedDiaryUsers;

    @OneToMany(mappedBy = "user")
    private Set<SharedDiaryContent> sharedDiaryContents;

    @OneToMany(mappedBy = "user")
    private Set<Comment> comments;

    @OneToMany(mappedBy = "user")
    private Set<SharedDiary> sharedDiaries;

    @OneToMany(mappedBy = "user")
    private Set<UserLikes> userLikes;


}
