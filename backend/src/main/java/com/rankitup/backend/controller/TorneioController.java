package com.rankitup.backend.controller;

import com.rankitup.backend.model.Torneio;
import com.rankitup.backend.repository.TorneioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/torneios")
public class TorneioController {

    @Autowired
    private TorneioRepository torneioRepository;

    // Endpoint para buscar todos os torneios
    @GetMapping
    public List<Torneio> listarTodos() {
        return torneioRepository.findAll();
    }

    // Endpoint para criar um novo torneio
    @PostMapping
    public ResponseEntity<Torneio> cadastrar(@RequestBody Torneio novoTorneio) {
        Torneio torneioSalvo = torneioRepository.save(novoTorneio);
        return ResponseEntity.ok(torneioSalvo);
    }
}