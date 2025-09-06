package kr.co.gitgardner.graphql;

import kr.co.gitgardner.entity.User;
import kr.co.gitgardner.service.UserService;
import kr.co.gitgardner.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;

@Controller
public class UserGraphQL {

    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtUtil jwtUtil;

    @QueryMapping
    public UserInfo user() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        
        String username = authentication.getName();
        User user = userService.findByLogin(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
        
        return new UserInfo(
                user.getGithubId(),
                user.getName(),
                user.getLogin(),
                user.getAvatarUrl(),
                user.getEmail()
        );
    }

    public record UserInfo(Long id, String name, String login, String avatarUrl, String email) {}
}
