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

@RestController
public class AuthenticationController {

    @Autowired
    private JwtUtil jwtUtil;

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
        return null;
    }
}
