# Rank It Up! — Plataforma de Torneios de Esports

Sistema completo para criação e gerenciamento de torneios competitivos com ranking ELO, inscrições, partidas e administração.

## Stack Tecnológica

**Backend:**
- Java 21 + Spring Boot 3.4.x
- Spring Security 6 + JWT
- Spring Data JPA + Hibernate
- MySQL 8 (Docker)
- Maven

**Frontend:**
- React 19 + Vite 5
- React Router 6
- Tailwind CSS (via CSS variables)
- Context API para estado global

**Infraestrutura:**
- Docker + Docker Compose
- Nginx (frontend production)

---

## Estrutura do Projeto

```
ProjetoSemestralBRAOOB/
├── backend/                 # Spring Boot API
│   ├── src/main/java/com/rankitup/backend/
│   │   ├── controller/      # REST controllers
│   │   ├── service/         # Business logic
│   │   ├── repository/      # JPA repositories
│   │   ├── model/           # Entities & enums
│   │   ├── dto/             # Data transfer objects
│   │   ├── security/        # JWT, filters, config
│   │   ├── config/          # Security, CORS
│   │   └── exception/       # Global exception handler
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── db/migration/    # Flyway (se usar)
│   ├── pom.xml
│   └── Dockerfile
├── frontend/                # React + Vite
│   ├── src/
│   │   ├── pages/           # Page components
│   │   ├── components/      # Reusable components
│   │   ├── context/         # React Context (Auth)
│   │   ├── services/        # API client
│   │   ├── styles/          # Global CSS variables
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.ts
│   ├── nginx.conf
│   └── Dockerfile
├── docker-compose.yml
└── seed.sql                 # Dados iniciais (10 jogos, 6 torneios, usuários teste)
```

---

## Como Rodar

### Pré-requisitos
- Docker Desktop rodando
- Java 21 (opcional, para dev local sem Docker)
- Node 20+ (opcional, para dev local sem Docker)

### Opção 1: Docker Compose (Recomendado)

```bash
cd ProjetoSemestralBRAOOB
docker-compose up -d
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:8080
- MySQL: localhost:3306 (user: root, pass: 3132, db: rankitup_db)

> **Nota:** O seed.sql roda automaticamente na primeira inicialização do container MySQL.

### Opção 2: Desenvolvimento Local

**Backend:**
```bash
cd backend
./mvnw spring-boot:run
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## Credenciais de Teste (do seed.sql)

| Role | Email | Senha |
|------|-------|-------|
| Admin | admin@rankitup.com | 123456 |
| Admin | admin2@rankitup.com | 123456 |
| User | joao@email.com | 123456 |
| User | maria@email.com | 123456 |
| User | pedro@email.com | 123456 |
| User | ana@email.com | 123456 |
| User | lucas@email.com | 123456 |
| User | julia@email.com | 123456 |
| User | rafael@email.com | 123456 |
| User | camila@email.com | 123456 |
| User | bruno@email.com | 123456 |

---

## Principais Endpoints (API)

### Autenticação
- `POST /api/usuarios/cadastro` — Registro público
- `POST /api/usuarios/login` — Login (retorna JWT)

### Usuários (requer token)
- `GET /api/usuarios` — Listar todos (ADMIN)
- `GET /api/usuarios/{id}` — Buscar por ID
- `PUT /api/usuarios/{id}` — Atualizar (próprio ou ADMIN)
- `DELETE /api/usuarios/{id}` — Excluir (ADMIN)

### Jogos
- `GET /api/jogos` — Listar todos (público)
- `POST /api/jogos` — Criar (ADMIN)

### Torneios
- `GET /api/torneios` — Listar todos (público)
- `GET /api/torneios/{id}` — Detalhes
- `POST /api/torneios` — Criar (ADMIN)

### Inscrições
- `GET /api/inscricoes` — Listar (público)
- `POST /api/inscricoes` — Inscrever (ADMIN - fluxo simplificado)

### Equipes
- `GET /api/equipes` — Listar (público)
- `POST /api/equipes` — Criar

### Partidas (ADMIN)
- `GET /api/partidas` — Listar
- `POST /api/partidas` — Criar
- `POST /api/partidas/{id}/resultado` — Atualizar resultado
- `PUT /api/partidas/{id}` — Atualizar fase

---

## Variáveis de Ambiente

### Backend (`application.properties` / Docker env)
```properties
SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/rankitup_db
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=3132
JWT_SECRET=rankitup-chave-secreta-super-longa-para-hmac-sha256-2026
JWT_EXPIRATION=86400000
```

### Frontend (`vite.config.ts` / Docker env)
```env
VITE_API_URL=http://localhost:8080
```

---

## Funcionalidades Implementadas

- ✅ Autenticação JWT com roles (ADMIN, USER)
- ✅ Cadastro/Login com validação
- ✅ CRUD de Jogos (com imagens/banners reais Steam/CDN)
- ✅ CRUD de Torneios (5 formatos: eliminação simples/dupla, suíço, liga, grupos+eliminação)
- ✅ Inscrições em torneios
- ✅ Sistema de Equipes
- ✅ Ranking ELO por jogo
- ✅ Geração de chaves (brackets)
- ✅ Partidas com resultado
- ✅ Dashboard do usuário
- ✅ Painel Admin
- ✅ UI responsiva com tema dark + animações CSS
- ✅ Fundo animado (grid + partículas + glow)

---

## Próximos Passos / TODO

- [ ] WebSockets para atualizações em tempo real
- [ ] Notificações (email/push)
- [ ] Sistema de chat nos torneios
- [ ] Upload de imagens (S3/local)
- [ ] Testes automatizados (JUnit, React Testing Library)
- [ ] CI/CD (GitHub Actions)
- [ ] Documentação Swagger/OpenAPI

---

## Licença

Projeto acadêmico — BRAAOOB (Semestre 2026)