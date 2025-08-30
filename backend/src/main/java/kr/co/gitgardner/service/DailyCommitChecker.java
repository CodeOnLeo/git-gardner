package kr.co.gitgardner.service;

import kr.co.gitgardner.entity.User;
import kr.co.gitgardner.graphql.GitHubGraphQL;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DailyCommitChecker {
    private final GitHubGraphQL gitHubGraphQL;
    private final EmailService emailService;
    private final UserService userService;

    public DailyCommitChecker(GitHubGraphQL gitHubGraphQL, EmailService emailService, UserService userService) {
        this.gitHubGraphQL = gitHubGraphQL;
        this.emailService = emailService;
        this.userService = userService;
    }

    @Scheduled(cron = "0 0 22 * * ?")
    public void checkAndSendEmail(){
        List<User> users = userService.getAllUsersWithEmail();
        
        for (User user : users) {
            try {
                boolean hasCommittedToday = gitHubGraphQL.hasCommitTodayWithAccessToken(user.getLogin(), user.getAccessToken());
                
                if (!hasCommittedToday && user.getEmail() != null && !user.getEmail().trim().isEmpty()) {
                    String subject = "[GitGardner] 커밋 안했어요.";
                    String message = String.format("안녕하세요 %s님,\n\n오늘 커밋을 안 하셨네요. 꾸준히 커밋해서 잔디를 심어보세요! 🌱\n\n- GitGardner", 
                                                  user.getName() != null ? user.getName() : user.getLogin());
                    
                    emailService.sendMail(user.getEmail(), subject, message);
                    System.out.println("Email sent to: " + user.getEmail());
                } else if (hasCommittedToday) {
                    System.out.println("User " + user.getLogin() + " has committed today. No email sent.");
                } else {
                    System.out.println("User " + user.getLogin() + " has no valid email address.");
                }
            } catch (Exception e) {
                System.err.println("Failed to process user " + user.getLogin() + ": " + e.getMessage());
                e.printStackTrace();
            }
        }
    }
}
