package com.rankitup.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
public class DesempenhoPartidaId implements Serializable {

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