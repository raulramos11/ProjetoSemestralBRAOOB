package com.rankitup.backend.controller;

import com.rankitup.backend.model.Equipe;
import com.rankitup.backend.repository.EquipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/equipes")
public class EquipeController {

    @Autowired
    private EquipeRepository equipeRepository;

    @GetMapping
    public List<Equipe> listarTodas() {
        return equipeRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Equipe> cadastrar(@RequestBody Equipe novaEquipe) {
        Equipe equipeSalva = equipeRepository.save(novaEquipe);
        return ResponseEntity.ok(equipeSalva);
    }
}