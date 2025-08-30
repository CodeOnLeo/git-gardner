package kr.co.gitgardner.graphql;

import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;

@Controller
public class UserGraphQL {

    @QueryMapping
    public UserInfo user(@AuthenticationPrincipal OAuth2User principal) {
        return new UserInfo(
                principal.getAttribute("id"),
                principal.getAttribute("name"),
                principal.getAttribute("login"),
                principal.getAttribute("avatar_url"),
                principal.getAttribute("email")
        );
    }

    public record UserInfo(Long id, String name, String login, String avatarUrl, String email) {}
}
