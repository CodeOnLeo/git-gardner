package kr.co.gitgardner.controller;

import kr.co.gitgardner.service.EmailService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {
    private final EmailService emailService;

    public TestController(EmailService emailService) {
        this.emailService = emailService;
    }

    @GetMapping("/test-email")
    public String testEmail(@RequestParam(defaultValue = "codeonleo@gmail.com") String to) {
        try {
            String subject = "[GitGardener] 메일 발송 테스트";
            String message = "안녕하세요!\n\n이것은 GitGardener 메일 발송 기능 테스트입니다.\n\n메일이 정상적으로 발송되었다면 시스템이 올바르게 구성된 것입니다.\n\n- GitGardener Team";
            
            emailService.sendMail(to, subject, message);
            return "메일이 성공적으로 발송되었습니다: " + to;
        } catch (Exception e) {
            return "메일 발송 실패: " + e.getMessage();
        }
    }
}