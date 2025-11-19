# ✅ Checklist de Validação - Testes E2E

Use este checklist para garantir que tudo está configurado corretamente antes de executar os testes.

## 📋 Pré-execução

### 1. Instalação do Cypress
- [ ] Cypress instalado (`npm install --save-dev cypress`)
- [ ] eslint-plugin-cypress instalado (`npm install --save-dev eslint-plugin-cypress`)
- [ ] Comando `npx cypress --version` retorna a versão

### 2. Backend Configurado
- [ ] Backend rodando em `http://localhost:3333`
- [ ] MongoDB conectado e acessível
- [ ] Variáveis de ambiente configuradas (`.env`)
- [ ] Endpoint `/biblitoeca-digital-api/health` responde (se existir)

### 3. Frontend Configurado
- [ ] Frontend rodando em `http://localhost:5173`
- [ ] Conexão com backend funcionando
- [ ] Página home acessível
- [ ] Página de login acessível

### 4. Usuários no Banco de Dados

#### Usuário Admin
- [ ] Email: `ravihector2@gmail.com`
- [ ] Senha: `pamonha`
- [ ] Campo `isAdmin`: `true`
- [ ] Login funciona manualmente

#### Usuário Normal
- [ ] Email: `rian@dharma.com.br`
- [ ] Senha: `pamonha`
- [ ] Campo `isAdmin`: `false`
- [ ] Login funciona manualmente

### 5. Dados no Banco
- [ ] Pelo menos 1 evento cadastrado
- [ ] Pelo menos 1 edição cadastrada
- [ ] Pelo menos 3 artigos cadastrados (para teste de busca)
- [ ] Artigos possuem PDFs associados

### 6. Arquivos de Teste
- [ ] `cypress/fixtures/ArquivosBibText.bib` existe
- [ ] `cypress/fixtures/Hist4.zip` existe
- [ ] Arquivos têm conteúdo válido

### 7. Estrutura de Arquivos Cypress
- [ ] `cypress/e2e/1-authentication.cy.js` existe
- [ ] `cypress/e2e/2-article-search-redirect.cy.js` existe
- [ ] `cypress/e2e/3-bibtex-upload.cy.js` existe
- [ ] `cypress/e2e/4-admin-create-user.cy.js` existe
- [ ] `cypress.config.js` existe
- [ ] `cypress/support/commands.js` existe
- [ ] `cypress/support/e2e.js` existe

---

## 🧪 Validação Teste por Teste

### Teste 1: Autenticação ✅

**Pré-requisitos:**
- [ ] Usuário admin existe no banco
- [ ] Usuário normal existe no banco
- [ ] Credenciais corretas nos arquivos de teste

**Validação manual:**
1. [ ] Admin consegue fazer login pela interface
2. [ ] Admin é redirecionado para `/adminpage`
3. [ ] Usuário normal consegue fazer login
4. [ ] Usuário normal é redirecionado para `/events`
5. [ ] Usuário normal NÃO acessa `/adminpage` (redireciona para `/`)

**Executar teste:**
```powershell
npx cypress run --spec "cypress/e2e/1-authentication.cy.js"
```

**Resultado esperado:**
- [ ] Todos os 4 cenários passam
- [ ] Sem erros no console
- [ ] Vídeo gerado em `cypress/videos/`

---

### Teste 2: Busca e Redirecionamento ✅

**Pré-requisitos:**
- [ ] Artigos cadastrados no banco
- [ ] Termo de busca configurado (padrão: "NASA")
- [ ] Termo de busca retorna pelo menos 1 resultado

**Validação manual:**
1. [ ] Busca na home retorna resultados
2. [ ] Clicar em artigo sem login redireciona para `/login`
3. [ ] Após login, sistema redireciona para o artigo ou eventos

**Ajuste se necessário:**
```javascript
// Em 2-article-search-redirect.cy.js
const SEARCH_TERM = 'seu-termo-aqui'; // Mude se "NASA" não retornar resultados
```

**Executar teste:**
```powershell
npx cypress run --spec "cypress/e2e/2-article-search-redirect.cy.js"
```

**Resultado esperado:**
- [ ] Todos os 3 cenários passam
- [ ] Redirecionamentos funcionam corretamente
- [ ] Mensagens de toast aparecem

---

### Teste 3: Upload BibTeX ✅

**Pré-requisitos:**
- [ ] Admin pode acessar página de upload
- [ ] Botão "Upload em Massa" visível
- [ ] Arquivos BibTeX existem:
  - [ ] `cypress/fixtures/ArquivosBibText.bib`
  - [ ] `cypress/fixtures/Hist4.zip`
- [ ] Backend processa upload corretamente

**Validação manual:**
1. [ ] Admin acessa `/adminpage`
2. [ ] Clica em aba "Artigos"
3. [ ] Botão "Upload em Massa" visível
4. [ ] Popup de upload abre
5. [ ] Dois inputs de arquivo estão presentes (um para .bib, outro para .zip)

