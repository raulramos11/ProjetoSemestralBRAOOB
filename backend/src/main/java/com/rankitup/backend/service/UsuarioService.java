package com.rankitup.backend.service;

import com.rankitup.backend.dto.CadastroUsuarioDTO;
import com.rankitup.backend.model.Administrador;
import com.rankitup.backend.model.Jogador;
import com.rankitup.backend.model.Usuario;
import com.rankitup.backend.model.enums.PerfilUsuario;
import com.rankitup.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.rankitup.backend.dto.LoginDTO;
import com.rankitup.backend.security.JwtService;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public Usuario cadastrar(CadastroUsuarioDTO dto) {

        if (usuarioRepository.findByEmail(dto.email()).isPresent()) {
            throw new IllegalArgumentException("Email ja cadastrado");
        }

        PerfilUsuario perfil = PerfilUsuario.valueOf(dto.perfil());

        Usuario novoUsuario = switch (perfil) {
            case ROLE_ADMIN, ROLE_SUPORTE -> new Administrador();
            case ROLE_USER -> {
                Jogador jogador = new Jogador();
                jogador.setNome(dto.nome());
                jogador.setNickname(dto.nickname());
                yield jogador;
            }
        };

        novoUsuario.setEmail(dto.email());
        novoUsuario.setPerfil(perfil);

        novoUsuario.setSenha(passwordEncoder.encode(dto.senha()));
        return usuarioRepository.save(novoUsuario);
    }

    public String login(LoginDTO dto) {
        Usuario usuario = usuarioRepository.findByEmail(dto.email())
                .orElseThrow(() -> new IllegalArgumentException("E-mail não encontrado."));

        if (!passwordEncoder.matches(dto.senha(), usuario.getSenha())) {
            throw new IllegalArgumentException("Senha incorreta.");
        }

        return jwtService.gerarToken(usuario.getEmail(), usuario.getPerfil().name());
    }
}
