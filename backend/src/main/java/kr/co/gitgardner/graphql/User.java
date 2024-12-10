package kr.co.gitgardner.graphql;

public record User(
        String id,
        String name,
        String login,
        String avatarUrl,
        String email
) {}
