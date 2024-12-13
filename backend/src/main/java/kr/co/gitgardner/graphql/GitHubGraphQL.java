package kr.co.gitgardner.graphql;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.web.reactive.function.client.WebClient;

@Controller
public class GitHubGraphQL {
    private final WebClient webClient;

    @Value("${github.api.token")
    private String gitHubApiToken;

    public GitHubGraphQL(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://api.github.com/graphql").build();
    }

    @QueryMapping
    public String getContibutionStatus(@AuthenticationPrincipal OAuth2User principal) {
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

        return webClient.post()
                .header("Authorization", "Bearer " + gitHubApiToken)
                .bodyValue("{\"query\":\"" + query.replace("\n", " ") + "\"}")
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }
}
