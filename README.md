# 📚 Biblioteca Digital

Sistema completo de gerenciamento de biblioteca digital para artigos acadêmicos, desenvolvido como projeto da disciplina de Engenharia de Software. O sistema oferece funcionalidades avançadas de upload de PDFs, processamento de arquivos BibTeX, sistema de notificações por email e controle granular de acesso.

## 👥 Equipe de Desenvolvimento

- **Ana Paula** - Full stack
- **Ravi** - Full stack
- **Vanessa** - Full stack

## 🎯 Objetivos do Projeto

Este sistema foi desenvolvido para atender às necessidades de:

- Pesquisadores que precisam organizar e compartilhar artigos
- Administradores de eventos acadêmicos
- Usuários que desejam receber notificações sobre novos artigos
- Comunidade acadêmica que necessita de acesso fácil a publicações

## 🏗️ Arquitetura do Sistema

### Diagrama de Pacotes

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'background': '#ffffff', 'primaryColor': '#ffffff', 'primaryTextColor': '#000000', 'primaryBorderColor': '#000000', 'lineColor': '#000000', 'secondaryColor': '#ffffff', 'tertiaryColor': '#ffffff'}}}%%
flowchart TD
    subgraph "Frontend"
        FP[Pages]
        FC[Components]
        FH[Hooks/Query]
        FS[Services/API]
        FST[Stores]
        FR[Routes]

        FP --> FC
        FP --> FH
        FH --> FS
        FP --> FST
        FR --> FP
    end

    subgraph "Backend"
        subgraph "PresentationLayer"
            R[Routes]
            MW[Middleware]
        end

        subgraph "BusinessLayer"
            CT[Controllers]
            SV[Services]
            VAL[Validators]
        end

        subgraph "DataLayer"
            M[Models]
            DB[(MongoDB)]
        end

        subgraph "Infrastructure"
            CFG[Config]
            UT[Utils]
            ERR[Error Handlers]
        end
    end

    subgraph "ExternalServices"
        EMAIL[Email Service]
        FS_STORAGE[File System]
    end

    %% Frontend to Backend
    FS --> R

    %% Backend Flow
    R --> MW
    MW --> CT
    CT --> VAL
    CT --> SV
    SV --> M
    M --> DB

    %% Infrastructure connections
    CT --> ERR
    SV --> UT
    MW --> CFG

    %% External connections
    SV --> EMAIL
    SV --> FS_STORAGE

    %% Styling
    classDef frontend fill:#e1f5fe
    classDef backend fill:#f3e5f5
    classDef database fill:#e8f5e8
    classDef external fill:#fff3e0

    class FP,FC,FH,FS,FST,FR frontend
    class R,MW,CT,SV,VAL,M,CFG,UT,ERR backend
    class DB database
    class EMAIL,FS_STORAGE external
```

### Diagrama de Sequência - Upload em Massa de Artigos

```mermaid
sequenceDiagram
    participant U as Admin
    participant F as Frontend
    participant MW as Middleware
    participant BC as BulkController
    participant BS as BulkService
    participant AS as ArticleService
    participant ES as EmailService
    participant DB as MongoDB

    Note over U,F: Seleção de Arquivos
    U->>F: Seleciona BibTeX + ZIP
    U->>F: Clica Upload em Massa

    Note over F,MW: Validação e Autenticação
    F->>MW: POST /bulk-articles
    MW->>MW: Verifica JWT
    MW->>MW: Verifica Admin
    MW->>MW: Processa upload
    MW->>BC: Arquivos validados

    Note over BC,BS: Processamento em Massa
    BC->>BC: Valida tipos de arquivo
    BC->>BS: processBulkUpload(bibtex, zip)
    BS->>BS: Parse arquivo BibTeX
    BS->>BS: Extrai arquivos do ZIP
    BS->>BS: Combina PDFs com artigos

    Note over BS,DB: Criação dos Artigos
    loop Para cada artigo válido
        BS->>AS: create(articleData)
        AS->>DB: Salvar artigo
        DB-->>AS: Artigo criado
        AS->>ES: Enviar notificação
        ES->>ES: Buscar emails cadastrados
        ES->>ES: Enviar email
        ES-->>AS: Email enviado
        AS-->>BS: Artigo processado
    end

    Note over BS,F: Resultado Final
    BS->>BS: Gerar relatório
    BS-->>BC: Estatísticas processamento
    BC-->>F: JSON com resultados
    F->>F: Exibir toast sucesso
    F-->>U: Mostrar estatísticas
```

### Diagrama de Sequência - Busca e Visualização de Artigos

```mermaid
sequenceDiagram
    participant U as Usuário
    participant F as Frontend
    participant API as Backend
    participant DB as MongoDB

    U->>F: Digita termo busca
    F->>F: Debounce 500ms
    F->>API: GET /article/search

    API->>DB: Busca regex em artigos
    DB-->>API: Lista de resultados
    API-->>F: JSON artigos

    F->>F: Renderiza cards
    U->>F: Clica "Ver Detalhes"
    F->>F: Navega /article/:id

    F->>API: GET /article/:id
    API->>DB: Busca artigo + populate
    DB-->>API: Dados completos
    API-->>F: JSON artigo

    F->>F: Exibe detalhes
    U->>F: Clica "Download PDF"
    F->>API: GET /article/:id/download
    API-->>F: Arquivo PDF
    F->>F: Download automático
