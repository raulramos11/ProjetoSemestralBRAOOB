package com.rankitup.backend.controller;

import com.rankitup.backend.dto.CadastroUsuarioDTO;
import com.rankitup.backend.dto.LoginDTO;
import com.rankitup.backend.model.Usuario;
import com.rankitup.backend.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    // POST /api/usuarios/cadastro
    // Body: { "email": "x@x.com", "senha": "123456", "perfil": "ROLE_USER" }
    @PostMapping("/cadastro")
    public ResponseEntity<?> cadastrar(@RequestBody CadastroUsuarioDTO dto) {
        try {
            Usuario criado = usuarioService.cadastrar(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(criado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO dto) {
        try {
            String token = usuarioService.login(dto);
            return ResponseEntity.ok(token);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
}