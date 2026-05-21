package com.rankitup.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Torneio")
@Getter
@Setter
@NoArgsConstructor
public class Torneio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_torneio")
    private Long idTorneio;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(name = "premiacao_total", precision = 12, scale = 2)
    private BigDecimal premiacaoTotal = BigDecimal.ZERO;

    @Column(name = "data_criacao")
    private LocalDateTime dataCriacao = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_jogo", nullable = false)
    private Jogo jogo;
}