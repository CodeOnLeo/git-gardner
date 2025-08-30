package kr.co.gitgardner.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {
    @Id
    private Long githubId;
    
    private String name;
    private String login;
    private String email;
    private String avatarUrl;
    private String accessToken;
    private LocalDateTime lastLogin;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    protected User() {}

    public User(Long githubId, String name, String login, String email, String avatarUrl, String accessToken) {
        this.githubId = githubId;
        this.name = name;
        this.login = login;
        this.email = email;
        this.avatarUrl = avatarUrl;
        this.accessToken = accessToken;
        this.lastLogin = LocalDateTime.now();
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public void updateLastLogin() {
        this.lastLogin = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public void updateAccessToken(String accessToken) {
        this.accessToken = accessToken;
        this.updatedAt = LocalDateTime.now();
    }

    public Long getGithubId() { return githubId; }
    public String getName() { return name; }
    public String getLogin() { return login; }
    public String getEmail() { return email; }
    public String getAvatarUrl() { return avatarUrl; }
    public String getAccessToken() { return accessToken; }
    public LocalDateTime getLastLogin() { return lastLogin; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public void setName(String name) { this.name = name; }
    public void setEmail(String email) { this.email = email; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
}