package com.rankitup.backend.dto;

import com.rankitup.backend.model.enums.Resultado;

// Recebe o resultado de uma partida com os dois participantes.
// idInscricaoA é o jogador de referência — o resultado dele determina o do adversário.
public record ResultadoPartidaDTO(
        Long idInscricaoA,  // inscrição do jogador A
        Long idInscricaoB,  // inscrição do jogador B
        Resultado resultadoA // resultado DO JOGADOR A (VITORIA, DERROTA ou EMPATE)
) {}