#!/bin/bash
# Seed script for Rank It Up! database
# Run with: docker exec -i rankitup-mysql mysql -u root -p3132 rankitup_db < seed-database.sh
# Or: ./seed-database.sh (if mysql client installed locally)

echo "🌱 Seeding Rank It Up! database..."

# Clear existing data (respecting FK order)
DELETE FROM desempenho_partida;
DELETE FROM partida;
DELETE FROM inscricao;
DELETE FROM torneio;
DELETE FROM jogador;
DELETE FROM administrador;
DELETE FROM usuario;
DELETE FROM equipe;
DELETE FROM jogo;

# Reset auto_increment
ALTER TABLE usuario AUTO_INCREMENT = 1;
ALTER TABLE jogo AUTO_INCREMENT = 1;
ALTER TABLE equipe AUTO_INCREMENT = 1;
ALTER TABLE torneio AUTO_INCREMENT = 1;
ALTER TABLE inscricao AUTO_INCREMENT = 1;
ALTER TABLE partida AUTO_INCREMENT = 1;

# =============================================
# USUÁRIOS (password = "123456" hashed with BCrypt)
# =============================================
# Hash for "123456": $2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa

INSERT INTO usuario (email, senha, perfil, nome, nickname, foto_perfil) VALUES
-- Admins
('admin@rankitup.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'ROLE_ADMIN', 'Admin Principal', 'admin', NULL),
('admin2@rankitup.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'ROLE_ADMIN', 'Admin Secundário', 'admin2', NULL),

-- Jogadores
('joao@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'ROLE_USER', 'João Silva', 'joaosilva', NULL),
('maria@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'ROLE_USER', 'Maria Santos', 'marias', NULL),
('pedro@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'ROLE_USER', 'Pedro Oliveira', 'pedro_oliveira', NULL),
('ana@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'ROLE_USER', 'Ana Costa', 'anacosta', NULL),
('lucas@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'ROLE_USER', 'Lucas Ferreira', 'lucasf', NULL),
('julia@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'ROLE_USER', 'Julia Almeida', 'julia_a', NULL),
('rafael@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'ROLE_USER', 'Rafael Lima', 'rafaellima', NULL),
('camila@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'ROLE_USER', 'Camila Rocha', 'camilar', NULL),
('bruno@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'ROLE_USER', 'Bruno Martins', 'bruno_m', NULL);

INSERT INTO administrador (id_usuario) VALUES (1), (2);

# =============================================
# EQUIPES
# =============================================
INSERT INTO equipe (nome_equipe, tag_equipe, pais_origem) VALUES
('Team Alpha', 'ALPH', 'Brasil'),
('Team Beta', 'BETA', 'Brasil'),
('Team Gamma', 'GAMA', 'Argentina'),
('Team Delta', 'DELT', 'Chile'),
('Solo Players', 'SOLO', 'Brasil');

# =============================================
# JOGADORES (vinculam usuario + equipe)
# =============================================
INSERT INTO jogador (id_usuario, id_equipe, elo, vitorias, derrotas, empates) VALUES
(3, 1, 1200, 5, 2, 1),   -- joao -> Team Alpha
(4, 1, 1150, 4, 3, 0),   -- maria -> Team Alpha
(5, 2, 1300, 8, 1, 2),   -- pedro -> Team Beta
(6, 2, 1100, 3, 4, 1),   -- ana -> Team Beta
(7, 3, 1400, 10, 0, 1),  -- lucas -> Team Gamma
(8, 3, 1250, 6, 2, 2),   -- julia -> Team Gamma
(9, 4, 1180, 5, 3, 0),   -- rafael -> Team Delta
(10, 4, 1050, 2, 5, 1),  -- camila -> Team Delta
(11, 5, 1000, 0, 0, 0);  -- bruno -> Solo Players

# =============================================
# JOGOS
# =============================================
INSERT INTO jogo (titulo, genero, desenvolvedora) VALUES
('Counter-Strike 2', 'FPS', 'Valve'),
('Valorant', 'FPS', 'Riot Games'),
('League of Legends', 'MOBA', 'Riot Games'),
('Dota 2', 'MOBA', 'Valve'),
('Rocket League', 'Esportes', 'Psyonix'),
('Rainbow Six Siege', 'FPS', 'Ubisoft'),
('Overwatch 2', 'FPS', 'Blizzard'),
('Apex Legends', 'Battle Royale', 'Respawn'),
('FIFA 24', 'Esportes', 'EA Sports'),
('Street Fighter 6', 'Luta', 'Capcom');

# =============================================
# TORNEIOS
# =============================================
INSERT INTO torneio (nome, premiacao_total, data_criacao, data_inicio, data_fim, formato, max_equipes, descricao, regras, id_jogo, id_admin_criador) VALUES
('Challenger de Valorant', 15000.00, '2026-06-01 10:00:00', '2026-07-01 10:00:00', '2026-07-15 22:00:00', 'ELIMINACAO_SIMPLES', 16, 'Torneio Challenger de Valorant - qualificatório para o circuito principal.', 'Formato MD3 até semis, MD5 na final. Map pool oficial.', 2, 1),
('Copa das Lendas LoL', 25000.00, '2026-06-05 14:00:00', '2026-07-20 13:00:00', '2026-08-05 20:00:00', 'GRUPOS_ELIMINACAO', 16, 'Copa lendária de League of Legends com as melhores equipes amadoras.', 'Fase de grupos (4 grupos de 4), top 2 avança para playoffs. MD3 em grupos, MD5 playoffs.', 3, 1),
('CS2 Major Qualifier', 10000.00, '2026-06-10 09:00:00', '2026-08-01 19:00:00', '2026-10-15 22:00:00', 'ELIMINACAO_DUPLA', 16, 'Qualificatório para o Major de CS2.', 'Eliminação dupla. MD3 winners, MD1 losers, MD5 grande final.', 1, 1),
('Dota 2 International BR', 50000.00, '2026-06-12 16:00:00', '2026-08-10 14:00:00', '2026-08-25 23:00:00', 'SUICO', 16, 'Torneio brasileiro de Dota 2 formato suíço rumo ao TI.', 'Formato Suíço 5 rodadas, top 8 playoffs MD3.', 4, 2),
('Rocket League Cup', 1500.00, '2026-06-15 11:00:00', '2026-09-01 16:00:00', '2026-09-10 22:00:00', 'ELIMINACAO_SIMPLES', 8, 'Copa de Rocket League 3v3.', 'MD5 em todas as fases. Arena padrão. Sem mutadores.', 5, 1),
('R6 Siege Invitational', 4000.00, '2026-06-18 13:00:00', '2026-09-15 18:00:00', '2026-09-28 23:00:00', 'SUICO', 16, 'Invitational de Rainbow Six Siege com equipes convidadas.', 'Formato Suíço 5 rodadas, top 8 playoffs MD3. Map pool oficial ESL.', 6, 1);

# =============================================
# INSCRIÇÕES (jogadores em torneios)
# =============================================
-- Copa Brasil CS2 (id=1, jogo=CS2)
INSERT INTO inscricao (id_torneio, id_jogador, id_equipe, status, pontos_acumulados, vitorias_totais, saldo_kills) VALUES
(1, 3, 1, 'APROVADO', 0, 0, 0),   -- joao (Team Alpha)
(1, 4, 1, 'APROVADO', 0, 0, 0),   -- maria (Team Alpha)
(1, 5, 2, 'APROVADO', 0, 0, 0),   -- pedro (Team Beta)
(1, 6, 2, 'APROVADO', 0, 0, 0),   -- ana (Team Beta)

-- Valorant Champions (id=2, jogo=Valorant)
(2, 3, 1, 'APROVADO', 0, 0, 0),   -- joao
(2, 7, 3, 'APROVADO', 0, 0, 0),   -- lucas (Team Gamma)
(2, 8, 3, 'APROVADO', 0, 0, 0),   -- julia (Team Gamma)

-- Liga LoL (id=3, jogo=LoL)
(3, 5, 2, 'APROVADO', 0, 0, 0),   -- pedro
(3, 9, 4, 'APROVADO', 0, 0, 0),   -- rafael (Team Delta)
(3, 10, 4, 'APROVADO', 0, 0, 0),  -- camila (Team Delta)
(3, 11, 5, 'PENDENTE', 0, 0, 0),  -- bruno (Solo)

-- Dota 2 Open (id=4, jogo=Dota 2)
(4, 7, 3, 'APROVADO', 0, 0, 0),   -- lucas
(4, 8, 3, 'APROVADO', 0, 0, 0);   -- julia

# =============================================
# PARTIDAS
# =============================================
-- Partidas para Copa Brasil CS2 (torneio 1)
INSERT INTO partida (id_torneio, fase_torneio) VALUES
(1, 'Fase de Grupos'),
(1, 'Fase de Grupos'),
(1, 'Semifinal'),
(1, 'Final');

-- Partidas para Valorant Champions (torneio 2)
INSERT INTO partida (id_torneio, fase_torneio) VALUES
(2, 'Fase de Grupos'),
(2, 'Semifinal'),
(2, 'Final');

echo "✅ Seed completed! Database populated with:"
echo "  - 11 users (2 admins, 9 players)"
echo "  - 5 teams"
echo "  - 9 players linked to teams"
echo "  - 10 games"
echo "  - 6 tournaments"
echo "  - 16 inscriptions"
echo "  - 7 matches"
echo ""
echo "🔑 Login credentials (all passwords: 123456):"
echo "  Admin: admin@rankitup.com / admin2@rankitup.com"
echo "  Players: joao@email.com, maria@email.com, pedro@email.com, etc."