package kr.co.gitgardner.config;

import kr.co.gitgardner.security.JwtAuthenticationFilter;
import kr.co.gitgardner.service.UserService;
import kr.co.gitgardner.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
public class SecurityConfig {
    private static final Logger logger = LoggerFactory.getLogger(SecurityConfig.class);
    private final UserService userService;
    private final OAuth2AuthorizedClientService authorizedClientService;
    
    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;
    
    @Autowired
    private JwtUtil jwtUtil;

    public SecurityConfig(UserService userService, OAuth2AuthorizedClientService authorizedClientService) {
        this.userService = userService;
        this.authorizedClientService = authorizedClientService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // TODO: csrf 처리 필요
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/authenticated", "/auth/token", "/test-cookie", "/graphiql", "/graphql").permitAll()
                        .requestMatchers("/").permitAll()
                        .requestMatchers("/test-email").permitAll()
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .oauth2Login(oauth2 -> oauth2
                        .successHandler((request, response, authentication) -> {
                            try {
                                OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
                                String login = oAuth2User.getAttribute("login");
                                String email = oAuth2User.getAttribute("email");
                                Long githubId = oAuth2User.getAttribute("id");
                                String name = oAuth2User.getAttribute("name");
                                String avatarUrl = oAuth2User.getAttribute("avatar_url");
                                
                                logger.info("OAuth2 로그인 성공 - GitHub ID: {}, Login: {}, Name: {}, Email: {}", 
                                    githubId, login, name, email);
                                
                                OAuth2AuthorizedClient authorizedClient = 
                                    authorizedClientService.loadAuthorizedClient("github", login);
                                
                                String accessToken = null;
                                if (authorizedClient != null) {
                                    accessToken = authorizedClient.getAccessToken().getTokenValue();
                                    logger.info("OAuth2AuthorizedClient 로드 성공 - Login: {}, Token: {}", 
                                        login, accessToken.substring(0, 10) + "...");
                                } else {
                                    logger.error("OAuth2AuthorizedClient 로드 실패 - Login: {}", login);
                                }
                                
                                String token = jwtUtil.generateSecureTokenWithUserInfo(login, email != null ? email : "",
                                    githubId, name, avatarUrl);
                                logger.info("보안 JWT 토큰 생성 완료 - Login: {}, Token: {}...", login, token.substring(0, 20));
                                
                                String jwtCookieValue = String.format("jwt=%s; Path=/; Max-Age=%d; HttpOnly; Secure; SameSite=None",
                                    token, 24 * 60 * 60);
                                response.addHeader("Set-Cookie", jwtCookieValue);
                                logger.info("JWT 쿠키 설정 완료 - Login: {}", login);
                                
                                if (accessToken != null) {
                                    String accessTokenCookieValue = String.format("github_token=%s; Path=/; Max-Age=%d; HttpOnly; Secure; SameSite=None",
                                        accessToken, 24 * 60 * 60);
                                    response.addHeader("Set-Cookie", accessTokenCookieValue);
                                    logger.info("GitHub Access Token 쿠키 설정 완료 - Login: {}", login);
                                }
                                
                                response.sendRedirect("https://git-gardenr.web.app/dashboard?token=" + token);
                                logger.info("리다이렉트 완료 - Login: {}", login);
                                
                            } catch (Exception e) {
                                logger.error("OAuth2 성공 핸들러에서 예외 발생", e);
                                response.sendRedirect("https://git-gardenr.web.app/?error=oauth_handler_error");
                            }
                        })
                );
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        configuration.addAllowedOriginPattern("https://git-gardenr.web.app");
        configuration.addAllowedOriginPattern("http://localhost:3000");
        
        configuration.addAllowedMethod("GET");
        configuration.addAllowedMethod("POST");
        configuration.addAllowedMethod("PUT");
        configuration.addAllowedMethod("DELETE");
        configuration.addAllowedMethod("OPTIONS");
        
        configuration.addAllowedHeader("*");
        configuration.addExposedHeader("*");
        
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }
}
