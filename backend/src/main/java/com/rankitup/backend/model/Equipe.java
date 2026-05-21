package com.rankitup.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "Equipe")
@Getter
@Setter
@NoArgsConstructor
public class Equipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_equipe")
    private Long idEquipe;

    @Column(name = "nome_equipe", nullable = false, length = 100)
    private String nomeEquipe;

    @Column(name = "tag_equipe", nullable = false, unique = true, length = 10)
    private String tagEquipe;

    @Column(name = "pais_origem", length = 50)
    private String paisOrigem;
}