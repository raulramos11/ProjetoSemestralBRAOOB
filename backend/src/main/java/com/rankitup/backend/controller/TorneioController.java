package com.rankitup.backend.controller;

import com.rankitup.backend.model.Administrador;
import com.rankitup.backend.model.Torneio;
import com.rankitup.backend.repository.AdministradorRepository;
import com.rankitup.backend.repository.TorneioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/torneios")
@RequiredArgsConstructor
public class TorneioController {

    private final TorneioRepository torneioRepository;
    private final AdministradorRepository administradorRepository;

    @GetMapping
    public List<Torneio> listarTodos() {
        return torneioRepository.findAll();
    }

    // Ao criar o torneio, vincula automaticamente o admin autenticado como criador
    @PostMapping
    public ResponseEntity<?> cadastrar(@RequestBody Torneio novoTorneio,
                                       Authentication authentication) {

        // Pega o email do admin logado direto do token JWT
        String emailAdmin = authentication.getName();

        Administrador criador = administradorRepository.findByEmail(emailAdmin)
                .orElseThrow(() -> new RuntimeException("Administrador não encontrado."));

        novoTorneio.setCriador(criador);
        return ResponseEntity.ok(torneioRepository.save(novoTorneio));
    }
}