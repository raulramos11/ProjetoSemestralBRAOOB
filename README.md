# Rank It Up! — Documentação da API

Base URL: `http://localhost:8080`

> **Versão:** 2.0 — atualizada após correções P1, P2 e P3

---

## Autenticação

A API usa **JWT (Bearer Token)**. Após o login, inclua o token em todas as requisições protegidas:

```
Authorization: Bearer eyJhbGciOiJIUzM4NCJ9...
```

**Rotas públicas** (sem token): `POST /api/usuarios/cadastro`, `POST /api/usuarios/login`, `GET /api/torneios`, `GET /api/inscricoes`, `GET /api/jogos`, `GET /api/equipes`.

---

## Formato de erro padrão

Todos os erros retornam neste formato:

```json
{
  "timestamp": "2026-06-05T16:00:00.123",
  "status": 404,
  "erro": "Usuário não encontrado."
}
```

---

## Usuários

### Cadastrar usuário
`POST /api/usuarios/cadastro` — **público**

**Body:**
```json
{
  "email": "jogador@email.com",
  "senha": "123456",
  "perfil": "ROLE_USER",
  "nome": "João Silva",
  "nickname": "joaosilva"
}
```

> Para admin omita `nome` e `nickname` e use `"perfil": "ROLE_ADMIN"`.

| Status | Descrição |
|--------|-----------|
| 201 | Usuário criado |
| 409 | E-mail já cadastrado |

---

### Login
`POST /api/usuarios/login` — **público**

**Body:**
```json
{
  "email": "jogador@email.com",
  "senha": "123456"
}
```

**Resposta 200:** token JWT como string
```
eyJhbGciOiJIUzM4NCJ9...
```

| Status | Descrição |
|--------|-----------|
| 200 | Retorna token JWT |
| 401 | E-mail ou senha incorretos |

---

### Listar todos os usuários
`GET /api/usuarios` — **admin**

**Resposta 200:**
```json
[
  {
    "idUsuario": 1,
    "email": "jogador@email.com",
    "perfil": "ROLE_USER",
    "nome": "João Silva",
    "nickname": "joaosilva",
    "fotoPerfil": null,
    "equipe": { "idEquipe": 1, "nomeEquipe": "Team Alpha", "tagEquipe": "ALPH", "paisOrigem": "Brasil" }
  }
]
```

---

### Buscar usuário por ID
`GET /api/usuarios/{id}` — **autenticado**

| Status | Descrição |
|--------|-----------|
| 200 | Usuário encontrado |
| 404 | Usuário não encontrado |

---

### Atualizar usuário
`PUT /api/usuarios/{id}` — **admin ou o próprio usuário**

**Body** (todos os campos são opcionais):
```json
{
  "nome": "João Atualizado",
  "nickname": "joao_novo",
  "fotoPerfil": "https://url-da-foto.com/foto.jpg",
  "senha": "novasenha123"
}
```

| Status | Descrição |
|--------|-----------|
| 200 | Usuário atualizado |
| 403 | Sem permissão para atualizar este usuário |
| 404 | Usuário não encontrado |

---

### Excluir usuário
`DELETE /api/usuarios/{id}` — **admin**

| Status | Descrição |
|--------|-----------|
| 200 | `"Usuário excluído com sucesso."` |
| 404 | Usuário não encontrado |

---

## Equipes

### Listar todas as equipes
`GET /api/equipes` — **público**

**Resposta 200:**
```json
[
  {
    "idEquipe": 1,
    "nomeEquipe": "Team Alpha",
    "tagEquipe": "ALPH",
    "paisOrigem": "Brasil"
  }
]
```

---

### Cadastrar equipe
`POST /api/equipes` — **autenticado**

**Body:**
```json
{
  "nomeEquipe": "Team Alpha",
  "tagEquipe": "ALPH",
  "paisOrigem": "Brasil"
}
```

> `tagEquipe` deve ser única no sistema (máx. 10 caracteres).

| Status | Descrição |
|--------|-----------|
| 200 | Equipe criada |
| 500 | Tag já em uso |

---

## Jogos

### Listar todos os jogos
`GET /api/jogos` — **público**

**Resposta 200:**
```json
[
  {
    "idJogo": 1,
    "titulo": "Counter-Strike 2",
    "genero": "FPS",
    "desenvolvedora": "Valve"
  }
]
```

---

### Cadastrar jogo
`POST /api/jogos` — **autenticado**

**Body:**
```json
{
  "titulo": "Counter-Strike 2",
  "genero": "FPS",
  "desenvolvedora": "Valve"
}
```

| Status | Descrição |
|--------|-----------|
| 200 | Jogo criado |

---

## Torneios

### Listar todos os torneios
`GET /api/torneios` — **público**

**Resposta 200:**
```json
[
  {
    "idTorneio": 1,
    "nome": "Torneio Verão",
    "premiacaoTotal": 1000.00,
    "dataCriacao": "2026-06-05T10:00:00",
    "jogo": { "idJogo": 1, "titulo": "Counter-Strike 2", "genero": "FPS", "desenvolvedora": "Valve" },
    "criador": { "idUsuario": 2, "email": "admin@email.com", "perfil": "ROLE_ADMIN" }
  }
]
```

---

### Criar torneio
`POST /api/torneios` — **admin**

> O campo `criador` é preenchido automaticamente com o admin do token — não envie.

**Body:**
```json
{
  "nome": "Torneio Verão",
  "premiacaoTotal": 1000.00,
  "jogo": { "idJogo": 1 }
}
```

