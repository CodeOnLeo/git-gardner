package kr.co.gitgardner.graphql;

import graphql.schema.DataFetchingEnvironment;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.stereotype.Controller;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

@Controller
public class GitHubGraphQL {
    private final WebClient webClient;
    private final OAuth2AuthorizedClientService authorizedClientService;

    public GitHubGraphQL(WebClient.Builder webClientBuilder, OAuth2AuthorizedClientService authorizedClientService) {
        this.webClient = webClientBuilder.baseUrl("https://api.github.com/graphql").build();
        this.authorizedClientService = authorizedClientService;
    }

    @QueryMapping
    public ContributionStatus getContributionStatus(DataFetchingEnvironment env) {
        OAuth2User principal = getCurrentUser();
        OAuth2AuthorizedClient authorizedClient = getCurrentAuthorizedClient();
        
        if (principal == null || authorizedClient == null) {
            return new ContributionStatus(0, Collections.emptyList());
        }
        
        String githubLogin = principal.getAttribute("login");
        String accessToken = authorizedClient.getAccessToken().getTokenValue();

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
        OAuth2User principal = getCurrentUser();
        OAuth2AuthorizedClient authorizedClient = getCurrentAuthorizedClient();
        
        if (principal == null || authorizedClient == null) {
            return false;
        }
        
        ContributionStatus status = getContributionStatus(env);
        LocalDate today = LocalDate.now();
        return status.days().stream().anyMatch(day -> day.date().equals(today.toString()) && day.contributionCount() > 0);
    }

    public boolean hasCommitTodayWithToken(OAuth2User principal, OAuth2AuthorizedClient authorizedClient) {
        try {
            String githubLogin = principal.getAttribute("login");
            String accessToken = authorizedClient.getAccessToken().getTokenValue();

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
            e.printStackTrace();
            return false;
        }
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
            e.printStackTrace();
            return false;
        }
    }
    
    private OAuth2User getCurrentUser() {
        try {
            SecurityContext context = SecurityContextHolder.getContext();
            if (context.getAuthentication() instanceof OAuth2AuthenticationToken token) {
                return token.getPrincipal();
            }
        } catch (Exception e) {
            // ignore
        }
        return null;
    }
    
    private OAuth2AuthorizedClient getCurrentAuthorizedClient() {
        try {
            SecurityContext context = SecurityContextHolder.getContext();
            if (context.getAuthentication() instanceof OAuth2AuthenticationToken token) {
                return authorizedClientService.loadAuthorizedClient(
                    token.getAuthorizedClientRegistrationId(), 
                    token.getName()
                );
            }
        } catch (Exception e) {
            // ignore
        }
        return null;
    }
}