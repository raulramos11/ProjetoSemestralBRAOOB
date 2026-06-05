package com.rankitup.backend.controller;

import com.rankitup.backend.dto.ResultadoPartidaDTO;
import com.rankitup.backend.model.Inscricao;
import com.rankitup.backend.model.Partida;
import com.rankitup.backend.model.enums.StatusInscricao;
import com.rankitup.backend.repository.InscricaoRepository;
import com.rankitup.backend.repository.PartidaRepository;
import com.rankitup.backend.service.RankingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/partidas")
@RequiredArgsConstructor
public class PartidaController {

    private final PartidaRepository partidaRepository;
    private final InscricaoRepository inscricaoRepository;
    private final RankingService rankingService;

    @GetMapping
    public List<Partida> listarTodas() {
        return partidaRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Partida> cadastrar(@RequestBody Partida novaPartida) {
        return ResponseEntity.ok(partidaRepository.save(novaPartida));
    }

    // Atualiza a fase do torneio de uma partida existente (REQ-10)
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id,
                                       @RequestBody Partida dadosAtualizados,
                                       Authentication authentication) {

        Partida partida = partidaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Partida não encontrada."));

        // RGN-07: só o criador do torneio pode editar
        String emailAdmin   = authentication.getName();
        String emailCriador = partida.getTorneio().getCriador().getEmail();
        if (!emailAdmin.equals(emailCriador)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Apenas o organizador deste torneio pode editar partidas.");
        }

        if (dadosAtualizados.getFaseTorneio() != null) {
            partida.setFaseTorneio(dadosAtualizados.getFaseTorneio());
        }

        return ResponseEntity.ok(partidaRepository.save(partida));
    }

    // Exclui uma partida e reverte o Elo dos jogadores envolvidos (REQ-10)
    @Transactional
    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluir(@PathVariable Long id,
                                     @RequestBody ResultadoPartidaDTO dto,
                                     Authentication authentication) {

        Partida partida = partidaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Partida não encontrada."));

        // RGN-07: só o criador do torneio pode excluir
        String emailAdmin   = authentication.getName();
        String emailCriador = partida.getTorneio().getCriador().getEmail();
        if (!emailAdmin.equals(emailCriador)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Apenas o organizador deste torneio pode excluir partidas.");
        }

        Inscricao inscricaoA = inscricaoRepository.findById(dto.idInscricaoA())
                .orElseThrow(() -> new IllegalArgumentException("Inscrição A não encontrada."));
        Inscricao inscricaoB = inscricaoRepository.findById(dto.idInscricaoB())
                .orElseThrow(() -> new IllegalArgumentException("Inscrição B não encontrada."));

        // Reprocessa o Elo invertendo o resultado — anula o efeito da partida
        rankingService.processarDuelo(inscricaoA, inscricaoB,
                rankingService.inverterResultado(dto.resultadoA()));

        inscricaoRepository.saveAll(List.of(inscricaoA, inscricaoB));
        partidaRepository.deleteById(id);

        return ResponseEntity.ok("Partida excluída e rankings revertidos.");
    }

    // Registra o resultado e atualiza o Elo de ambos na mesma transação
    @Transactional
    @PostMapping("/{id}/resultado")
    public ResponseEntity<?> registrarResultado(@PathVariable Long id,
                                                @RequestBody ResultadoPartidaDTO dto,
                                                Authentication authentication) {

        Partida partida = partidaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Partida não encontrada."));

        String emailAdmin   = authentication.getName();
        String emailCriador = partida.getTorneio().getCriador().getEmail();
        if (!emailAdmin.equals(emailCriador)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Apenas o organizador deste torneio pode registrar resultados.");
        }

        Inscricao inscricaoA = inscricaoRepository.findById(dto.idInscricaoA())
                .orElseThrow(() -> new IllegalArgumentException("Inscrição do jogador A não encontrada."));
        Inscricao inscricaoB = inscricaoRepository.findById(dto.idInscricaoB())
                .orElseThrow(() -> new IllegalArgumentException("Inscrição do jogador B não encontrada."));

        if (dto.idInscricaoA().equals(dto.idInscricaoB())) {
            return ResponseEntity.badRequest().body("Um jogador não pode enfrentar a si mesmo.");
        }

        if (inscricaoA.getStatus() != StatusInscricao.APROVADO) {
            return ResponseEntity.badRequest().body("Jogador A não tem inscrição aprovada neste torneio.");
        }
        if (inscricaoB.getStatus() != StatusInscricao.APROVADO) {
            return ResponseEntity.badRequest().body("Jogador B não tem inscrição aprovada neste torneio.");
        }

        rankingService.processarDuelo(inscricaoA, inscricaoB, dto.resultadoA());
        inscricaoRepository.saveAll(List.of(inscricaoA, inscricaoB));

        return ResponseEntity.ok("Resultado registrado e rankings atualizados.");
    }
}