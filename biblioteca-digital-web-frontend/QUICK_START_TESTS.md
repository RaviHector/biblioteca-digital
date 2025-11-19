# 🚀 Guia Rápido - Testes E2E Biblioteca Digital

## ⚡ Setup Inicial (Execute apenas uma vez)

### 1. Instalar Cypress
```powershell
cd biblioteca-digital-web-frontend
npm install --save-dev cypress eslint-plugin-cypress
```

### 2. Preparar Banco de Dados

Certifique-se de ter os seguintes usuários cadastrados no banco:

**Usuário Administrador:**
- Email: `ravihector2@gmail.com`
- Senha: `pamonha`
- isAdmin: `true`

**Usuário Normal:**
- Email: `rian@dharma.com.br`
- Senha: `pamonha`
- isAdmin: `false`

**Como criar via backend (se necessário):**
```javascript
// Acesse o MongoDB diretamente ou use o endpoint de criação
// com os dados acima
```

### 3. Verificar Arquivos de Teste

Confirme que os arquivos BibTeX foram copiados para `cypress/fixtures/`:
```
cypress/
└── fixtures/
    ├── ArquivosBibText.bib
    └── Hist4.zip
```

**Nota:** Estes arquivos já foram copiados do `TesteBibTex/` para a pasta fixtures.

## 🏃 Executar Testes

### Preparação
```powershell
# Terminal 1 - Inicie o Backend
cd biblioteca-digital-backend
npm run dev

# Terminal 2 - Inicie o Frontend
cd biblioteca-digital-web-frontend
npm run dev
```

### Executar Todos os Testes

**Interface Interativa (Recomendado para desenvolvimento):**
```powershell
cd biblioteca-digital-web-frontend
npm run cypress:open
```
Depois selecione "E2E Testing" e escolha o navegador.

**Modo Headless (Para CI/CD):**
```powershell
npm run test:e2e
```

**Com Visualização:**
```powershell
npm run test:e2e:headed
```

### Executar Teste Específico

```powershell
# Apenas teste de autenticação
npx cypress run --spec "cypress/e2e/1-authentication.cy.js"

# Apenas teste de busca
npx cypress run --spec "cypress/e2e/2-article-search-redirect.cy.js"

# Apenas teste de upload
npx cypress run --spec "cypress/e2e/3-bibtex-upload.cy.js"

# Apenas teste de criação de usuário
npx cypress run --spec "cypress/e2e/4-admin-create-user.cy.js"
```

## 📝 Descrição dos Testes

### ✅ Teste 1: Autenticação
- Login de admin → Acessa `/adminpage`
- Login de usuário normal → Acessa `/events`
- Usuário normal tenta acessar `/adminpage` → Bloqueado

### ✅ Teste 2: Busca e Redirecionamento (Fluxo único)
- Busca artigo sem login
- Clica no artigo → Redireciona para `/login`
- Faz login → Redireciona para o artigo

### ✅ Teste 3: Upload BibTeX (Fluxo único)
- Admin faz login
- Acessa página de upload
- Upload de arquivo `.bib` ✓
- Upload de arquivo `.zip` ✓ (mesmo modal)

### ✅ Teste 4: Criar Usuário
- Admin cria usuário normal
- Novo usuário faz login
- Novo usuário não acessa `/adminpage`

## ⚙️ Personalização

### Editar Credenciais

**Opção 1 - Direto no arquivo de teste:**
Edite a seção marcada em cada teste:
```javascript
// ============================================
// CREDENCIAIS - EDITE AQUI SE NECESSÁRIO
// ============================================
```

**Opção 2 - Arquivo de configuração centralizado:**
Edite `cypress/support/config.js`

### Ajustar Termo de Busca

Se o termo "NASA" não retornar resultados, edite em:
- `cypress/e2e/2-article-search-redirect.cy.js`
- Linha com `const SEARCH_TERM = 'NASA';`

## 📊 Visualizar Resultados

Após executar os testes em modo headless:

**Vídeos:**
```
biblioteca-digital-web-frontend/cypress/videos/
```

**Screenshots (apenas em falhas):**
```
biblioteca-digital-web-frontend/cypress/screenshots/
```

## 🐛 Problemas Comuns

### ❌ "Nenhum resultado encontrado"
**Solução:** Ajuste `SEARCH_TERM` para um termo que exista no banco

### ❌ "Erro ao fazer login"
**Solução:** Verifique se os usuários existem no banco com as credenciais corretas

### ❌ "Cannot read properties of undefined"
**Solução:** Aumente o timeout ou verifique se o backend está respondendo

### ❌ "File not found" (Upload)
**Solução:** Verifique se os arquivos estão em `TesteBibTex/`

### ❌ Testes passam mas não vê nada acontecendo
**Solução:** Use `npm run test:e2e:headed` para ver a execução

## 📞 Comandos Úteis

```powershell
# Ver versão do Cypress
npx cypress --version

# Limpar cache do Cypress
npx cypress cache clear

# Ver informações do Cypress
npx cypress info

# Executar com específico navegador
npx cypress run --browser chrome
npx cypress run --browser edge
npx cypress run --browser firefox

# Executar com modo debug
npx cypress run --headed --no-exit
```

## 🎯 Checklist Antes de Executar

- [ ] Backend rodando em `http://localhost:3333`
- [ ] Frontend rodando em `http://localhost:5173`
- [ ] Usuário admin existe no banco
- [ ] Usuário normal existe no banco
- [ ] Arquivos BibTeX existem em `TesteBibTex/`
- [ ] Cypress instalado (`npm install cypress`)

## 💡 Dicas

1. **Primeiro teste?** Use `npm run cypress:open` para ver o que está acontecendo
2. **Debugar teste específico?** Adicione `cy.pause()` no código
3. **Ver estado da aplicação?** Use `cy.debug()` antes de uma ação
4. **Teste falhou?** Veja o screenshot e vídeo gerados automaticamente
5. **Performance lenta?** Reduza o número de `cy.wait()` desnecessários

---

**Pronto para começar!** Execute `npm run cypress:open` e selecione o primeiro teste. 🎉
