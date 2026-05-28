package com.rankitup.backend.controller;

import com.rankitup.backend.model.Jogador;
import com.rankitup.backend.repository.JogadorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jogadores")
public class JogadorController {

    @Autowired
    private JogadorRepository jogadorRepository;

    // Endpoint para buscar todos os jogadores cadastrados
    @GetMapping
    public List<Jogador> listarTodos() {
        return jogadorRepository.findAll();
    }

    // Endpoint para cadastrar um novo jogador
    @PostMapping
    public ResponseEntity<Jogador> cadastrar(@RequestBody Jogador novoJogador) {
        Jogador jogadorSalvo = jogadorRepository.save(novoJogador);
        return ResponseEntity.ok(jogadorSalvo);
    }
}