package kr.co.gitgardner.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;

@RestController
public class AuthenticationController {

    @GetMapping("/authenticated")
    public boolean isAuthenticated(HttpSession session, HttpServletRequest request) {
        System.out.println("=== /authenticated 요청 ===");
        System.out.println("세션 ID: " + (session != null ? session.getId() : "null"));
        System.out.println("User-Agent: " + request.getHeader("User-Agent"));
        System.out.println("Cookie 헤더: " + request.getHeader("Cookie"));
        
        if (session != null) {
            System.out.println("세션 속성들: " + Collections.list(session.getAttributeNames()));
            Object securityContext = session.getAttribute("SPRING_SECURITY_CONTEXT");
            System.out.println("Security Context 존재: " + (securityContext != null));
            if (securityContext != null) {
                System.out.println("Security Context 타입: " + securityContext.getClass().getSimpleName());
            }
            return securityContext != null;
        }

        System.out.println("세션이 null입니다");
        return false;
    }
}
