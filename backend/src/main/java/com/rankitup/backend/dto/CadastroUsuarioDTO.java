package com.rankitup.backend.dto;

public record CadastroUsuarioDTO(
    String email,
    String senha,  // texto puro
    String perfil, //Role
    String nome,
    String nickname
) { }