**Executar teste:**
```powershell
npx cypress run --spec "cypress/e2e/3-bibtex-upload.cy.js"
```

**Resultado esperado:**
- [ ] Upload de .bib funciona
- [ ] Upload de .zip funciona
- [ ] Mensagens de sucesso aparecem
- [ ] Artigos criados na listagem

**⚠️ Nota:** Este teste pode demorar mais (até 30 segundos para .zip)

---

### Teste 4: Criar Usuário ✅

**Pré-requisitos:**
- [ ] Admin pode criar usuários
- [ ] Formulário de cadastro acessível
- [ ] Backend aceita criação de usuários

**Validação manual:**
1. [ ] Admin faz login
2. [ ] Acessa `/login` estando logado
3. [ ] Clica em "Cadastre-se"
4. [ ] Formulário de cadastro abre
5. [ ] Se admin, checkbox "Criar como Administrador" aparece

**Executar teste:**
```powershell
npx cypress run --spec "cypress/e2e/4-admin-create-user.cy.js"
```

**Resultado esperado:**
- [ ] Usuário normal criado com sucesso
- [ ] Novo usuário faz login
- [ ] Novo usuário NÃO acessa `/adminpage`
- [ ] Admin pode criar outro admin (opcional)

**⚠️ Nota:** Emails são gerados com timestamp para evitar duplicação

---

## 🚀 Execução Completa

### Opção 1: Todos os Testes (Headless)
```powershell
cd biblioteca-digital-web-frontend
npm run test:e2e
```

**Checklist de resultado:**
- [ ] 4 arquivos de teste executados
- [ ] ~15 cenários passaram
- [ ] 0 falhas
- [ ] Vídeos gerados para cada teste
- [ ] Tempo total: ~2-3 minutos

### Opção 2: Interface Cypress (Interativo)
```powershell
npm run cypress:open
```

**Checklist:**
- [ ] Interface abre corretamente
- [ ] 4 testes listados em E2E Testing
- [ ] Pode executar individualmente
- [ ] Pode ver execução em tempo real

### Opção 3: Script PowerShell
```powershell
.\run-e2e-tests.ps1
```

**Checklist:**
- [ ] Script verifica portas 3333 e 5173
- [ ] Menu interativo funciona
- [ ] Opções executam corretamente

---

## 📊 Verificação Pós-execução

### Arquivos Gerados
- [ ] `cypress/videos/1-authentication.cy.js.mp4`
- [ ] `cypress/videos/2-article-search-redirect.cy.js.mp4`
- [ ] `cypress/videos/3-bibtex-upload.cy.js.mp4`
- [ ] `cypress/videos/4-admin-create-user.cy.js.mp4`
- [ ] Screenshots em `cypress/screenshots/` (se houver falhas)

### Logs e Resultados
- [ ] Terminal mostra resumo de execução
- [ ] Número de testes passados/falhados
- [ ] Tempo total de execução
- [ ] Sem erros críticos

### Banco de Dados
- [ ] Novos usuários criados pelo teste 4
- [ ] Artigos adicionados pelo teste 3 (se upload bem-sucedido)
- [ ] Nenhum dado corrompido

---

## 🐛 Troubleshooting

### ❌ Teste 1 falha
**Possíveis causas:**
- [ ] Credenciais incorretas → Atualizar nos arquivos de teste
- [ ] Usuário não existe → Criar no banco
- [ ] Backend não responde → Verificar logs

### ❌ Teste 2 falha
**Possíveis causas:**
- [ ] Nenhum artigo no banco → Cadastrar alguns artigos
- [ ] Termo de busca não retorna resultados → Mudar `SEARCH_TERM`
- [ ] Redirecionamento não funciona → Verificar rotas do frontend

### ❌ Teste 3 falha
**Possíveis causas:**
- [ ] Arquivos não encontrados → Verificar `TesteBibTex/`
- [ ] Backend não processa → Verificar logs do backend
- [ ] Timeout → Aumentar timeout no teste

### ❌ Teste 4 falha
**Possíveis causas:**
- [ ] Email duplicado → Usar timestamp (já implementado)
- [ ] Validação falha → Verificar schema do backend
- [ ] Permissões incorretas → Verificar middleware de admin

---

## ✅ Checklist Final de Sucesso

Após executar todos os testes, você deve ter:

- [ ] ✅ 4 testes executados
- [ ] ✅ ~15 cenários passados
- [ ] ✅ 0 falhas
- [ ] ✅ 4 vídeos gerados
- [ ] ✅ Tempo total < 5 minutos
- [ ] ✅ Backend funcionando
- [ ] ✅ Frontend funcionando
- [ ] ✅ Nenhum erro crítico

---

## 🎉 Parabéns!

Se todos os itens acima estão marcados, seus testes E2E estão funcionando perfeitamente! 🚀

Para mais informações, consulte:
- **RESUMO_TESTES_E2E.md** - Visão geral
- **TESTES_E2E_DOCUMENTACAO.md** - Documentação completa
- **QUICK_START_TESTS.md** - Guia rápido
