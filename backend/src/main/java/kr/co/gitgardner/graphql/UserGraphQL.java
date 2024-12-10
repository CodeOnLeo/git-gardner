package kr.co.gitgardner.graphql;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;

@Controller
public class UserGraphQL {

    public User user(@AuthenticationPrincipal OAuth2User principal) {
        return new User(
                principal.getAttribute("id"),
                principal.getAttribute("name"),
                principal.getAttribute("login"),
                principal.getAttribute("avatar_url"),
                principal.getAttribute("email")
        );
    }
}