```

## 🚀 Funcionalidades Principais

### 👨‍💼 Para Administradores

- **Gerenciamento Completo de Eventos**: Criar, editar e excluir eventos acadêmicos
- **Gestão de Edições**: Organizar edições por ano e local de cada evento
- **Upload Individual de Artigos**: Cadastro manual com upload de PDF
- **Upload em Massa**: Processamento de arquivos BibTeX + ZIP com múltiplos PDFs
- **Gerenciamento de Usuários**: Criar e administrar contas de usuário
- **Dashboard Administrativo**: Interface completa para gestão do sistema

### 👤 Para Usuários

- **Sistema de Busca Avançada**: Pesquisa por título, autor e nome de evento
- **Navegação Intuitiva**: Páginas dedicadas para eventos, edições e artigos
- **Perfil Personalizado**: Visualização dos próprios artigos organizados por ano
- **Download de PDFs**: Acesso direto aos arquivos dos artigos
- **Sistema de Notificações**: Cadastro para receber emails sobre novos artigos

### 🔧 Funcionalidades Técnicas

- **Autenticação JWT**: Sistema seguro de login/logout
- **Controle de Acesso**: Operações administrativas protegidas
- **Validação Rigorosa**: Verificação de integridade de dados
- **Upload Seguro**: Validação de tipos de arquivo e tamanho
- **Sistema de Email**: Notificações automáticas via SMTP
- **Processamento BibTeX**: Parser avançado para importação em massa

## 🛠️ Stack Tecnológica

### Frontend

- **React 18** com Hooks
- **React Router** para roteamento
- **Styled Components** para estilização
- **React Hook Form** para formulários
- **React Query** para gerenciamento de estado
- **Framer Motion** para animações
- **Lucide React** para ícones

### Backend

- **Node.js** com Express.js
- **MongoDB** com Mongoose ODM
- **JWT** para autenticação e autorização
- **Multer** para upload e processamento de arquivos
- **Zod** para validação de schemas
- **Bcrypt** para hash de senhas
- **Nodemailer** para envio de emails
- **BibTeX Parser** para processamento de arquivos acadêmicos
- **Winston** para logging e monitoramento

### Ferramentas de Desenvolvimento

- **Vite** para build e desenvolvimento do frontend
- **ESLint** para análise estática de código
- **Prettier** para formatação automática
- **React Query** para cache e sincronização de dados
- **Zustand** para gerenciamento de estado global

## 📁 Estrutura do Projeto

```
biblioteca-digital/
├── biblioteca-digital-backend/
│   ├── src/
│   │   ├── controllers/     # Controladores da API
│   │   ├── services/        # Lógica de negócio
│   │   ├── models/          # Modelos do MongoDB
│   │   ├── routes/          # Definição das rotas
│   │   ├── middleware/      # Middlewares personalizados
│   │   ├── validators/      # Validadores de entrada
│   │   ├── config/          # Configurações do sistema
│   │   └── utils/           # Utilitários gerais
│   └── uploads/             # Armazenamento de arquivos
├── biblioteca-digital-web-frontend/
│   ├── src/
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── pages/           # Páginas da aplicação
│   │   ├── hooks/           # Hooks personalizados
│   │   ├── services/        # Serviços de API
│   │   ├── stores/          # Gerenciamento de estado
│   │   └── styles/          # Estilos globais
│   └── public/              # Arquivos públicos
```

## 🔧 Configuração e Execução

### Pré-requisitos

- **Node.js** 18+
- **MongoDB** (local ou Atlas)
- **Yarn** (recomendado) ou **npm**
- **Git** para controle de versão

> 💡 **Recomendamos usar Yarn** para gerenciamento de dependências, pois é mais rápido e confiável.

### Configuração do Backend

1. **Navegue para o diretório do backend:**

```bash
cd biblioteca-digital-backend
```

2. **Instale as dependências:**

```bash
npm install
# ou
yarn
```

3. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env` com:

```env
MONGODB_URI=mongodb://localhost:27017/biblioteca-digital
JWT_SECRET=sua_chave_secreta_jwt
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_app_gmail
PORT=3333
```

4. **Inicie o servidor:**

```bash
npm start
# ou para desenvolvimento
npm run dev
# ou com yarn
yarn start
# ou para desenvolvimento com yarn
yarn dev
```

O backend estará rodando em `http://localhost:3333`

### Configuração do Frontend

1. **Navegue para o diretório do frontend:**

```bash
cd biblioteca-digital-web-frontend
```

2. **Instale as dependências:**

```bash
npm install
# ou
yarn
```

3. **Configure a URL da API:**
   Verifique o arquivo `src/services/api/index.js` e ajuste a baseURL se necessário.

4. **Inicie o servidor de desenvolvimento:**

```bash
npm run dev
# ou
yarn dev
```

O frontend estará acessível em `http://localhost:5173`

