# Setup Windows Nativo (Sem Docker)

Este guia é para rodar o projeto **direto no Windows** (IntelliJ + MySQL + Node) — sem containers.

---

## Pré-requisitos no Windows

| Ferramenta | Versão | Verificar |
|------------|--------|-----------|
| Java | 21 (LTS) | `java -version` |
| Maven | 3.9+ | `mvn -version` |
| Node.js | 20+ | `node --version` |
| npm | 10+ | `npm --version` |
| MySQL | 8.0+ | `mysql --version` |
| IntelliJ IDEA | Ultimate/Community | - |

---

## 1. Banco de Dados (MySQL)

```powershell
# Criar database e usuário (se não existir)
mysql -u root -p
# No MySQL:
CREATE DATABASE IF NOT EXISTS rankitup_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
# O usuário root com senha '3132' já deve existir (padrão do projeto)
exit
```

**Rodar seed (dados iniciais):**
```powershell
cd C:\Users\Lucas\Projetos\ProjetoSemestralBRAOOB
mysql -u root -p3132 rankitup_db < seed.sql
```

---

## 2. Backend (Spring Boot)

### application.properties (Windows)
O arquivo já está configurado para `localhost:3306` — **não precisa mudar**.

```properties
# backend/src/main/resources/application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/rankitup_db?createDatabaseIfNotExist=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=3132
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect

jwt.secret=rankitup-chave-secreta-super-longa-para-hmac-sha256-2026
jwt.expiration=86400000
spring.jackson.serialization.fail-on-empty-beans=false
```

### Rodar no IntelliJ
1. Abra a pasta `backend` como projeto Maven
2. Aguarde download de dependências
3. Run `RankitupApplication` (classe main)
4. API sobe em `http://localhost:8080`

### Ou via terminal:
```powershell
cd C:\Users\Lucas\Projetos\ProjetoSemestralBRAOOB\backend
.\mvnw.cmd spring-boot:run
```

---

## 3. Frontend (React + Vite)

### Configuração já feita:
- `vite.config.js` tem **proxy `/api` → `http://localhost:8080`**
- `api.js` usa `API_BASE_URL = 'http://localhost:8080'` (mas o proxy do Vite intercepta)

### Rodar:
```powershell
cd C:\Users\Lucas\Projetos\ProjetoSemestralBRAOOB\frontend
npm install
npm run dev
```
Frontend abre em `http://localhost:5173`

---

## 4. Fluxo de Trabalho (Git Sync)

### No Mac (OpenClaw / edição de código):
```bash
cd /Users/lucasmilani/documentos/ProjetoSemestralBRAOOB
# Edita arquivos...
git add -A && git commit -m "sua mensagem" && git push origin main
```

### No Windows (AnyDesk / execução):
```powershell
cd C:\Users\Lucas\Projetos\ProjetoSemestralBRAOOB
git pull origin main

# Se mudou backend:
.\mvnw.cmd clean compile  # ou só re-run no IntelliJ

# Se mudou frontend:
cd frontend && npm install && npm run dev
```

---

## 5. Portas Resumo

| Serviço | Porta | URL |
|---------|-------|-----|
| Frontend (Vite) | 5173 | http://localhost:5173 |
| Backend (Spring) | 8080 | http://localhost:8080 |
| MySQL | 3306 | localhost:3306 |

---

## 6. Credenciais de Teste (seed.sql)

| Perfil | Email | Senha |
|--------|-------|-------|
| Admin | admin@rankitup.com | 123456 |
| Admin 2 | admin2@rankitup.com | 123456 |
| Jogador | joao@email.com | 123456 |
| Jogador | maria@email.com | 123456 |
| Jogador | pedro@email.com | 123456 |
| Jogador | ana@email.com | 123456 |
| Jogador | lucas@email.com | 123456 |
| Jogador | julia@email.com | 123456 |
| Jogador | rafael@email.com | 123456 |
| Jogador | camila@email.com | 123456 |
| Jogador | bruno@email.com | 123456 |

---

## 7. Troubleshooting

### CORS Error
- Backend `SecurityConfig.java` já libera `http://localhost:5173` e `http://localhost:3000`
- Proxy do Vite resolve no dev (browser chama `/api` → Vite → `localhost:8080`)

### "Erro de conexão. Verifique se o backend está rodando."
- Confirme se Spring Boot subiu na porta 8080
- Teste: `curl http://localhost:8080/api/jogos`

### MySQL connection refused
- Serviço MySQL rodando? (`services.msc` → MySQL80)
- Porta 3306 livre?
- User `root` / senha `3132` corretos?

### Frontend não carrega dados
- Abra DevTools (F12) → Network → veja se chamadas `/api/...` voltam 200
- Se voltam 304/404 → proxy não tá funcionando → reinicie `npm run dev`

---

## 8. Scripts Úteis (PowerShell)

```powershell
# Atualizar tudo e rodar backend
function Sync-Run {
    cd C:\Users\Lucas\Projetos\ProjetoSemestralBRAOOB
    git pull origin main
    cd backend
    .\mvnw.cmd spring-boot:run
}

# Atualizar tudo e rodar frontend
function Sync-Frontend {
    cd C:\Users\Lucas\Projetos\ProjetoSemestralBRAOOB
    git pull origin main
    cd frontend
    npm install
    npm run dev
}

# Rodar seed do banco
function Seed-DB {
    cd C:\Users\Lucas\Projetos\ProjetoSemestralBRAOOB
    mysql -u root -p3132 rankitup_db < seed.sql
}
```

---

## 9. Arquivos que NÃO precisam no Windows (podem ignorar)

| Arquivo/Pasta | Motivo |
|---------------|--------|
| `docker-compose.yml` | Só para Docker |
| `backend/Dockerfile` | Só para Docker |
| `frontend/Dockerfile` | Só para Docker |
| `frontend/nginx.conf` | Só para Docker (produção) |
| `.github/` | CI/CD (opcional) |
| `backend_updated.7z` | Backup antigo |
| `Elicitação de Requisitos.pdf` | Doc do projeto |
| `SETUP_SUMMARY.md` | Resumo antigo |
| `rankitup-api-docs.md` | Doc da API |

---

## 10. Checklist Rápido

- [ ] MySQL rodando na porta 3306
- [ ] Database `rankitup_db` existe
- [ ] `seed.sql` rodou sem erros
- [ ] Backend Spring Boot rodando na 8080
- [ ] `curl http://localhost:8080/api/jogos` retorna JSON
- [ ] Frontend `npm run dev` rodando na 5173
- [ ] Abre `http://localhost:5173` no browser
- [ ] Login funciona (admin@rankitup.com / 123456)
- [ ] Navega para /tournaments, /games, /teams sem erro