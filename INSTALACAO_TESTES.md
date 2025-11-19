# 📦 Instruções de Instalação - Testes E2E

## Passo a Passo para Configurar os Testes

### 1️⃣ Instalar Cypress

Navegue até a pasta do frontend e instale o Cypress:

```powershell
cd biblioteca-digital-web-frontend
npm install --save-dev cypress eslint-plugin-cypress
```

**Nota:** Caso o comando acima tenha sido pulado, os arquivos já foram criados e você pode executar a instalação manualmente.

---

### 2️⃣ Verificar Arquivos Criados

Os seguintes arquivos foram criados automaticamente:

#### Arquivos de Teste:

- ✅ `cypress/e2e/1-authentication.cy.js`
- ✅ `cypress/e2e/2-article-search-redirect.cy.js`
- ✅ `cypress/e2e/3-bibtex-upload.cy.js`
- ✅ `cypress/e2e/4-admin-create-user.cy.js`

#### Configuração:

- ✅ `cypress.config.js`
- ✅ `cypress/support/commands.js`
- ✅ `cypress/support/e2e.js`
- ✅ `cypress/support/config.js`
- ✅ `cypress/.eslintrc.json`

#### Documentação:

- ✅ `RESUMO_TESTES_E2E.md`
- ✅ `TESTES_E2E_DOCUMENTACAO.md`
- ✅ `QUICK_START_TESTS.md`
- ✅ `cypress/README.md`

#### Scripts:

- ✅ `run-e2e-tests.ps1`

---

### 3️⃣ Preparar Banco de Dados

Crie os seguintes usuários no banco de dados:

#### Usuário Administrador:

```json
{
  "name": "Ravi Hector",
  "email": "ravihector2@gmail.com",
  "password": "pamonha",
  "isAdmin": true
}
```

#### Usuário Normal:

```json
{
  "name": "Rian Dharma",
  "email": "rian@dharma.com.br",
  "password": "pamonha",
  "isAdmin": false
}
```

**Como criar:**

- Use a interface da aplicação para criar os usuários
- Ou insira diretamente no MongoDB
- Ou use o endpoint de criação de usuário do backend

---

### 4️⃣ Verificar Arquivos BibTeX

Confirme que os arquivos de teste foram copiados:

```
biblioteca-digital-web-frontend/
└── cypress/
    └── fixtures/
        ├── ArquivosBibText.bib   ← Deve existir
        └── Hist4.zip             ← Deve existir
```

**Status atual:** ✅ Os arquivos foram copiados de `TesteBibTex/` para `cypress/fixtures/`

---

### 5️⃣ Atualizar Credenciais (Se Necessário)

Se você quiser usar credenciais diferentes, edite os arquivos de teste:

**Para TODOS os testes, edite a seção marcada:**

```javascript
// ============================================
// CREDENCIAIS - EDITE AQUI SE NECESSÁRIO
// ============================================
```

**Ou edite o arquivo centralizado:**
`cypress/support/config.js`

---

### 6️⃣ Primeira Execução

#### Iniciar Backend e Frontend:

**Terminal 1 - Backend:**

```powershell
cd biblioteca-digital-backend
npm run dev
```

**Terminal 2 - Frontend:**

```powershell
cd biblioteca-digital-web-frontend
npm run dev
```

#### Executar os Testes:

**Opção A - Interface Interativa (Recomendado para primeira vez):**

```powershell
# Na raiz do projeto
.\run-e2e-tests.ps1
# Escolha opção 1
```

**Opção B - Direto no Cypress:**

```powershell
cd biblioteca-digital-web-frontend
npm run cypress:open
```

---

## ✅ Verificação de Instalação

Execute este checklist:

```powershell
# Verificar se Cypress foi instalado
cd biblioteca-digital-web-frontend
npx cypress --version
```

Se aparecer a versão do Cypress, a instalação foi bem-sucedida! ✅

---

## 🔍 Próximos Passos

1. **Leia a documentação:**

   - `RESUMO_TESTES_E2E.md` - Visão geral rápida
   - `QUICK_START_TESTS.md` - Guia de início rápido
   - `TESTES_E2E_DOCUMENTACAO.md` - Documentação completa

2. **Execute um teste:**

   ```powershell
   .\run-e2e-tests.ps1
   ```

3. **Veja os resultados:**
   - Vídeos em: `cypress/videos/`
   - Screenshots em: `cypress/screenshots/`

---

## 🆘 Solução de Problemas

### Cypress não instala

```powershell
# Limpe o cache e tente novamente
npm cache clean --force
npm install --save-dev cypress
```

### Scripts não funcionam

```powershell
# Adicione manualmente ao package.json na seção "scripts":
"cypress:open": "cypress open",
"cypress:run": "cypress run",
"test:e2e": "cypress run"
```

### Permissão negada no PowerShell

```powershell
# Execute como administrador ou ajuste a política:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## 📞 Comandos Rápidos

```powershell
# Instalar Cypress
npm install --save-dev cypress

# Abrir interface
npm run cypress:open

# Executar todos os testes
npm run test:e2e

# Executar teste específico
npx cypress run --spec "cypress/e2e/1-authentication.cy.js"

# Ver vídeos
explorer cypress\videos

# Ver screenshots
explorer cypress\screenshots
```

---

## ✨ Pronto!

Agora você tem tudo configurado para executar os testes E2E!

Execute `.\run-e2e-tests.ps1` para começar! 🚀
