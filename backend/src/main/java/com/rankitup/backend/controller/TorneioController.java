package com.rankitup.backend.controller;

import com.rankitup.backend.model.Administrador;
import com.rankitup.backend.model.Torneio;
import com.rankitup.backend.repository.AdministradorRepository;
import com.rankitup.backend.repository.TorneioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/torneios")
@RequiredArgsConstructor
public class TorneioController {

    private final TorneioRepository torneioRepository;
    private final AdministradorRepository administradorRepository;

    @GetMapping
    public List<Torneio> listarTodos() {
        return torneioRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        return torneioRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Ao criar o torneio, vincula automaticamente o admin autenticado como criador
    @PostMapping
    public ResponseEntity<?> cadastrar(@RequestBody Torneio novoTorneio,
                                       Authentication authentication) {
        // Pega o email do admin logado direto do token JWT
        String emailAdmin = authentication.getName();

        Administrador criador = administradorRepository.findByEmail(emailAdmin)
                .orElseThrow(() -> new RuntimeException("Administrador não encontrado."));

        novoTorneio.setCriador(criador);
        novoTorneio.setDataCriacao(LocalDateTime.now());
        
        return ResponseEntity.ok(torneioRepository.save(novoTorneio));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody Torneio torneioAtualizado,
                                       Authentication authentication) {
        String emailAdmin = authentication.getName();
        
        return torneioRepository.findById(id)
                .map(torneio -> {
                    // Verifica se é o criador do torneio ou admin
                    if (!torneio.getCriador().getEmail().equals(emailAdmin)) {
                        return ResponseEntity.status(403).body("Apenas o criador pode editar este torneio");
                    }
                    
                    torneio.setNome(torneioAtualizado.getNome());
                    torneio.setPremiacaoTotal(torneioAtualizado.getPremiacaoTotal());
                    torneio.setDataInicio(torneioAtualizado.getDataInicio());
                    torneio.setDataFim(torneioAtualizado.getDataFim());
                    torneio.setFormato(torneioAtualizado.getFormato());
                    torneio.setMaxEquipes(torneioAtualizado.getMaxEquipes());
                    torneio.setDescricao(torneioAtualizado.getDescricao());
                    torneio.setRegras(torneioAtualizado.getRegras());
                    torneio.setJogo(torneioAtualizado.getJogo());
                    
                    return ResponseEntity.ok(torneioRepository.save(torneio));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluir(@PathVariable Long id, Authentication authentication) {
        String emailAdmin = authentication.getName();
        
        return torneioRepository.findById(id)
                .map(torneio -> {
                    if (!torneio.getCriador().getEmail().equals(emailAdmin)) {
                        return ResponseEntity.status(403).body("Apenas o criador pode excluir este torneio");
                    }
                    
                    torneioRepository.deleteById(id);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}