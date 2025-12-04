# SIEM Dashboard - Interface de Visualização

Dashboard moderno e responsivo para visualização de logs de segurança analisados por IA, construído com Next.js 16 e React 19.

## 📋 Sobre o Projeto

Interface web profissional para visualização e análise de logs de segurança coletados pelo sistema SIEM. O dashboard consome dados da API SIEM e apresenta informações de ameaças, análises de IA e mapeamento MITRE ATT&CK de forma intuitiva e em tempo real.

## 🏗️ Arquitetura do Ecossistema Completo

```
┌─────────────────┐
│   Aplicação     │
│  + Middleware   │
└────────┬────────┘
         │ Coleta logs
         ▼
┌─────────────────┐
│   PostgreSQL    │
│   audit_logs    │
└────────┬────────┘
         │
         │ ◄──── Análise IA ────┐
         │                       │
         ▼                ┌──────┴──────┐
┌─────────────────┐      │Orquestrador │
│   PostgreSQL    │◄─────│  + Gemini   │
│ audit_analysis  │      └─────────────┘
└────────┬────────┘
         │
         │ Consulta agregada
         ▼
┌─────────────────┐
│   API SIEM      │
│   (Express)     │
└────────┬────────┘
         │ JSON REST
         ▼
┌─────────────────┐
│  SIEM Frontend  │  ◄─── Você está aqui
│   (Next.js)     │
└─────────────────┘
```

## 🚀 Funcionalidades

### 📊 Dashboard Principal
- **Cards estatísticos**: Total de logs, suspeitos e maliciosos
- **Atualização automática**: Refresh a cada 30 segundos via SWR
- **Filtros interativos**: Clique nos cards para filtrar por tipo

### 📋 Tabela de Logs
- **Visualização paginada**: 20 registros por página
- **Informações compactas**: Email, IP, tipo, status, ameaça, timestamp
- **Indicadores visuais**: Cores baseadas em threat_score
- **Ordenação**: Por data (mais recentes primeiro)

### 🔍 Modal de Detalhes
- **Informações completas**: Todos os campos do log + análise
- **Análise de IA**: Threat score, confiança, regra de detecção
- **MITRE ATT&CK**: Táticas e técnicas identificadas
- **Ações recomendadas**: Sugestões automáticas de resposta
- **Dados técnicos**: Headers, request body, métricas de performance

### 🎨 Design Moderno
- **Dark mode** por padrão
- **Tema personalizado** com Tailwind CSS + shadcn/ui
- **Responsivo**: Funciona em desktop, tablet e mobile
- **Ícones**: Lucide React para UI consistente

## 📦 Instalação

### Pré-requisitos

- Node.js 20+
- npm, yarn ou pnpm
- API SIEM rodando e acessível

### Passos

1. **Clone o repositório:**
```bash
git clone <url-do-repositorio>
cd siem-frontend
```

2. **Instale as dependências:**
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

3. **Configure a URL da API:**

Edite `utils/siem.ts`:
```typescript
export const API_BASE = "http://localhost:3000/api" // URL da sua API SIEM
```

Ou use variáveis de ambiente criando `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

E atualize `utils/siem.ts`:
```typescript
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api"
```

4. **Inicie o servidor de desenvolvimento:**
```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

5. **Acesse o dashboard:**
```
http://localhost:3000
```

## 🎯 Estrutura do Projeto

```
siem-frontend/
├── app/
│   ├── globals.css          # Estilos globais + variáveis CSS
│   ├── layout.tsx            # Layout raiz (dark mode, metadados)
│   └── page.tsx              # Página principal do dashboard
├── components/
│   ├── ui/                   # Componentes shadcn/ui
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── dialog.tsx
│   ├── SIEMHeader.tsx        # Cabeçalho do dashboard
│   ├── StatsCards.tsx        # Cards de estatísticas
│   ├── FilterHeader.tsx      # Barra de filtros
│   ├── LogsTable.tsx         # Tabela de logs
│   ├── Pagination.tsx        # Controles de paginação
│   └── LogDetailsModal.tsx   # Modal de detalhes completos
├── types/
│   └── siem.ts               # Tipos TypeScript
├── utils/
│   └── siem.ts               # Utilitários (API, cores, formatação)
├── lib/
│   └── utils.ts              # Utilitário cn() para Tailwind
├── public/                   # Assets estáticos
├── .env.local                # Variáveis de ambiente (não comitar)
├── next.config.js            # Configuração Next.js
├── tailwind.config.js        # Configuração Tailwind
├── tsconfig.json             # Configuração TypeScript
└── package.json              # Dependências
```

## 🔧 Tecnologias

