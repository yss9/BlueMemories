package com.backend.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class SharedDiaryApplicationList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "shared_diary_id")
    private SharedDiary sharedDiary;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
