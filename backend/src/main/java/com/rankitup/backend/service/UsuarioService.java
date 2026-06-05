package com.rankitup.backend.service;

import com.rankitup.backend.dto.AtualizarUsuarioDTO;
import com.rankitup.backend.dto.CadastroUsuarioDTO;
import com.rankitup.backend.dto.LoginDTO;
import com.rankitup.backend.model.Administrador;
import com.rankitup.backend.model.Jogador;
import com.rankitup.backend.model.Usuario;
import com.rankitup.backend.model.enums.PerfilUsuario;
import com.rankitup.backend.repository.UsuarioRepository;
import com.rankitup.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    // Cadastro
    public Usuario cadastrar(CadastroUsuarioDTO dto) {
        if (usuarioRepository.findByEmail(dto.email()).isPresent()) {
            throw new IllegalArgumentException("E-mail já cadastrado.");
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

    // Login
    public String login(LoginDTO dto) {
        Usuario usuario = usuarioRepository.findByEmail(dto.email())
                .orElseThrow(() -> new IllegalArgumentException("E-mail não encontrado."));

        if (!passwordEncoder.matches(dto.senha(), usuario.getSenha())) {
            throw new IllegalArgumentException("Senha incorreta.");
        }

        return jwtService.gerarToken(usuario.getEmail(), usuario.getPerfil().name());
    }

    // Listar todos — só admin
    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    // Buscar por id
    public Usuario buscarPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));
    }

    // Atualizar — admin pode atualizar qualquer um, usuário só a si mesmo
    public Usuario atualizar(Long id, AtualizarUsuarioDTO dto, String emailRequisitante) {
        Usuario usuario = buscarPorId(id);

        // Verifica se é o próprio usuário ou um admin
        Usuario requisitante = usuarioRepository.findByEmail(emailRequisitante)
                .orElseThrow(() -> new IllegalArgumentException("Requisitante não encontrado."));

        boolean isAdmin = requisitante.getPerfil() == PerfilUsuario.ROLE_ADMIN;
        boolean isSelf  = usuario.getEmail().equals(emailRequisitante);

        if (!isAdmin && !isSelf) {
            throw new SecurityException("Sem permissão para atualizar este usuário.");
        }

        // Atualiza senha se informada
        if (dto.senha() != null && !dto.senha().isBlank()) {
            usuario.setSenha(passwordEncoder.encode(dto.senha()));
        }

        // Atualiza campos específicos de Jogador
        if (usuario instanceof Jogador jogador) {
            if (dto.nome() != null && !dto.nome().isBlank()) {
                jogador.setNome(dto.nome());
            }
            if (dto.nickname() != null && !dto.nickname().isBlank()) {
                jogador.setNickname(dto.nickname());
            }
            if (dto.fotoPerfil() != null && !dto.fotoPerfil().isBlank()) {
                jogador.setFotoPerfil(dto.fotoPerfil());
            }
        }

        return usuarioRepository.save(usuario);
    }

    // Excluir — só admin
    public void excluir(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new IllegalArgumentException("Usuário não encontrado.");
        }
        usuarioRepository.deleteById(id);
    }

    // Verificar senha — usado internamente
    public boolean verificarSenha(String senhaTexto, String hashArmazenado) {
        return passwordEncoder.matches(senhaTexto, hashArmazenado);
    }
}