| Status | Descrição |
|--------|-----------|
| 200 | Torneio criado com criador vinculado automaticamente |
| 403 | Token não é de admin |

---

## Inscrições

### Listar todas as inscrições
`GET /api/inscricoes` — **público**

Serve como tabela de ranking geral. Retorna `pontosAcumulados` e `vitoriasTotais` de cada jogador por torneio.

**Resposta 200:**
```json
[
  {
    "idInscricao": 1,
    "torneio": { "idTorneio": 1, "nome": "Torneio Verão" },
    "jogador": { "idUsuario": 4, "nickname": "joaosilva" },
    "equipe": { "idEquipe": 1, "nomeEquipe": "Team Alpha", "tagEquipe": "ALPH" },
    "status": "APROVADO",
    "pontosAcumulados": 47,
    "vitoriasTotais": 3,
    "saldoKills": 0
  }
]
```

---

### Listar inscrições de um torneio por status
`GET /api/inscricoes/torneio/{idTorneio}?status=APROVADO` — **público**

| Parâmetro | Valores possíveis | Default |
|-----------|-------------------|---------|
| `status` | `PENDENTE`, `APROVADO`, `REJEITADO` | `APROVADO` |

---

### Inscrever jogador em torneio
`POST /api/inscricoes` — **admin**

A inscrição começa automaticamente como `PENDENTE`. O campo `equipe` é opcional.

**Body sem equipe:**
```json
{
  "torneio": { "idTorneio": 1 },
  "jogador": { "idUsuario": 4 }
}
```

**Body com equipe (RGN-09):**
```json
{
  "torneio": { "idTorneio": 1 },
  "jogador": { "idUsuario": 4 },
  "equipe": { "idEquipe": 1 }
}
```

| Status | Descrição |
|--------|-----------|
| 200 | Inscrição criada com status `PENDENTE` |
| 500 | Jogador já inscrito neste torneio |

---

### Aprovar ou rejeitar inscrição
`PATCH /api/inscricoes/{id}/status?status=APROVADO` — **admin**

| Valor | Descrição |
|-------|-----------|
| `APROVADO` | Jogador liberado para participar de partidas |
| `REJEITADO` | Jogador bloqueado |

| Status | Descrição |
|--------|-----------|
| 200 | Status atualizado |
| 404 | Inscrição não encontrada |

---

## Partidas

### Listar todas as partidas
`GET /api/partidas` — **admin**

---

### Criar partida
`POST /api/partidas` — **admin**

**Body:**
```json
{
  "torneio": { "idTorneio": 1 },
  "faseTorneio": "Fase de Grupos"
}
```

---

### Registrar resultado e atualizar Elo
`POST /api/partidas/{id}/resultado` — **admin (criador do torneio)**

O `resultadoA` é o resultado do jogador A. O jogador B recebe o inverso automaticamente. O Elo de ambos é atualizado na mesma transação.

> **Fator K dinâmico:** jogadores com menos de 10 vitórias usam K=40, entre 10-30 usam K=32, acima de 30 usam K=20.

**Body:**
```json
{
  "idInscricaoA": 1,
  "idInscricaoB": 2,
  "resultadoA": "VITORIA"
}
```

| `resultadoA` | Efeito no jogador B |
|--------------|---------------------|
| `VITORIA` | DERROTA |
| `DERROTA` | VITORIA |
| `EMPATE` | EMPATE |

| Status | Descrição |
|--------|-----------|
| 200 | `"Resultado registrado e rankings atualizados."` |
| 400 | Inscrição não aprovada ou jogador contra si mesmo |
| 403 | Apenas o criador do torneio pode registrar resultados |
| 404 | Partida ou inscrição não encontrada |

---

### Atualizar fase da partida
`PUT /api/partidas/{id}` — **admin (criador do torneio)**

**Body:**
```json
{
  "faseTorneio": "Semifinal"
}
```

| Status | Descrição |
|--------|-----------|
| 200 | Partida atualizada |
| 403 | Apenas o criador do torneio pode editar |
| 404 | Partida não encontrada |

---

### Excluir partida e reverter Elo
`DELETE /api/partidas/{id}` — **admin (criador do torneio)**

Ao excluir, o Elo de ambos os jogadores é **revertido automaticamente**.

> Informe o resultado **original** da partida para que o Elo seja revertido corretamente.

**Body:**
```json
{
  "idInscricaoA": 1,
  "idInscricaoB": 2,
  "resultadoA": "VITORIA"
}
```

| Status | Descrição |
|--------|-----------|
| 200 | `"Partida excluída e rankings revertidos."` |
| 403 | Apenas o criador do torneio pode excluir |
| 404 | Partida ou inscrição não encontrada |

---

## Fluxo completo sugerido

```
1.  POST /api/usuarios/cadastro              → criar admin e jogadores
2.  POST /api/usuarios/login                 → obter token JWT
3.  POST /api/equipes                        → criar equipes (opcional)
4.  POST /api/jogos                          → cadastrar o jogo
5.  POST /api/torneios                       → criar torneio (criador vinculado pelo token)
6.  POST /api/inscricoes                     → inscrever jogadores (status: PENDENTE)
7.  PATCH /api/inscricoes/{id}/status        → aprovar inscrições
8.  POST /api/partidas                       → criar partida
9.  POST /api/partidas/{id}/resultado        → registrar resultado e atualizar Elo
10. GET  /api/inscricoes                     → consultar ranking geral
11. GET  /api/inscricoes/torneio/{id}        → ranking de um torneio específico
```
