package com.rankitup.backend.service;

import com.rankitup.backend.model.Inscricao;
import com.rankitup.backend.model.enums.Resultado;
import org.springframework.stereotype.Service;

@Service
public class RankingService {

    private static final int K_FACTOR = 32;

    // Calcula a probabilidade de A vencer B
    private double calcularProbabilidadeVitoria(int ratingA, int ratingB) {
        return 1.0 / (1.0 + Math.pow(10.0, (ratingB - ratingA) / 400.0));
    }

    // Processa o duelo completo entre dois jogadores na mesma chamada.
    // Correção dos problemas 3 e 4:
    //   - usa o rating REAL do adversário (não mais hardcode 0)
    //   - atualiza os dois jogadores de uma vez (será chamado dentro de @Transactional)
    public void processarDuelo(Inscricao inscricaoA, Inscricao inscricaoB, Resultado resultadoA) {

        int ratingA = inscricaoA.getPontosAcumulados();
        int ratingB = inscricaoB.getPontosAcumulados();

        // Expectativas com os ratings reais dos dois
        double expectativaA = calcularProbabilidadeVitoria(ratingA, ratingB);
        double expectativaB = calcularProbabilidadeVitoria(ratingB, ratingA);

        double placarA = converterResultadoParaPlacar(resultadoA);
        double placarB = converterResultadoParaPlacar(inverterResultado(resultadoA));

        int variacaoA = (int) Math.round(K_FACTOR * (placarA - expectativaA));
        int variacaoB = (int) Math.round(K_FACTOR * (placarB - expectativaB));

        // Atualiza jogador A
        inscricaoA.setPontosAcumulados(Math.max(0, ratingA + variacaoA));
        if (resultadoA == Resultado.VITORIA) {
            inscricaoA.setVitoriasTotais(inscricaoA.getVitoriasTotais() + 1);
        }

        // Atualiza jogador B
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