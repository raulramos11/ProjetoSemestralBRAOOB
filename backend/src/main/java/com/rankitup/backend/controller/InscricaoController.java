package com.rankitup.backend.controller;

import com.rankitup.backend.model.Inscricao;
import com.rankitup.backend.repository.InscricaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inscricoes")
public class InscricaoController {

    @Autowired
    private InscricaoRepository inscricaoRepository;

    // Endpoint para listar todas as inscrições (vai servir como nossa tabela de Ranking inicial)
    @GetMapping
    public List<Inscricao> listarTodas() {
        return inscricaoRepository.findAll();
    }

    // Endpoint para inscrever um jogador em um torneio
    @PostMapping
    public ResponseEntity<Inscricao> inscrever(@RequestBody Inscricao novaInscricao) {
        Inscricao inscricaoSalva = inscricaoRepository.save(novaInscricao);
        return ResponseEntity.ok(inscricaoSalva);
    }
}