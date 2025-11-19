# Testes End-to-End com Cypress

Este diretório contém os testes E2E automatizados para a Biblioteca Digital.

## 📋 Sumário dos Testes

### Teste 1: Autenticação de Usuários
**Arquivo:** `1-authentication.cy.js`

Verifica o sistema de autenticação completo:
- ✅ Login de administrador
- ✅ Login de usuário normal
- ✅ Bloqueio de acesso à página admin para usuários normais
- ✅ Validação de credenciais inválidas

**Credenciais configuráveis:**
```javascript
const ADMIN_CREDENTIALS = {
  email: 'admin@teste.com',
  password: 'admin123'
};

const USER_CREDENTIALS = {
  email: 'usuario@teste.com',
  password: 'usuario123'
};
```

### Teste 2: Busca de Artigo sem Login e Redirecionamento
**Arquivo:** `2-article-search-redirect.cy.js`

Verifica o fluxo de busca e autenticação:
- ✅ Busca de artigo sem estar logado
- ✅ Redirecionamento para login ao clicar em artigo
- ✅ Redirecionamento para o artigo após login bem-sucedido
- ✅ Indicação visual de "Faça login para acessar"

**Configurações:**
```javascript
const SEARCH_TERM = 'artigo'; // Ajuste conforme seus dados
```

### Teste 3: Upload de Arquivo BibTeX
**Arquivo:** `3-bibtex-upload.cy.js`

Verifica o upload de arquivos BibTeX:
- ✅ Upload de arquivo `.bib`
- ✅ Upload de arquivo `.zip`
- ✅ Verificação de artigos criados após upload

**Arquivos utilizados:**
- `TesteBibTex/ArquivosBibText.bib`
- `TesteBibTex/Hist4.zip`

### Teste 4: Administrador Cria Usuário
**Arquivo:** `4-admin-create-user.cy.js`

Verifica a criação de usuários por admin:
- ✅ Criação de usuário normal
- ✅ Login com novo usuário
- ✅ Bloqueio de acesso admin para usuário normal
- ✅ Criação de usuário com permissões admin

**Nota:** Os emails são gerados automaticamente com timestamp para evitar duplicação.

## 🚀 Como Executar os Testes

### Pré-requisitos

1. **Instalar Cypress** (caso ainda não tenha instalado):
```powershell
cd biblioteca-digital-web-frontend
npm install --save-dev cypress
```

2. **Garantir que o backend está rodando:**
```powershell
cd biblioteca-digital-backend
npm run dev
```

3. **Garantir que o frontend está rodando:**
```powershell
cd biblioteca-digital-web-frontend
npm run dev
```

### Executar Testes

#### Abrir interface do Cypress (modo interativo):
```powershell
cd biblioteca-digital-web-frontend
npm run cypress:open
```

#### Executar todos os testes (modo headless):
```powershell
npm run test:e2e
```

#### Executar testes com visualização:
```powershell
npm run test:e2e:headed
```

#### Executar em navegador específico:
```powershell
npm run test:e2e:chrome
```

#### Executar teste específico:
```powershell
npx cypress run --spec "cypress/e2e/1-authentication.cy.js"
```

## ⚙️ Configuração

### Editar Credenciais

Cada arquivo de teste possui uma seção no topo marcada como:

```javascript
// ============================================
// CREDENCIAIS - EDITE AQUI SE NECESSÁRIO
// ============================================
```

Edite os valores conforme necessário para seu ambiente de teste.

### Configuração do Cypress

O arquivo `cypress.config.js` contém as configurações gerais:
- **baseUrl:** `http://localhost:5173` (porta do Vite)
- **viewport:** 1280x720
- **video:** Habilitado
- **screenshots:** Habilitados em caso de falha

## 📁 Estrutura de Arquivos

```
cypress/
├── e2e/
│   ├── 1-authentication.cy.js          # Teste de autenticação
│   ├── 2-article-search-redirect.cy.js # Teste de busca e redirecionamento
│   ├── 3-bibtex-upload.cy.js          # Teste de upload BibTeX
│   └── 4-admin-create-user.cy.js      # Teste de criação de usuário
├── support/
│   ├── commands.js                     # Comandos customizados
│   └── e2e.js                         # Configuração global
└── .eslintrc.json                     # Configuração ESLint para Cypress
```

## 🔧 Comandos Customizados

### cy.login(email, password)
Faz login automaticamente:
```javascript
cy.login('admin@teste.com', 'admin123');
```

### cy.logout()
Faz logout limpando o armazenamento:
```javascript
cy.logout();
```

### cy.checkLoggedIn()
Verifica se o usuário está logado:
```javascript
cy.checkLoggedIn();
```

## 📊 Resultados dos Testes

Após a execução, os resultados estarão disponíveis em:
- **Vídeos:** `cypress/videos/`
- **Screenshots:** `cypress/screenshots/` (apenas em falhas)

## ⚠️ Notas Importantes

1. **Ordem de Execução:** Os testes são independentes e podem ser executados em qualquer ordem.

2. **Dados de Teste:** Certifique-se de que o banco de dados possui:
   - Um usuário administrador com as credenciais configuradas
   - Um usuário normal com as credenciais configuradas
   - Artigos disponíveis para busca

3. **Arquivos BibTeX:** Os arquivos devem estar na pasta `TesteBibTex` na raiz do projeto:
   - `ArquivosBibText.bib`
   - `Hist4.zip`

4. **Portas:** Certifique-se de que as portas corretas estão configuradas:
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:3333`

5. **Ambiente Limpo:** Cada teste limpa o localStorage e cookies antes de executar para garantir isolamento.

## 🐛 Troubleshooting

### Teste falha ao buscar artigos
- Verifique se há artigos no banco de dados
- Ajuste a constante `SEARCH_TERM` para um termo que retorne resultados

### Teste de upload falha
- Verifique se os arquivos existem em `TesteBibTex/`
- Verifique os logs do backend para erros de processamento
- Certifique-se de que a pasta `uploads/` tem permissões de escrita

### Usuário não consegue fazer login
- Verifique se o usuário existe no banco de dados
- Confirme que as credenciais estão corretas nos arquivos de teste
- Verifique os logs do backend para erros de autenticação

### Testes não encontram elementos
- Verifique se o frontend está rodando na porta correta
- Aguarde um pouco mais adicionando `cy.wait()` se necessário
- Use `cy.debug()` para pausar a execução e inspecionar

## 📝 Manutenção dos Testes

Para manter os testes atualizados:

1. **Ao mudar seletores HTML:** Atualize os seletores nos testes
2. **Ao mudar rotas:** Atualize as URLs esperadas
3. **Ao adicionar novos recursos:** Crie novos arquivos de teste seguindo o padrão existente

## 📞 Suporte

Se encontrar problemas com os testes, verifique:
1. Logs do console do navegador (visível no Cypress)
2. Logs do backend
3. Screenshots e vídeos gerados pelo Cypress
