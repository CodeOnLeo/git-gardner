package kr.co.gitgardner.controller;

import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthenticationController {

    @GetMapping("/authenticated")
    public boolean isAuthenticated(HttpSession session) {
        if (session != null) {
            Object securityContext = session.getAttribute("SPRING_SECURITY_CONTEXT");
            return securityContext != null;
        }

        return false;
    }
}
