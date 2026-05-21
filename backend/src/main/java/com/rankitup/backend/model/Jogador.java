package com.rankitup.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Jogador")
@Getter
@Setter
@NoArgsConstructor
public class Jogador extends Usuario {

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false, length = 50, unique = true)
    private String nickname;

    @Column(name = "foto_perfil")
    private String fotoPerfil;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_equipe")
    private Equipe equipe;

}
