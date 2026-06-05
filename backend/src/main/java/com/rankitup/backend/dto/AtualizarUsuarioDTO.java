package com.rankitup.backend.dto;

// DTO para atualização de dados do usuário.
// Todos os campos são opcionais — só atualiza o que for enviado.
public record AtualizarUsuarioDTO(
        String nome,        // só para Jogador
        String nickname,    // só para Jogador
        String fotoPerfil,  // só para Jogador
        String senha        // qualquer usuário pode trocar a senha
) {}