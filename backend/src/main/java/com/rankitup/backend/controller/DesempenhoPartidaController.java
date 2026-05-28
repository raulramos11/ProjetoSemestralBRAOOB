package com.rankitup.backend.controller;

import com.rankitup.backend.model.DesempenhoPartida;
import com.rankitup.backend.model.Inscricao;
import com.rankitup.backend.repository.DesempenhoPartidaRepository;
import com.rankitup.backend.repository.InscricaoRepository;
import com.rankitup.backend.service.RankingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/desempenhos")
public class DesempenhoPartidaController {

    @Autowired
    private DesempenhoPartidaRepository desempenhoRepository;

    // 1. Injetamos o Motor do Elo
    @Autowired
    private RankingService rankingService;

    // 2. Injetamos o repositório de Inscrição para podermos salvar os novos pontos
    @Autowired
    private InscricaoRepository inscricaoRepository;

    @GetMapping
    public List<DesempenhoPartida> listarTodos() {
        return desempenhoRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<DesempenhoPartida> registrar(@RequestBody DesempenhoPartida novoDesempenho) {

        // 1. Busca a Inscrição do Jogador
        Inscricao inscricaoJogador = inscricaoRepository.findById(novoDesempenho.getInscricao().getIdInscricao())
                .orElseThrow(() -> new RuntimeException("Inscrição não encontrada!"));

        // 2. Roda a engrenagem do Elo E guarda a variação de pontos (ex: +16)
        int pontosGanhos = rankingService.processarResultadoPartida(inscricaoJogador, 0, novoDesempenho.getResultado());

        // 3. Atualiza a coluna score_individual da partida com esses pontos!
        novoDesempenho.setScoreIndividual(pontosGanhos);

        // 4. Salva tudo nas respetivas tabelas
        inscricaoRepository.save(inscricaoJogador);
        DesempenhoPartida salvo = desempenhoRepository.save(novoDesempenho);

        return ResponseEntity.ok(salvo);
    }
}