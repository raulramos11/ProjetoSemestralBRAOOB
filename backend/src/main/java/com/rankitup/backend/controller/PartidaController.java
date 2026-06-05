package com.rankitup.backend.controller;

import com.rankitup.backend.dto.ResultadoPartidaDTO;
import com.rankitup.backend.model.Inscricao;
import com.rankitup.backend.model.Partida;
import com.rankitup.backend.model.enums.StatusInscricao;
import com.rankitup.backend.repository.InscricaoRepository;
import com.rankitup.backend.repository.PartidaRepository;
import com.rankitup.backend.service.RankingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
        Partida partidaSalva = partidaRepository.save(novaPartida);
        return ResponseEntity.ok(partidaSalva);
    }

    // Endpoint principal desta correção.
    // Recebe os dois jogadores e o resultado, processa o Elo de ambos
    // na mesma transação — nenhum rating fica inconsistente.
    @Transactional
    @PostMapping("/{id}/resultado")
    public ResponseEntity<?> registrarResultado(
            @PathVariable Long id,
            @RequestBody ResultadoPartidaDTO dto) {

        // Valida que a partida existe
        partidaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Partida não encontrada."));

        // Busca as duas inscrições
        Inscricao inscricaoA = inscricaoRepository.findById(dto.idInscricaoA())
                .orElseThrow(() -> new RuntimeException("Inscrição do jogador A não encontrada."));

        Inscricao inscricaoB = inscricaoRepository.findById(dto.idInscricaoB())
                .orElseThrow(() -> new RuntimeException("Inscrição do jogador B não encontrada."));

        // RGN-05: jogador não pode enfrentar a si mesmo
        if (dto.idInscricaoA().equals(dto.idInscricaoB())) {
            return ResponseEntity.badRequest().body("Um jogador não pode enfrentar a si mesmo.");
        }

        // RGN-04: só jogadores com inscrição APROVADA podem participar de partidas
        if (inscricaoA.getStatus() != StatusInscricao.APROVADO) {
            return ResponseEntity.badRequest().body("Jogador A não tem inscrição aprovada neste torneio.");
        }
        if (inscricaoB.getStatus() != StatusInscricao.APROVADO) {
            return ResponseEntity.badRequest().body("Jogador B não tem inscrição aprovada neste torneio.");
        }

        // Processa o Elo dos dois com ratings reais — problema 3 e 4 resolvidos
        rankingService.processarDuelo(inscricaoA, inscricaoB, dto.resultadoA());

        // Salva os dois na mesma transação
        inscricaoRepository.saveAll(List.of(inscricaoA, inscricaoB));

        return ResponseEntity.ok("Resultado registrado e rankings atualizados.");
    }
}