### Core
- **Next.js 16**: Framework React com App Router
- **React 19**: Biblioteca UI (última versão)
- **TypeScript 5**: Tipagem estática

### UI/Estilo
- **Tailwind CSS 3.4**: Framework CSS utilitário
- **shadcn/ui**: Componentes pré-construídos (Radix UI)
- **Lucide React**: Biblioteca de ícones
- **class-variance-authority**: Gerenciamento de variantes CSS

### Dados
- **SWR 2.3**: Fetching de dados com cache e revalidação
- **React Hooks**: Estado e side-effects

### Qualidade
- **ESLint**: Linting
- **TypeScript**: Type checking

## 📊 Tipos de Dados

### DashboardStats
```typescript
{
  total_logs: number        // Total de logs coletados
  logs_suspeitos: number    // Logs com threat_score 1-49
  logs_maliciosos: number   // Logs com threat_score ≥ 50
}
```

### Log (Tabela)
```typescript
{
  id: number
  timestamp: string         // ISO 8601
  action: string           // Tipo de ação (login, register, etc)
  status: string           // Código HTTP
  email: string
  ip: string
  user_agent: string
  threat_score: number     // 0-100
  method?: string          // GET, POST, etc
  protocol?: string        // HTTP/1.1, HTTP/2
}
```

### LogDetails (Modal)
Inclui todos os campos de `Log` mais:
```typescript
{
  // Campos adicionais do log
  email_raw?: string
  headers?: Record<string, any>
  request_body?: string
  response_time?: number
  db_query_time?: number
  request_size?: number
  user_exists?: boolean
  error_message?: string
  
  // Análise de IA
  analysis?: {
    id: number
    threat_score: number
    confidence: string          // "0.85" = 85%
    detection_rule: string      // Nome da regra ativada
    priority: string            // "low" | "medium" | "high"
    mitre_matches: Array<{
      tactic: string            // "Credential Access"
      technique_id: string      // "T1110.001"
      technique_name: string    // "Password Guessing"
      rationale: string         // Explicação
    }>
    recommended_actions: string[]  // ["Rate-limit IP", ...]
    notes: string | null
  }
}
```

## 🎨 Sistema de Cores

### Threat Scores
```typescript
// LogsTable - Ícones e cores baseados em threat_score
threat_score >= 40  → Vermelho  (AlertTriangle)  // Malicioso
threat_score >= 15  → Amarelo   (AlertTriangle)  // Suspeito
threat_score <  15  → Azul      (Shield)         // Normal
```

### Status HTTP
```typescript
200-299  → Verde    // Sucesso
400-499  → Amarelo  // Erro do cliente
500+     → Vermelho // Erro do servidor
```

### Prioridade
```typescript
"high"   → Vermelho  // Ação imediata
"medium" → Amarelo   // Monitoramento
"low"    → Azul      // Informativo
```

## 🔄 Fluxo de Dados

### 1. Carregamento Inicial
```typescript
// app/page.tsx
const { data: stats } = useSWR('/api/dashboard/stats', fetcher)
const { data: logs } = useSWR('/api/logs?page=1&limit=20', fetcher)
```

### 2. Filtro por Card
```typescript
// Usuário clica em "Logs Maliciosos"
setSelectedType("malicious")
// → URL muda para /api/logs?tipo=maliciosos&page=1&limit=20
```

### 3. Detalhes do Log
```typescript
// Usuário clica em "Detalhes"
setSelectedLogId(1234)
// → Trigger fetch em /api/logs/1234
// → Modal abre com dados completos
```

### 4. Revalidação Automática
```typescript
// SWR revalida a cada 30 segundos
useSWR(url, fetcher, { refreshInterval: 30000 })
```

## 🚀 Build e Deploy

### Build Local
```bash
npm run build
npm start
```

### Variáveis de Ambiente (Produção)

Crie `.env.production`:
```env
NEXT_PUBLIC_API_BASE_URL=https://api-siem.example.com/api
```

### Deploy no Vercel

1. **Conecte seu repositório** no [Vercel Dashboard](https://vercel.com)

2. **Configure variáveis de ambiente:**
   - `NEXT_PUBLIC_API_BASE_URL` → URL da sua API SIEM

3. **Deploy automático** a cada push na branch main

### Deploy em Servidor próprio (Docker)

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/public ./public

ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_BASE_URL=http://api-siem:3000/api

EXPOSE 3000
CMD ["npm", "start"]
```

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  siem-frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_BASE_URL=http://api-siem:3001/api
    depends_on:
      - api-siem
    restart: unless-stopped

  api-siem:
    image: ghcr.io/seu-usuario/api-siem:latest
    ports:
      - "3001:3000"
    environment:
      - DATABASE_URL=postgresql://user:pass@postgres:5432/siem_db
    restart: unless-stopped
```

### Deploy com Nginx (Reverse Proxy)

```nginx
# /etc/nginx/sites-available/siem-dashboard
server {
    listen 80;
    server_name siem.example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## 🎨 Customização

### Cores do Tema

Edite `app/globals.css`:
```css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
  --primary: 221 83% 53%;  /* Azul customizado */
  /* ... outros valores */
}

