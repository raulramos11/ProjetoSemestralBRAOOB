package com.rankitup.backend.controller;

import com.rankitup.backend.model.Jogo;
import com.rankitup.backend.repository.JogoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jogos")
@RequiredArgsConstructor
public class JogoController {

    private final JogoRepository jogoRepository;

    @GetMapping
    public List<Jogo> listarTodos() {
        return jogoRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Jogo> cadastrar(@RequestBody Jogo novoJogo) {
        return ResponseEntity.ok(jogoRepository.save(novoJogo));
    }
}