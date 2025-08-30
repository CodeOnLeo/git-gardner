package kr.co.gitgardner.service;

import kr.co.gitgardner.graphql.GitHubGraphQL;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;

@Component
public class DailyCommitChecker {
    private final GitHubGraphQL gitHubGraphQL;
    private final EmailService emailService;
    private final OAuth2AuthorizedClientService authorizedClientService;

    public DailyCommitChecker(GitHubGraphQL gitHubGraphQL, EmailService emailService, 
                             OAuth2AuthorizedClientService authorizedClientService) {
        this.gitHubGraphQL = gitHubGraphQL;
        this.emailService = emailService;
        this.authorizedClientService = authorizedClientService;
    }

    @Scheduled(cron = "0 0 22 * * ?")
    public void checkAndSendEmail(){
        OAuth2User principal = (OAuth2User) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal();

        if(principal != null){
            String login = principal.getAttribute("login");
            OAuth2AuthorizedClient authorizedClient = 
                authorizedClientService.loadAuthorizedClient("github", login);
            
            if(authorizedClient != null) {
                boolean hasCommittedToday = gitHubGraphQL.hasCommitTodayWithToken(principal, authorizedClient);

                if(!hasCommittedToday){
                    try{
                        String email = principal.getAttribute("email");
                        emailService.sendMail(email, "[GitGardner] 커밋 안했어요.","오늘 커밋 안 했슴다. 하세요.");
                    }catch (Exception e){
                        e.printStackTrace();
                    }
                }
            } else {
                System.out.println("OAuth2AuthorizedClient not found for user: " + login);
            }
        }
    }
}
