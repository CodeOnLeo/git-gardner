package kr.co.gitgardner.config;

import kr.co.gitgardner.security.JwtAuthenticationFilter;
import kr.co.gitgardner.service.UserService;
import kr.co.gitgardner.util.JwtUtil;
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
                            OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
                            String login = oAuth2User.getAttribute("login");
                            String email = oAuth2User.getAttribute("email");
                            
                            OAuth2AuthorizedClient authorizedClient = 
                                authorizedClientService.loadAuthorizedClient("github", login);
                            
                            if (authorizedClient != null) {
                                userService.saveOrUpdateUser(oAuth2User, authorizedClient);
                            }
                            
                            String token = jwtUtil.generateToken(login, email != null ? email : "");
                            
                            String cookieValue = String.format("jwt=%s; Path=/; Max-Age=%d; HttpOnly; Secure; SameSite=None",
                                token, 24 * 60 * 60);
                            response.addHeader("Set-Cookie", cookieValue);
                            
                            response.sendRedirect("https://git-gardenr.web.app/dashboard?token=" + token);
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
