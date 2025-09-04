package kr.co.gitgardner.config;

import kr.co.gitgardner.service.UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
public class SecurityConfig {
    private final UserService userService;
    private final OAuth2AuthorizedClientService authorizedClientService;

    public SecurityConfig(UserService userService, OAuth2AuthorizedClientService authorizedClientService) {
        this.userService = userService;
        this.authorizedClientService = authorizedClientService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // TODO: csrf 처리 필요
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
                .securityContext(securityContext -> securityContext.requireExplicitSave(false))
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/authenticated","/graphiql","graphql").permitAll()
                        .requestMatchers("/").permitAll()
                        .requestMatchers("/test-email").permitAll()
                        .anyRequest().authenticated())
                .oauth2Login(oauth2 -> oauth2
                        .successHandler((request, response, authentication) -> {
                            System.out.println("=== OAuth 로그인 성공 ===");
                            System.out.println("세션 ID: " + request.getSession().getId());
                            System.out.println("User-Agent: " + request.getHeader("User-Agent"));
                            
                            OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
                            String login = oAuth2User.getAttribute("login");
                            System.out.println("GitHub 로그인: " + login);
                            
                            OAuth2AuthorizedClient authorizedClient = 
                                authorizedClientService.loadAuthorizedClient("github", login);
                            
                            if (authorizedClient != null) {
                                userService.saveOrUpdateUser(oAuth2User, authorizedClient);
                                System.out.println("사용자 저장 완료");
                            }
                            
                            System.out.println("대시보드로 리다이렉트 시작");
                            response.sendRedirect("https://git-gardenr.web.app/dashboard");
                        })
                )
                .logout(logout -> logout
                        .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
                        .logoutSuccessUrl("https://git-gardenr.web.app")
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID"));
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
