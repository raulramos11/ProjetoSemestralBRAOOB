package com.rankitup.backend.model;
import com.rankitup.backend.model.enums.GeneroJogo;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Jogo")
@Getter
@Setter
@NoArgsConstructor
public class Jogo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_jogo")
    private Long idJogo;

    @Column(nullable = false, length = 100)
    private String titulo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private GeneroJogo genero;

    @Column(length = 100)
    private String desenvolvedora;

    @Column(name = "imagem_url", length = 500)
    private String imagemUrl;

    @Column(name = "banner_url", length = 500)
    private String bannerUrl;

    @Column(columnDefinition = "TEXT")
    private String descricao;

}
