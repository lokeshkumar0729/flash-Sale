
package com.lokesh.flashsale.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lokesh.flashsale.dto.ApiError;
import com.lokesh.flashsale.security.DatabaseUserDetailsService;
import com.lokesh.flashsale.security.JwtAuthenticationFilter;
import com.lokesh.flashsale.security.JwtService;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http,
            JwtService jwtService,
            DatabaseUserDetailsService userDetailsService,
            @Qualifier("corsConfigurationSource")
            CorsConfigurationSource corsSource,
            ObjectMapper mapper) throws Exception {

        http
                // Disable CSRF for the stateless REST API.
                .csrf(AbstractHttpConfigurer::disable)

                // Use the explicitly selected CORS configuration.
                .cors(cors -> cors.configurationSource(corsSource))

                // Use JWT authentication without HTTP sessions.
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Configure endpoint authorization.
                .authorizeHttpRequests(auth -> auth

                        // Allow browser preflight requests.
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Allow users to register and log in.
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/auth/login",
                                "/api/auth/register"
                        ).permitAll()

                        // Allow public storefront endpoints.
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/products",
                                "/api/products/**",
                                "/api/flash-sales/live",
                                "/api/flash-sales/upcoming"
                        ).permitAll()

                        // Allow health checks.
                        .requestMatchers(
                                "/actuator/health",
                                "/actuator/health/**"
                        ).permitAll()

                        // Restrict admin endpoints to ADMIN users.
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // Require authentication for all other endpoints.
                        .anyRequest().authenticated()
                )

                // Return JSON errors for unauthorized or forbidden requests.
                .exceptionHandling(exception -> exception

                        .authenticationEntryPoint((request, response, ex) ->
                                writeError(
                                        response,
                                        mapper,
                                        401,
                                        "Unauthorized",
                                        "Authentication is required or the session has expired"
                                )
                        )

                        .accessDeniedHandler((request, response, ex) ->
                                writeError(
                                        response,
                                        mapper,
                                        403,
                                        "Forbidden",
                                        "You do not have permission to perform this action"
                                )
                        )
                )

                // Add the JWT filter before username/password authentication.
                .addFilterBefore(
                        new JwtAuthenticationFilter(jwtService, userDetailsService),
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource(
            @Value("${app.cors.allowed-origins}") String allowedOrigins) {

        CorsConfiguration config = new CorsConfiguration();

        List<String> origins = Arrays.stream(allowedOrigins.split(","))
                .map(String::trim)
                .filter(origin -> !origin.isEmpty())
                .toList();

        config.setAllowedOrigins(origins);

        config.setAllowedMethods(List.of(
                "GET",
                "POST",
                "PUT",
                "PATCH",
                "DELETE",
                "OPTIONS"
        ));

        config.setAllowedHeaders(List.of(
                "Authorization",
                "Content-Type",
                "Idempotency-Key"
        ));

        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", config);

        return source;
    }

    private static void writeError(
            jakarta.servlet.http.HttpServletResponse response,
            ObjectMapper mapper,
            int status,
            String error,
            String message) throws java.io.IOException {

        response.setStatus(status);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        mapper.writeValue(
                response.getOutputStream(),
                ApiError.of(status, error, message)
        );
    }
}

