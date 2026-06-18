package com.rankitup.backend.controller;

import com.rankitup.backend.model.Jogo;
import com.rankitup.backend.repository.JogoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jogos")
@RequiredArgsConstructor
public class JogoController {

    private final JogoRepository jogoRepository;

    @GetMapping
    public List<Jogo> listarTodos() {
        return jogoRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        return jogoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Jogo> cadastrar(@RequestBody Jogo novoJogo) {
        return ResponseEntity.ok(jogoRepository.save(novoJogo));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody Jogo jogoAtualizado) {
        return jogoRepository.findById(id)
                .map(jogo -> {
                    jogo.setTitulo(jogoAtualizado.getTitulo());
                    jogo.setGenero(jogoAtualizado.getGenero());
                    jogo.setDesenvolvedora(jogoAtualizado.getDesenvolvedora());
                    jogo.setImagemUrl(jogoAtualizado.getImagemUrl());
                    jogo.setBannerUrl(jogoAtualizado.getBannerUrl());
                    jogo.setDescricao(jogoAtualizado.getDescricao());
                    return ResponseEntity.ok(jogoRepository.save(jogo));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluir(@PathVariable Long id) {
        if (!jogoRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        jogoRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}