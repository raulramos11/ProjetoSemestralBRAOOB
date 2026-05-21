package com.rankitup.backend.model;

import com.rankitup.backend.model.enums.Resultado;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "Desempenho_Partida")
@Getter
@Setter
@NoArgsConstructor
public class DesempenhoPartida {

    @EmbeddedId
    private DesempenhoPartidaId id = new DesempenhoPartidaId();

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idPartida")
    @JoinColumn(name = "id_partida", nullable = false)
    private Partida partida;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idInscricao")
    @JoinColumn(name = "id_inscricao", nullable = false)
    private Inscricao inscricao;

    @Column(name = "score_individual")
    private Integer scoreIndividual = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Resultado resultado;
}

@Embeddable
@Getter
@Setter
@NoArgsConstructor
class DesempenhoPartidaId implements Serializable {

    @Column(name = "id_partida")
    private Long idPartida;

    @Column(name = "id_inscricao")
    private Long idInscricao;

    // O JPA exige os métodos equals e hashCode para chaves compostas compararem os IDs corretamente
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DesempenhoPartidaId that = (DesempenhoPartidaId) o;
        return Objects.equals(idPartida, that.idPartida) && Objects.equals(idInscricao, that.idInscricao);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idPartida, idInscricao);
    }
}