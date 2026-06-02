package com.rankitup.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // O asterisco duplo libera o CORS para TODAS as suas rotas (/api/...)
                .allowedOrigins("http://localhost:3000", "http://localhost:5173") // Libera as portas padrão do React e do Vite
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Permite os comandos que criamos
                .allowedHeaders("*") // Aceita qualquer cabeçalho no JSON
                .allowCredentials(true); // Super importante para quando criarmos o Login/JWT!
    }
}