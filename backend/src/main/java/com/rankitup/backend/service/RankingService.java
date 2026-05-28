package com.rankitup.backend.service;

import com.rankitup.backend.model.Inscricao;
import com.rankitup.backend.model.enums.Resultado;
import org.springframework.stereotype.Service;

@Service
public class RankingService {

    // O Fator K define a "volatilidade" do ranking.
    // Em muitos jogos, usa-se 32 para iniciantes e 16 para profissionais. Vamos fixar em 32.
    private static final int K_FACTOR = 32;

    /**
     * Calcula a probabilidade (de 0.0 a 1.0) do Jogador A vencer o Jogador B
     */
    private double calcularProbabilidadeVitoria(int ratingJogadorA, int ratingJogadorB) {
        return 1.0 / (1.0 + Math.pow(10.0, (ratingJogadorB - ratingJogadorA) / 400.0));
    }


    public int processarResultadoPartida(Inscricao inscricaoJogador, int ratingAdversario, Resultado resultado) {

        int ratingAtual = inscricaoJogador.getPontosAcumulados();

        double expectativaVitoria = calcularProbabilidadeVitoria(ratingAtual, ratingAdversario);
        double placarReal = converterResultadoParaPlacar(resultado);

        int variacaoPontos = (int) Math.round(K_FACTOR * (placarReal - expectativaVitoria));

        int novoRating = Math.max(0, ratingAtual + variacaoPontos);
        inscricaoJogador.setPontosAcumulados(novoRating);

        if (resultado == Resultado.VITORIA) {
            inscricaoJogador.setVitoriasTotais(inscricaoJogador.getVitoriasTotais() + 1);
        }

        // Devolvemos a variação para o Controller saber quanto ele ganhou!
        return variacaoPontos;
    }

    private double converterResultadoParaPlacar(Resultado resultado) {
        return switch (resultado) {
            case VITORIA -> 1.0;
            case EMPATE -> 0.5;
            case DERROTA -> 0.0;
        };
    }
}