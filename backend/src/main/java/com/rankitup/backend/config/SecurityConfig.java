package com.rankitup.backend.config;

import com.rankitup.backend.security.JwtFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth

                        // Rotas públicas — qualquer um acessa sem token
                        .requestMatchers(HttpMethod.POST, "/api/usuarios/cadastro").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/usuarios/login").permitAll()
                        .requestMatchers(HttpMethod.GET,  "/api/torneios/**").permitAll()
                        .requestMatchers(HttpMethod.GET,  "/api/torneios").permitAll()
                        .requestMatchers(HttpMethod.GET,  "/api/inscricoes").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/jogos").permitAll()

                        // Rotas de admin — só ROLE_ADMIN
                        .requestMatchers("/api/partidas/**").hasAuthority("ROLE_ADMIN")
                        .requestMatchers("/api/desempenhos/**").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/torneios").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/inscricoes").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/inscricoes/*/status").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/inscricoes/torneio/**").permitAll()

                        // Qualquer outra rota exige login
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}