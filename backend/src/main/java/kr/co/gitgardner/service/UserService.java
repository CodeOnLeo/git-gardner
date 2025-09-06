package kr.co.gitgardner.service;

import kr.co.gitgardner.entity.User;
import kr.co.gitgardner.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    
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

        logger.info("사용자 저장/업데이트 시작 - GitHub ID: {}, Login: {}, Name: {}, Email: {}", 
            githubId, login, name, email);

        try {
            Optional<User> existingUser = userRepository.findById(githubId);
            
            if (existingUser.isPresent()) {
                logger.info("기존 사용자 업데이트 - GitHub ID: {}, Login: {}", githubId, login);
                User user = existingUser.get();
                user.setName(name);
                user.setEmail(email);
                user.setAvatarUrl(avatarUrl);
                user.updateAccessToken(accessToken);
                user.updateLastLogin();
                
                User savedUser = userRepository.save(user);
                logger.info("기존 사용자 업데이트 완료 - GitHub ID: {}, Login: {}", githubId, login);
                return savedUser;
            } else {
                logger.info("새 사용자 생성 - GitHub ID: {}, Login: {}", githubId, login);
                User newUser = new User(githubId, name, login, email, avatarUrl, accessToken);
                
                User savedUser = userRepository.save(newUser);
                logger.info("새 사용자 생성 완료 - GitHub ID: {}, Login: {}", githubId, login);
                return savedUser;
            }
        } catch (Exception e) {
            logger.error("사용자 저장/업데이트 실패 - GitHub ID: {}, Login: {}, Error: {}", 
                githubId, login, e.getMessage(), e);
            throw e;
        }
    }

    public List<User> getAllUsersWithEmail() {
        return userRepository.findAllByEmailIsNotNull();
    }

    public Optional<User> findByLogin(String login) {
        logger.debug("사용자 조회 시작 - Login: {}", login);
        Optional<User> user = userRepository.findByLogin(login);
        
        if (user.isPresent()) {
            logger.debug("사용자 조회 성공 - Login: {}, GitHub ID: {}", login, user.get().getGithubId());
        } else {
            logger.warn("사용자 조회 실패 - Login: {} 사용자를 찾을 수 없음", login);
        }
        
        return user;
    }
}