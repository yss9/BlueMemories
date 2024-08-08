package com.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class YouTubeResponse {
    private List<Item> items;

    @Setter
    @Getter
    public static class Item {
        private Id id;
        private Snippet snippet;

    }

    @Setter
    @Getter
    public static class Id {
        private String videoId;

    }

    @Setter
    @Getter
    public static class Snippet {
        private String title;

    }
}
