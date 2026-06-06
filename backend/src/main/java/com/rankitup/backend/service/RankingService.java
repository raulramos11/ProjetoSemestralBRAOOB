package com.rankitup.backend.service;

import com.rankitup.backend.model.Inscricao;
import com.rankitup.backend.model.enums.Resultado;
import org.springframework.stereotype.Service;

@Service
public class RankingService {

    // Problema 11 — fator K dinâmico
    // Iniciantes (< 10 partidas): K=40 — mais volatilidade, sobem/descem rápido
    // Intermediários (10-30 partidas): K=32 — volatilidade média
    // Experientes (> 30 partidas): K=20 — mais estabilidade
    private int calcularFatorK(int totalVitorias) {
        if (totalVitorias < 10) return 40;
        if (totalVitorias < 30) return 32;
        return 20;
    }

    private double calcularProbabilidadeVitoria(int ratingA, int ratingB) {
        return 1.0 / (1.0 + Math.pow(10.0, (ratingB - ratingA) / 400.0));
    }

    public void processarDuelo(Inscricao inscricaoA, Inscricao inscricaoB, Resultado resultadoA) {

        int ratingA = inscricaoA.getPontosAcumulados();
        int ratingB = inscricaoB.getPontosAcumulados();

        // Fator K individual para cada jogador
        int kA = calcularFatorK(inscricaoA.getVitoriasTotais());
        int kB = calcularFatorK(inscricaoB.getVitoriasTotais());

        double expectativaA = calcularProbabilidadeVitoria(ratingA, ratingB);
        double expectativaB = calcularProbabilidadeVitoria(ratingB, ratingA);

        double placarA = converterResultadoParaPlacar(resultadoA);
        double placarB = converterResultadoParaPlacar(inverterResultado(resultadoA));

        int variacaoA = (int) Math.round(kA * (placarA - expectativaA));
        int variacaoB = (int) Math.round(kB * (placarB - expectativaB));

        inscricaoA.setPontosAcumulados(Math.max(0, ratingA + variacaoA));
        if (resultadoA == Resultado.VITORIA) {
            inscricaoA.setVitoriasTotais(inscricaoA.getVitoriasTotais() + 1);
        }

        inscricaoB.setPontosAcumulados(Math.max(0, ratingB + variacaoB));
        if (inverterResultado(resultadoA) == Resultado.VITORIA) {
            inscricaoB.setVitoriasTotais(inscricaoB.getVitoriasTotais() + 1);
        }
    }

    public Resultado inverterResultado(Resultado resultado) {
        return switch (resultado) {
            case VITORIA -> Resultado.DERROTA;
            case DERROTA -> Resultado.VITORIA;
            case EMPATE  -> Resultado.EMPATE;
        };
    }

    private double converterResultadoParaPlacar(Resultado resultado) {
        return switch (resultado) {
            case VITORIA -> 1.0;
            case EMPATE  -> 0.5;
            case DERROTA -> 0.0;
        };
    }
}