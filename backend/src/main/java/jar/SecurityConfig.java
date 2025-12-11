package jar;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration; // New Import
import org.springframework.web.cors.UrlBasedCorsConfigurationSource; // New Import
import org.springframework.web.filter.CorsFilter; // New Import
import java.util.Arrays; // New Import

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // 1. Password Encoder Bean (Existing)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 2. NEW BEAN: Centralized CORS Configuration
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        // CRITICAL: Configure the allowed origins, methods, and headers
        config.setAllowCredentials(true);
        config.setAllowedOriginPatterns(Arrays.asList("http://localhost:3000")); // Use setAllowedOriginPatterns for
                                                                                 // consistency
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }

    // 3. Security Filter Chain Configuration
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 3a. Add the CorsFilter to the chain
                .cors(cors -> cors.disable()) // Disable the default CorsFilter bean discovery
                .addFilterBefore(corsFilter(),
                        org.springframework.security.web.access.channel.ChannelProcessingFilter.class) // Add our custom
                                                                                                       // CorsFilter
                                                                                                       // early

                // 3b. Existing Security Configuration
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/users", // POST for Registration
                                "/api/users/login", // POST for Login
                                "/api/messages", // POST for contact form (on landing page)
                                "/api/content/search", // GET content list (needed for Workouts, Recipes, Tips listing)
                                "/api/plans")
                        .permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
                        .anyRequest().authenticated());

        return http.build();
    }
}