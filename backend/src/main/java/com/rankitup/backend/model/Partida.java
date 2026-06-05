package com.rankitup.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "Partida")
@Getter
@Setter
@NoArgsConstructor
public class Partida {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_partida")
    private Long idPartida;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_torneio", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Torneio torneio;

    @Column(name = "data_registro")
    private LocalDateTime dataRegistro = LocalDateTime.now();

    @Column(name = "fase_torneio", length = 50)
    private String faseTorneio;
}