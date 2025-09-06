package kr.co.gitgardner.graphql;

import graphql.schema.DataFetchingEnvironment;
import jakarta.servlet.http.HttpServletRequest;
import kr.co.gitgardner.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

@Controller
public class GitHubGraphQL {
    private static final Logger logger = LoggerFactory.getLogger(GitHubGraphQL.class);
    
    private final WebClient webClient;
    
    @Autowired
    private JwtUtil jwtUtil;

    public GitHubGraphQL(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://api.github.com/graphql").build();
    }

    @QueryMapping
    public ContributionStatus getContributionStatus(DataFetchingEnvironment env) {
        logger.info("GraphQL getContributionStatus called");
        
        UserInfo user = getCurrentUser();
        
        if (user == null) {
            logger.warn("No authenticated user found for getContributionStatus");
            return new ContributionStatus(0, Collections.emptyList());
        }
        
        logger.info("User found: {} with token: {}", user.login(), user.accessToken() != null ? "present" : "null");
        
        String githubLogin = user.login();
        String accessToken = user.accessToken();
        
        if (accessToken == null) {
            logger.error("No access token found for user: {}", githubLogin);
            return new ContributionStatus(0, Collections.emptyList());
        }

        String query = """
                    query {
                        user(login: "%s") {
                            contributionsCollection {
                                contributionCalendar {
                                    totalContributions
                                    weeks {
                                        contributionDays {
                                            date
                                            contributionCount
                                        }
                                    }
                                }
                            }
                        }
                    }
                """.formatted(githubLogin);

        GitHubResponse response = webClient.post()
                .header("Authorization", "Bearer " + accessToken)
                .header("Content-Type", "application/json")
                .bodyValue("{\"query\":\"" + query.replace("\"", "\\\"").replace("\n", " ") + "\"}")
                .retrieve()
                .bodyToMono(GitHubResponse.class)
                .block();

        if (response == null || response.data == null || response.data.user == null) {
            return new ContributionStatus(0, Collections.emptyList());
        }

        var calendar = response.data.user.contributionsCollection.contributionCalendar;

        List<ContributionDay> days = calendar.weeks.stream()
                .flatMap(week -> week.contributionDays.stream())
                .map(day -> new ContributionDay(day.date, day.contributionCount))
                .toList();

        return new ContributionStatus(calendar.totalContributions, days);
    }

    @QueryMapping
    public boolean hasCommitToday(DataFetchingEnvironment env) {
        UserInfo user = getCurrentUser();
        
        if (user == null) {
            return false;
        }
        
        ContributionStatus status = getContributionStatus(env);
        LocalDate today = LocalDate.now();
        return status.days().stream().anyMatch(day -> day.date().equals(today.toString()) && day.contributionCount() > 0);
    }


    public boolean hasCommitTodayWithAccessToken(String login, String accessToken) {
        try {
            String query = """
                        query {
                            user(login: "%s") {
                                contributionsCollection {
                                    contributionCalendar {
                                        totalContributions
                                        weeks {
                                            contributionDays {
                                                date
                                                contributionCount
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    """.formatted(login);

            GitHubResponse response = webClient.post()
                    .header("Authorization", "Bearer " + accessToken)
                    .header("Content-Type", "application/json")
                    .bodyValue("{\"query\":\"" + query.replace("\"", "\\\"").replace("\n", " ") + "\"}")
                    .retrieve()
                    .bodyToMono(GitHubResponse.class)
                    .block();

            if (response == null || response.data == null || response.data.user == null) {
                return false;
            }

            var calendar = response.data.user.contributionsCollection.contributionCalendar;
            List<ContributionDay> days = calendar.weeks.stream()
                    .flatMap(week -> week.contributionDays.stream())
                    .map(day -> new ContributionDay(day.date, day.contributionCount))
                    .toList();

            LocalDate today = LocalDate.now();
            return days.stream().anyMatch(day -> day.date().equals(today.toString()) && day.contributionCount() > 0);

        } catch (Exception e) {
            logger.error("Error in hasCommitTodayWithAccessToken: {}", e.getMessage(), e);
            return false;
        }
    }
    
    private UserInfo getCurrentUser() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            
            if (authentication == null) {
                logger.warn("No authentication context found");
                return null;
            }
            
            if (!authentication.isAuthenticated()) {
                logger.warn("Authentication not authenticated: {}", authentication.getName());
                return null;
            }
            
            String token = extractJwtToken();
            if (token == null) {
                logger.warn("JWT token not found in request");
                return null;
            }
            
            String login = jwtUtil.getUsernameFromToken(token);
            String email = jwtUtil.getEmailFromToken(token);
            Long githubId = jwtUtil.getGithubIdFromToken(token);
            String name = jwtUtil.getNameFromToken(token);
            String avatarUrl = jwtUtil.getAvatarUrlFromToken(token);
            
            String accessToken = extractAccessTokenFromCookie();
            
            logger.info("User info extracted - Login: {}, GitHub ID: {}, AccessToken: {}", 
                login, githubId, accessToken != null ? "present" : "null");
            
            return new UserInfo(githubId, name, login, avatarUrl, email, accessToken);
            
        } catch (Exception e) {
            logger.error("Error in getCurrentUser: {}", e.getMessage(), e);
            return null;
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
    
    private String extractAccessTokenFromCookie() {
        ServletRequestAttributes requestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (requestAttributes == null) {
            return null;
        }
        
        HttpServletRequest request = requestAttributes.getRequest();
        
        if (request.getCookies() != null) {
            for (jakarta.servlet.http.Cookie cookie : request.getCookies()) {
                if ("github_token".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        
        return null;
    }
    
    public record ContributionStatus(int totalContributions, List<ContributionDay> days) {}
    public record ContributionDay(String date, int contributionCount) {}
    
    public record UserInfo(Long githubId, String name, String login, String avatarUrl, String email, String accessToken) {}
    
    public record GitHubResponse(Data data) {}
    public record Data(GitHubUser user) {}
    public record GitHubUser(ContributionsCollection contributionsCollection) {}
    public record ContributionsCollection(ContributionCalendar contributionCalendar) {}
    public record ContributionCalendar(int totalContributions, List<Week> weeks) {}
    public record Week(List<Day> contributionDays) {}
    public record Day(String date, int contributionCount) {}
}