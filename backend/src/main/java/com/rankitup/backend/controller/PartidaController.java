package com.rankitup.backend.controller;

import com.rankitup.backend.model.Partida;
import com.rankitup.backend.repository.PartidaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/partidas")
public class PartidaController {

    @Autowired
    private PartidaRepository partidaRepository;

    @GetMapping
    public List<Partida> listarTodas() {
        return partidaRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Partida> cadastrar(@RequestBody Partida novaPartida) {
        Partida partidaSalva = partidaRepository.save(novaPartida);
        return ResponseEntity.ok(partidaSalva);
    }
}