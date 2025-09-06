package kr.co.gitgardner.controller;

import jakarta.servlet.http.HttpServletRequest;
import kr.co.gitgardner.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
public class AuthenticationController {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthenticationController.class);

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/authenticated")
    public boolean isAuthenticated(HttpServletRequest request) {
        logger.info("Authentication check request from origin: {}", request.getHeader("Origin"));
        logger.info("Request headers: Authorization={}, Content-Type={}", 
                    request.getHeader("Authorization"), request.getHeader("Content-Type"));
        
        String token = extractTokenFromHeader(request);
        logger.info("Extracted token: {}", token != null ? "present" : "absent");
        
        if (token != null) {
            try {
                String username = jwtUtil.getUsernameFromToken(token);
                boolean isValid = jwtUtil.validateToken(token, username);
                logger.info("Token validation result for user {}: {}", username, isValid);
                return isValid;
            } catch (Exception e) {
                logger.error("Token validation error: {}", e.getMessage());
                return false;
            }
        }
        logger.info("No token found, returning false");
        return false;
    }

    @PostMapping("/auth/token")
    public ResponseEntity<Map<String, Object>> validateToken(@RequestParam String token) {
        Map<String, Object> response = new HashMap<>();
        try {
            String username = jwtUtil.getUsernameFromToken(token);
            String email = jwtUtil.getEmailFromToken(token);
            
            if (jwtUtil.validateToken(token, username)) {
                response.put("valid", true);
                response.put("username", username);
                response.put("email", email);
                return ResponseEntity.ok(response);
            }
        } catch (Exception e) {
            response.put("valid", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
        
        response.put("valid", false);
        return ResponseEntity.badRequest().body(response);
    }

    private String extractTokenFromHeader(HttpServletRequest request) {
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
}
