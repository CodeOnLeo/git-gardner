package kr.co.gitgardner.service;

import kr.co.gitgardner.entity.User;
import kr.co.gitgardner.repository.UserRepository;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public User saveOrUpdateUser(OAuth2User oAuth2User, OAuth2AuthorizedClient authorizedClient) {
        Long githubId = oAuth2User.getAttribute("id");
        String name = oAuth2User.getAttribute("name");
        String login = oAuth2User.getAttribute("login");
        String email = oAuth2User.getAttribute("email");
        String avatarUrl = oAuth2User.getAttribute("avatar_url");
        String accessToken = authorizedClient.getAccessToken().getTokenValue();

        Optional<User> existingUser = userRepository.findById(githubId);
        
        if (existingUser.isPresent()) {
            User user = existingUser.get();
            user.setName(name);
            user.setEmail(email);
            user.setAvatarUrl(avatarUrl);
            user.updateAccessToken(accessToken);
            user.updateLastLogin();
            return userRepository.save(user);
        } else {
            User newUser = new User(githubId, name, login, email, avatarUrl, accessToken);
            return userRepository.save(newUser);
        }
    }

    public List<User> getAllUsersWithEmail() {
        return userRepository.findAllByEmailIsNotNull();
    }

    public Optional<User> findByLogin(String login) {
        return userRepository.findByLogin(login);
    }
}