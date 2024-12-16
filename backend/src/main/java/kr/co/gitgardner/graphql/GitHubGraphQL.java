package kr.co.gitgardner.graphql;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

@Controller
public class GitHubGraphQL {
    private final WebClient webClient;

    @Value("${github.api.token}")
    private String gitHubApiToken;

    public GitHubGraphQL(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://api.github.com/graphql").build();
    }

    @QueryMapping
    public ContributionStatus getContributionStatus(@AuthenticationPrincipal OAuth2User principal) {
        String githubLogin = principal.getAttribute("login");

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
                .header("Authorization", "Bearer " + gitHubApiToken)
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
    public boolean hasCommitToday(@AuthenticationPrincipal OAuth2User principal) {
        ContributionStatus status = getContributionStatus(principal);
        LocalDate today = LocalDate.now();
        return status.days().stream().anyMatch(day -> day.date().equals(today.toString()) && day.contributionCount() > 0);
    }
}