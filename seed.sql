-- Seed script for Rank It Up! database
-- Run with: docker exec -i rankitup-mysql mysql -u root -p3132 rankitup_db < seed.sql

-- Clear existing data (respecting FK order)
DELETE FROM desempenho_partida;
DELETE FROM partida;
DELETE FROM inscricao;
DELETE FROM torneio;
DELETE FROM jogador;
DELETE FROM administrador;
DELETE FROM usuario;
DELETE FROM equipe;
DELETE FROM jogo;

-- Reset auto_increment
ALTER TABLE usuario AUTO_INCREMENT = 1;
ALTER TABLE jogo AUTO_INCREMENT = 1;
ALTER TABLE equipe AUTO_INCREMENT = 1;
ALTER TABLE torneio AUTO_INCREMENT = 1;
ALTER TABLE inscricao AUTO_INCREMENT = 1;
ALTER TABLE partida AUTO_INCREMENT = 1;

-- =============================================
-- USUÁRIOS (password = "123456" hashed with BCrypt)
-- Hash for "123456": $2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa
-- =============================================
INSERT INTO usuario (email, senha, perfil) VALUES
-- Admins
('admin@rankitup.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'ROLE_ADMIN'),
('admin2@rankitup.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'ROLE_ADMIN'),

-- Jogadores
('joao@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'ROLE_USER'),
('maria@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'ROLE_USER'),
('pedro@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'ROLE_USER'),
('ana@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'ROLE_USER'),
('lucas@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'ROLE_USER'),
('julia@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'ROLE_USER'),
('rafael@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'ROLE_USER'),
('camila@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'ROLE_USER'),
('bruno@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'ROLE_USER');

INSERT INTO administrador (id_usuario) VALUES (1), (2);

-- =============================================
-- EQUIPES
-- =============================================
INSERT INTO equipe (nome_equipe, tag_equipe, pais_origem) VALUES
('Team Alpha', 'ALPH', 'Brasil'),
('Team Beta', 'BETA', 'Brasil'),
('Team Gamma', 'GAMA', 'Argentina'),
('Team Delta', 'DELT', 'Chile'),
('Solo Players', 'SOLO', 'Brasil');

-- =============================================
-- JOGADORES (vinculam usuario + equipe)
-- Jogador extends Usuario (JOINED inheritance) - shares id_usuario
-- Fields: id_usuario (PK), nome, nickname, foto_perfil, id_equipe (FK)
-- =============================================
INSERT INTO jogador (id_usuario, id_equipe, nome, nickname, foto_perfil) VALUES
(3, 1, 'João Silva', 'joaosilva', NULL),     -- joao -> Team Alpha
(4, 1, 'Maria Santos', 'marias', NULL),       -- maria -> Team Alpha
(5, 2, 'Pedro Oliveira', 'pedro_oliveira', NULL), -- pedro -> Team Beta
(6, 2, 'Ana Costa', 'anacosta', NULL),        -- ana -> Team Beta
(7, 3, 'Lucas Ferreira', 'lucasf', NULL),     -- lucas -> Team Gamma
(8, 3, 'Julia Almeida', 'julia_a', NULL),     -- julia -> Team Gamma
(9, 4, 'Rafael Lima', 'rafaellima', NULL),    -- rafael -> Team Delta
(10, 4, 'Camila Rocha', 'camilar', NULL),     -- camila -> Team Delta
(11, 5, 'Bruno Martins', 'bruno_m', NULL);    -- bruno -> Solo Players

-- =============================================
-- JOGOS (genero enum: FPS, MOBA, BATTLE_ROYALLE, SHOOTER, TABULEIRO)
-- =============================================
INSERT INTO jogo (titulo, genero, desenvolvedora, imagem_url, banner_url, descricao) VALUES
('Counter-Strike 2', 'FPS', 'Valve',
 'https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg',
 'https://cdn.akamai.steamstatic.com/steam/apps/730/library_600x900.jpg',
 'O FPS tático mais jogado do mundo. Duas equipes, Terroristas e Contra-Terroristas, competem em objetivos de bomba e reféns.'),
('Valorant', 'FPS', 'Riot Games',
 'https://cdn1.epicgames.com/offer/valorant/homepage/Valorant_EGS_Store_Image_2560x1440.jpg',
 'https://media.valorant-api.com/bundles/1/featuredimage.jpg',
 'FPS tático 5v5 com agentes únicos, habilidades e gunplay precisa. Competitivo e estratégico.'),
('League of Legends', 'MOBA', 'Riot Games',
 'https://www.leagueoflegends.com/static/open-graph-image.png',
 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ahri_0.jpg',
 'MOBA 5v5 mais popular do mundo. Escolha entre 160+ campeões e destrua o Nexus inimigo.'),
('Dota 2', 'MOBA', 'Valve',
 'https://cdn.akamai.steamstatic.com/steam/apps/570/header.jpg',
 'https://cdn.akamai.steamstatic.com/steam/apps/570/library_600x900.jpg',
 'MOBA complexo e profundo da Valve. 120+ heróis, mecânicas avançadas e The International.'),
('Rocket League', 'SHOOTER', 'Psyonix',
 'https://cdn.akamai.steamstatic.com/steam/apps/252950/header.jpg',
 'https://cdn.akamai.steamstatic.com/steam/apps/252950/library_600x900.jpg',
 'Futebol com carros turbo! Partidas rápidas, acrobacias aéreas e física única.'),
('Rainbow Six Siege', 'FPS', 'Ubisoft',
 'https://cdn.akamai.steamstatic.com/steam/apps/359550/header.jpg',
 'https://cdn.akamai.steamstatic.com/steam/apps/359550/library_600x900.jpg',
 'FPS tático de destruição ambiental. Operadores únicos, brechas, reforços e estratégia pura.'),
('Overwatch 2', 'FPS', 'Blizzard',
 'https://cdn.akamai.steamstatic.com/steam/apps/2358570/header.jpg',
 'https://blzgdapipro-a.akamaihd.net/hero-page/hero-overwatch-2.jpg',
 'Hero shooter 5v5 com heróis diversos. Tanques, Dano, Suporte — trabalho em equipe é tudo.'),
('Apex Legends', 'BATTLE_ROYALLE', 'Respawn',
 'https://cdn.akamai.steamstatic.com/steam/apps/1172470/header.jpg',
 'https://cdn.akamai.steamstatic.com/steam/apps/1172470/library_600x900.jpg',
 'Battle Royale heroico 3v3. Legends com habilidades únicas, ping system e movimento fluido.'),
('EA Sports FC 24', 'SHOOTER', 'EA Sports',
 'https://cdn.akamai.steamstatic.com/steam/apps/2304010/header.jpg',
 'https://cdn.akamai.steamstatic.com/steam/apps/2304010/library_600x900.jpg',
 'Simulador de futebol mais realista. Ultimate Team, Carreira, Clubs e gameplay HyperMotion.'),
('Street Fighter 6', 'SHOOTER', 'Capcom',
 'https://cdn.akamai.steamstatic.com/steam/apps/1364780/header.jpg',
 'https://cdn.akamai.steamstatic.com/steam/apps/1364780/library_600x900.jpg',
 'Lenda dos fighting games evoluída. Drive System, World Tour, Battle Hub e 18+ lutadores.');

-- =============================================
-- TORNEIOS
-- =============================================
INSERT INTO torneio (nome, premiacao_total, data_criacao, data_inicio, data_fim, formato, max_equipes, descricao, regras, id_jogo, id_admin_criador) VALUES
('Challenger de Valorant', 15000.00, '2026-06-01 10:00:00', '2026-07-01 10:00:00', '2026-07-15 22:00:00', 'ELIMINACAO_SIMPLES', 16, 'Torneio Challenger de Valorant - qualificatório para o circuito principal.', 'Formato MD3 até semis, MD5 na final. Map pool oficial.', 2, 1),
('Copa das Lendas LoL', 25000.00, '2026-06-05 14:00:00', '2026-07-20 13:00:00', '2026-08-05 20:00:00', 'GRUPOS_ELIMINACAO', 16, 'Copa lendária de League of Legends com as melhores equipes amadoras.', 'Fase de grupos (4 grupos de 4), top 2 avança para playoffs. MD3 em grupos, MD5 playoffs.', 3, 1),
('CS2 Major Qualifier', 10000.00, '2026-06-10 09:00:00', '2026-08-01 19:00:00', '2026-10-15 22:00:00', 'ELIMINACAO_DUPLA', 16, 'Qualificatório para o Major de CS2.', 'Eliminação dupla. MD3 winners, MD1 losers, MD5 grande final.', 1, 1),
('Dota 2 International BR', 50000.00, '2026-06-12 16:00:00', '2026-08-10 14:00:00', '2026-08-25 23:00:00', 'SUICO', 16, 'Torneio brasileiro de Dota 2 formato suíço rumo ao TI.', 'Formato Suíço 5 rodadas, top 8 playoffs MD3.', 4, 2),
('Rocket League Cup', 1500.00, '2026-06-15 11:00:00', '2026-09-01 16:00:00', '2026-09-10 22:00:00', 'ELIMINACAO_SIMPLES', 8, 'Copa de Rocket League 3v3.', 'MD5 em todas as fases. Arena padrão. Sem mutadores.', 5, 1),
('R6 Siege Invitational', 4000.00, '2026-06-18 13:00:00', '2026-09-15 18:00:00', '2026-09-28 23:00:00', 'SUICO', 16, 'Invitational de Rainbow Six Siege com equipes convidadas.', 'Formato Suíço 5 rodadas, top 8 playoffs MD3. Map pool oficial ESL.', 6, 1);

-- =============================================
-- INSCRIÇÕES (jogadores em torneios)
-- Fields: id_inscricao, id_torneio, id_jogador, id_equipe, status, pontos_acumulados, vitorias_totais, saldo_kills
-- =============================================
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

-- =============================================
-- PARTIDAS
-- =============================================
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