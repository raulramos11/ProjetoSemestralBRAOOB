package com.rankitup.backend.controller;

import com.rankitup.backend.model.Inscricao;
import com.rankitup.backend.model.enums.StatusInscricao;
import com.rankitup.backend.repository.InscricaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inscricoes")
@RequiredArgsConstructor
public class InscricaoController {

    private final InscricaoRepository inscricaoRepository;

    // Lista todas as inscrições — serve como tabela de ranking
    @GetMapping
    public List<Inscricao> listarTodas() {
        return inscricaoRepository.findAll();
    }

    // Lista inscrições de um torneio filtradas por status
    // GET /api/inscricoes/torneio/1?status=PENDENTE
    @GetMapping("/torneio/{idTorneio}")
    public List<Inscricao> listarPorTorneioEStatus(
            @PathVariable Long idTorneio,
            @RequestParam(defaultValue = "APROVADO") StatusInscricao status) {
        return inscricaoRepository.findByTorneio_IdTorneioAndStatus(idTorneio, status);
    }

    // Jogador solicita inscrição — começa como PENDENTE automaticamente (RGN-04)
    @PostMapping
    public ResponseEntity<Inscricao> inscrever(@RequestBody Inscricao novaInscricao) {
        novaInscricao.setStatus(StatusInscricao.PENDENTE);
        return ResponseEntity.ok(inscricaoRepository.save(novaInscricao));
    }

    // Admin aprova ou rejeita uma inscrição
    // PATCH /api/inscricoes/1/status?status=APROVADO
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> atualizarStatus(
            @PathVariable Long id,
            @RequestParam StatusInscricao status) {

        Inscricao inscricao = inscricaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inscrição não encontrada."));

        inscricao.setStatus(status);
        return ResponseEntity.ok(inscricaoRepository.save(inscricao));
    }
}