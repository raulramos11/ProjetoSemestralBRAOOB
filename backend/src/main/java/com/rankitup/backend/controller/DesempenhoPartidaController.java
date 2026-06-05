package com.rankitup.backend.controller;

import com.rankitup.backend.model.DesempenhoPartida;
import com.rankitup.backend.repository.DesempenhoPartidaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/desempenhos")
@RequiredArgsConstructor
public class DesempenhoPartidaController {

    private final DesempenhoPartidaRepository desempenhoRepository;

    @GetMapping
    public List<DesempenhoPartida> listarTodos() {
        return desempenhoRepository.findAll();
    }
}