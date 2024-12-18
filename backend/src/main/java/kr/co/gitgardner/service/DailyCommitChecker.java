package kr.co.gitgardner.service;

import kr.co.gitgardner.graphql.GitHubGraphQL;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;

@Component
public class DailyCommitChecker {
    private final GitHubGraphQL gitHubGraphQL;
    private final EmailService emailService;

    public DailyCommitChecker(GitHubGraphQL gitHubGraphQL, EmailService emailService) {
        this.gitHubGraphQL = gitHubGraphQL;
        this.emailService = emailService;
    }

    @Scheduled(cron = "0 0 22 * * ?")
    public void checkAndSendEmail(){
        OAuth2User principal = (OAuth2User) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal();

        if(principal != null){
            boolean hasCommittedToday = gitHubGraphQL.hasCommitToday(principal);

            if(hasCommittedToday){
                try{
                    // TODO: 설정한 이메일로 발송하는 기능으로 변경 필요함
                    String email = principal.getAttribute("email");
                    emailService.sendMail(email, "[GitGardner] 커밋 안했어요.","오늘 커밋 안 했슴다. 하세요.");
                }catch (Exception e){
                    e.printStackTrace();
                }
            }
        }
    }
}