.dark {
  --background: 222 47% 11%;  /* Fundo escuro customizado */
  /* ... outros valores */
}
```

### Adicionar Novos Filtros

Edite `types/siem.ts`:
```typescript
export type LogType = "collected" | "suspicious" | "malicious" | "critical"
```

Atualize `StatsCards.tsx` para incluir o novo card.

### Mudar Intervalo de Refresh

Edite `app/page.tsx`:
```typescript
useSWR(url, fetcher, { 
  refreshInterval: 60000  // 60 segundos ao invés de 30
})
```

## 🐛 Troubleshooting

### Erro: "Failed to fetch"
**Causa:** API SIEM não está acessível ou URL incorreta.

**Solução:**
1. Verifique se a API está rodando: `curl http://localhost:3000/api/dashboard/stats`
2. Confirme a URL em `utils/siem.ts`
3. Verifique CORS na API (deve permitir seu domínio frontend)

### Erro: CORS Policy
**Causa:** API não permite requisições do domínio do frontend.

**Solução na API SIEM:**
```javascript
// app.js
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000', // URL do seu frontend
  credentials: true
}));
```

### Logs não aparecem
**Causa:** Resposta da API em formato incorreto.

**Solução:**
1. Abra DevTools (F12) → Network
2. Verifique resposta de `/api/logs`
3. Confirme que retorna:
```json
{
  "logs": [...],
  "total": 100,
  "page": 1,
  "totalPages": 5
}
```

### Build falha: "Module not found"
**Causa:** Dependências não instaladas ou desatualizadas.

**Solução:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Dark mode não funciona
**Causa:** Classe `dark` não está no `<html>`.

**Solução:** Confirme em `app/layout.tsx`:
```typescript
<html lang="pt-BR" className="dark">
```

## 📈 Performance

### Otimizações Aplicadas

✅ **Server Components**: Usa React Server Components do Next.js 16  
✅ **SWR Cache**: Deduplica requisições e mantém cache  
✅ **Image Optimization**: Next.js otimiza imagens automaticamente  
✅ **Code Splitting**: Componentes carregados sob demanda  
✅ **Lazy Loading**: Modal só carrega quando aberto

### Melhorias Futuras

- [ ] Implementar **React Query** para cache mais granular
- [ ] Adicionar **Service Worker** para offline support
- [ ] Implementar **Virtual Scrolling** para tabelas grandes
- [ ] Adicionar **Prefetching** de páginas adjacentes
- [ ] Comprimir payloads com **gzip/brotli**

## 🧪 Testes

### Executar Linting
```bash
npm run lint
```

### Adicionar Testes (Sugestão)

**Instalar dependências:**
```bash
npm install -D @testing-library/react @testing-library/jest-dom jest-environment-jsdom
```

**Criar `jest.config.js`:**
```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
}
```

**Exemplo de teste:**
```typescript
// __tests__/components/StatsCards.test.tsx
import { render, screen } from '@testing-library/react'
import StatsCards from '@/components/StatsCards'

test('renders stats cards', () => {
  const stats = { total_logs: 100, logs_suspeitos: 20, logs_maliciosos: 5 }
  render(<StatsCards stats={stats} selectedType="all" onCardClick={() => {}} />)
  
  expect(screen.getByText('100')).toBeInTheDocument()
  expect(screen.getByText('20')).toBeInTheDocument()
  expect(screen.getByText('5')).toBeInTheDocument()
})
```

## 📝 Roadmap

- [ ] **Filtros avançados**: Por IP, data, tipo de ação
- [ ] **Gráficos**: Timeline, distribuição de ameaças
- [ ] **Exportação**: CSV, JSON, PDF
- [ ] **Notificações**: Alertas em tempo real (WebSocket)
- [ ] **Multi-tenant**: Suporte a múltiplas organizações
- [ ] **Testes**: Cobertura com Jest + React Testing Library
- [ ] **i18n**: Suporte a múltiplos idiomas

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit suas mudanças: `git commit -m 'Adiciona nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT.

---

**Stack Completo:**
- **Frontend**: Next.js 16 + React 19 + TypeScript
- **API**: Express + PostgreSQL
- **Análise**: Python + Google Gemini AI
- **Coleta**: Middleware custom

**Desenvolvido com ❤️ para análise de segurança moderna**