### 📋 Scripts Disponíveis

#### Backend

```bash
# NPM
npm start          # Inicia servidor em produção
npm run dev        # Desenvolvimento com nodemon
npm run lint       # Verificação de código

# Yarn (Recomendado)
yarn start         # Inicia servidor em produção
yarn dev           # Desenvolvimento com nodemon
yarn lint          # Verificação de código
```

#### Frontend

```bash
# NPM
npm run dev        # Servidor de desenvolvimento
npm run build      # Build para produção
npm run preview    # Preview da build
npm run lint       # Verificação de código

# Yarn (Recomendado)
yarn dev           # Servidor de desenvolvimento
yarn build         # Build para produção
yarn preview       # Preview da build
yarn lint          # Verificação de código
```

#### Adicionando Novas Dependências

```bash
# NPM
npm install <pacote>
npm install -D <pacote-dev>

# Yarn (Recomendado)
yarn add <pacote>
yarn add -D <pacote-dev>
```

## 🗃️ Estrutura do Banco de Dados

### Coleções Principais

- **Users**: Usuários do sistema (admins e usuários comuns)
- **Events**: Eventos acadêmicos (congressos, simpósios, etc.)
- **Editions**: Edições específicas de cada evento por ano
- **Articles**: Artigos acadêmicos com metadados e PDFs
- **UserSessionTokens**: Tokens de sessão para autenticação
- **EmailNotifications**: Cadastros para notificações por email

## 🔐 Sistema de Autenticação

O sistema utiliza **JWT (JSON Web Tokens)** para autenticação:

- Tokens são gerados no login e armazenados no frontend
- Middleware `verifyJWT` valida tokens em rotas protegidas
- Middleware `verifyAdmin` restringe acesso a funcionalidades administrativas
- Sistema de refresh token para sessões longas

## 📧 Sistema de Notificações

- **Cadastro voluntário** para receber notificações
- **Notificações automáticas** quando novos artigos são publicados
- **Matching inteligente** entre nomes de autores e cadastros
- **Templates personalizados** de email
- **Sistema de ativação/desativação** de notificações

## 🎨 Design System

O projeto implementa um design system consistente com:

- **Paleta de cores** personalizada com tons de azul
- **Tipografia** responsiva e acessível
- **Componentes reutilizáveis** com Styled Components
- **Animações suaves** com Framer Motion
- **Layout responsivo** para todos os dispositivos

## 🧪 Testes End-to-End

O projeto inclui **4 testes E2E completos e 100% automatizados** usando **Cypress**:

### 📋 Testes Implementados

1. **Autenticação de Usuários** - Login de admin/usuário normal e controle de acesso
2. **Busca de Artigo sem Login** - Redirecionamento para login e acesso ao artigo
3. **Upload de Arquivo BibTeX** - Upload de arquivos .bib e .zip
4. **Criação de Usuário por Admin** - Admin cria e gerencia usuários

### 🚀 Executar Testes

**Opção 1 - Script Automatizado (Recomendado):**

```powershell
.\run-e2e-tests.ps1
```

**Opção 2 - Interface Cypress:**

```powershell
cd biblioteca-digital-web-frontend
npm run cypress:open
```

**Opção 3 - Terminal (Headless):**

```powershell
cd biblioteca-digital-web-frontend
npm run test:e2e
```

### 📚 Documentação dos Testes

- **[RESUMO_TESTES_E2E.md](./RESUMO_TESTES_E2E.md)** - Resumo executivo dos testes
- **[TESTES_E2E_DOCUMENTACAO.md](./TESTES_E2E_DOCUMENTACAO.md)** - Documentação completa
- **[QUICK_START_TESTS.md](./biblioteca-digital-web-frontend/QUICK_START_TESTS.md)** - Guia rápido
- **[INSTALACAO_TESTES.md](./INSTALACAO_TESTES.md)** - Instruções de instalação

### ⚙️ Pré-requisitos para Testes

```powershell
# Instalar Cypress
cd biblioteca-digital-web-frontend
npm install --save-dev cypress eslint-plugin-cypress
```

Certifique-se de ter:

- Backend rodando em `http://localhost:3333`
- Frontend rodando em `http://localhost:5173`
- Usuário admin: `admin@teste.com` / `admin123`
- Usuário normal: `usuario@teste.com` / `usuario123`

## 📊 Documentação Adicional

Este repositório inclui documentação complementar:

- **[BACKLOG_SPRINT.md](./BACKLOG_SPRINT.md)** - Backlog detalhado da sprint com histórias de usuário
- **[RELATORIO_USO_IA.md](./RELATORIO_USO_IA.md)** - Relatório sobre uso de IA no desenvolvimento
- **[DIAGRAMAS_UML.md](./DIAGRAMAS_UML.md)** - Diagramas UML do sistema (Classe, Sequência, Pacotes)

## 🤝 Contribuindo

Este é um projeto acadêmico, mas sugestões e melhorias são bem-vindas:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto foi desenvolvido para fins acadêmicos como parte do curso de Engenharia de Software. O código está disponível sob licença MIT para fins educacionais.
