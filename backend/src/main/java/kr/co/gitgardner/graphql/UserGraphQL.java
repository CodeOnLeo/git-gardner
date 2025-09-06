package kr.co.gitgardner.graphql;

import jakarta.servlet.http.HttpServletRequest;
import kr.co.gitgardner.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Controller
public class UserGraphQL {

    @Autowired
    private JwtUtil jwtUtil;

    @QueryMapping
    public UserInfo user() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        
        String token = extractJwtToken();
        if (token == null) {
            throw new RuntimeException("JWT token not found");
        }
        
        try {
            String login = jwtUtil.getUsernameFromToken(token);
            String email = jwtUtil.getEmailFromToken(token);
            Long githubId = jwtUtil.getGithubIdFromToken(token);
            String name = jwtUtil.getNameFromToken(token);
            String avatarUrl = jwtUtil.getAvatarUrlFromToken(token);
            
            return new UserInfo(
                    githubId,
                    name,
                    login,
                    avatarUrl,
                    email
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to extract user info from JWT: " + e.getMessage());
        }
    }
    
    private String extractJwtToken() {
        ServletRequestAttributes requestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (requestAttributes == null) {
            return null;
        }
        
        HttpServletRequest request = requestAttributes.getRequest();
        
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        
        if (request.getCookies() != null) {
            for (jakarta.servlet.http.Cookie cookie : request.getCookies()) {
                if ("jwt".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        
        return null;
    }

    public record UserInfo(Long id, String name, String login, String avatarUrl, String email) {}
}
