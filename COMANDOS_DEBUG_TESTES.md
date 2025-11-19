# 🔧 Comandos Úteis e Debug - Testes E2E

## 🎯 Comandos de Execução

### Executar Todos os Testes
```powershell
# Headless (sem visualização)
cd biblioteca-digital-web-frontend
npm run test:e2e

# Com visualização
npm run test:e2e:headed

# Chrome específico
npm run test:e2e:chrome

# Interface interativa
npm run cypress:open
```

### Executar Testes Específicos
```powershell
# Apenas teste de autenticação
npx cypress run --spec "cypress/e2e/1-authentication.cy.js"

# Apenas teste de busca
npx cypress run --spec "cypress/e2e/2-article-search-redirect.cy.js"

# Apenas teste de upload
npx cypress run --spec "cypress/e2e/3-bibtex-upload.cy.js"

# Apenas teste de criação de usuário
npx cypress run --spec "cypress/e2e/4-admin-create-user.cy.js"

# Múltiplos testes específicos
npx cypress run --spec "cypress/e2e/1-*.cy.js,cypress/e2e/2-*.cy.js"
```

### Executar em Diferentes Navegadores
```powershell
# Chrome
npx cypress run --browser chrome

# Edge
npx cypress run --browser edge

# Firefox
npx cypress run --browser firefox

# Electron (padrão)
npx cypress run --browser electron
```

---

## 🐛 Debug e Troubleshooting

### Modo Debug Detalhado
```powershell
# Executar com debug
DEBUG=cypress:* npx cypress run

# Modo headed + sem fechar ao final
npx cypress run --headed --no-exit

# Com browser específico e headed
npx cypress run --browser chrome --headed
```

### Ver Logs do Cypress
```powershell
# Ver informações do sistema
npx cypress info

# Ver versão
npx cypress --version

# Verificar cache
npx cypress cache path
npx cypress cache list
```

### Limpar Cache
```powershell
# Limpar cache do Cypress
npx cypress cache clear

# Limpar cache do npm
npm cache clean --force

# Reinstalar Cypress
npm uninstall cypress
npm install --save-dev cypress
```

---

## 🎬 Vídeos e Screenshots

### Localização dos Arquivos
```powershell
# Ver vídeos gerados
explorer cypress\videos

# Ver screenshots de falhas
explorer cypress\screenshots

# Excluir vídeos antigos
Remove-Item -Path "cypress\videos\*" -Recurse -Force

# Excluir screenshots antigos
Remove-Item -Path "cypress\screenshots\*" -Recurse -Force
```

### Configurar Gravação
```javascript
// Em cypress.config.js

export default defineConfig({
  e2e: {
    video: true,              // Gravar vídeo
    videoCompression: 32,     // Qualidade (0-51, menor = melhor)
    screenshotOnRunFailure: true,  // Screenshot em falhas
    trashAssetsBeforeRuns: true,   // Limpar antes de executar
  },
});
```

---

## 🔍 Adicionar Debug nos Testes

### Pausar Execução
```javascript
// Pausar para inspecionar
cy.pause();

// Debug com informações
cy.debug();

// Log customizado
cy.log('**Checkpoint: Verificando elemento**');

// Esperar manualmente
cy.wait(5000); // 5 segundos
```

### Inspecionar Elementos
```javascript
// Ver elemento no console
cy.get('button').then(($btn) => {
  console.log($btn);
});

// Ver estado da aplicação
cy.window().then((win) => {
  console.log('LocalStorage:', win.localStorage);
  console.log('Store:', win.store);
});

// Screenshot manual
cy.screenshot('meu-screenshot');
```

### Verificar Requisições
```javascript
// Interceptar e logar requests
cy.intercept('POST', '/api/login').as('loginRequest');
cy.wait('@loginRequest').then((interception) => {
  console.log('Request:', interception.request);
  console.log('Response:', interception.response);
});
```

---

## 📊 Relatórios e Estatísticas

### Relatório Detalhado no Terminal
```powershell
# Relatório com spec pattern
npx cypress run --reporter spec

# Relatório JSON
npx cypress run --reporter json --reporter-options output=results.json

# Relatório múltiplo
npx cypress run --reporter mochawesome
```

### Ver Tempo de Execução
```powershell
# Medir tempo de um teste específico
Measure-Command { npx cypress run --spec "cypress/e2e/1-authentication.cy.js" }

# Medir tempo de todos os testes
Measure-Command { npm run test:e2e }
```

---

## 🔧 Configurações Avançadas

### Aumentar Timeout
```javascript
// Em um teste específico
cy.get('elemento', { timeout: 10000 }); // 10 segundos

// Globalmente em cypress.config.js
export default defineConfig({
  e2e: {
    defaultCommandTimeout: 10000,  // Padrão: 4000
    pageLoadTimeout: 60000,        // Padrão: 60000
    requestTimeout: 10000,         // Padrão: 5000
  },
});
```

### Configurar Retry
```javascript
// Em cypress.config.js
export default defineConfig({
  e2e: {
    retries: {
      runMode: 2,      // Retry 2x em CI/CD
      openMode: 0,     // Não retry em modo interativo
    },
  },
});
```

### Variáveis de Ambiente
```javascript
// Em cypress.config.js
export default defineConfig({
  e2e: {
    env: {
      adminEmail: 'admin@teste.com',
      adminPassword: 'admin123',
      apiUrl: 'http://localhost:3333',
    },
  },
});

// Usar nos testes
cy.log(Cypress.env('adminEmail'));
```

---

## 🛠️ Comandos PowerShell Úteis

### Verificar Portas em Uso
```powershell
# Ver processo na porta 3333
Get-NetTCPConnection -LocalPort 3333 -State Listen

# Ver processo na porta 5173
Get-NetTCPConnection -LocalPort 5173 -State Listen

# Matar processo na porta (se necessário)
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3333).OwningProcess -Force
```

### Iniciar Backend e Frontend Simultaneamente
```powershell
# Script para iniciar ambos
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd biblioteca-digital-backend; npm run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd biblioteca-digital-web-frontend; npm run dev"
```

### Verificar Status dos Serviços
```powershell
# Testar backend
Invoke-WebRequest -Uri "http://localhost:3333" -UseBasicParsing

# Testar frontend
Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing
```

---

## 🎨 Melhorar Output no Terminal

### Logs Coloridos
```javascript
// Em um teste
cy.log('%c✅ Teste passou!', 'color: green; font-weight: bold');
cy.log('%c❌ Atenção!', 'color: red; font-weight: bold');
cy.log('%c⚠️ Aviso', 'color: orange; font-weight: bold');
```

### Task Customizada
```javascript
// Em cypress.config.js
setupNodeEvents(on, config) {
  on('task', {
    log(message) {
      console.log('🔵', message);
      return null;
    },
  });
}

// Usar no teste
cy.task('log', 'Minha mensagem customizada');
```

---

## 📁 Organização de Testes

### Executar por Tag/Categoria
```javascript
// Adicionar tag no teste
describe('Teste 1: Autenticação @smoke', () => {
  // ...
});

// Executar apenas testes smoke
npx cypress run --spec "**/*@smoke*.cy.js"
```

### Skip ou Only
```javascript
// Executar apenas este teste
it.only('deve fazer login', () => {
  // ...
});

// Pular este teste
it.skip('teste em construção', () => {
  // ...
});
```

---

## 🔐 Segurança

### Não Commitar Credenciais
```javascript
// Usar variáveis de ambiente
// arquivo: cypress.env.json (adicionar ao .gitignore)
{
  "adminEmail": "admin@teste.com",
  "adminPassword": "admin123"
}

// Usar no teste
const email = Cypress.env('adminEmail');
const password = Cypress.env('adminPassword');
```

---

## 📚 Comandos de Referência Rápida

```powershell
# Instalação
npm install --save-dev cypress

# Abrir Cypress
npm run cypress:open

# Executar testes
npm run test:e2e

# Teste específico
npx cypress run --spec "cypress/e2e/1-authentication.cy.js"

# Com visualização
npm run test:e2e:headed

# Chrome
npm run test:e2e:chrome

# Debug
npx cypress run --headed --no-exit

# Limpar cache
npx cypress cache clear

# Ver informações
npx cypress info

# Ver vídeos
explorer cypress\videos

# Ver screenshots
explorer cypress\screenshots
```

---

## 💡 Dicas Avançadas

### 1. Executar em Paralelo (CI/CD)
```powershell
npx cypress run --record --parallel
```

### 2. Executar com Seed de Dados
```javascript
before(() => {
  cy.task('db:seed'); // Task customizada
});
```

### 3. Mockar Requisições
```javascript
cy.intercept('GET', '/api/articles', {
  fixture: 'articles.json'
}).as('getArticles');
```

### 4. Testar Emails
```javascript
// Usar serviço como Ethereal ou Mailtrap
cy.task('getLastEmail').then((email) => {
  expect(email.subject).to.include('Novo Artigo');
});
```

### 5. Acessibilidade
```powershell
# Instalar plugin
npm install --save-dev cypress-axe

# Usar no teste
cy.injectAxe();
cy.checkA11y();
```

---

## 🎯 Checklist de Debug

Quando um teste falhar:

- [ ] Ver vídeo em `cypress/videos/`
- [ ] Ver screenshot em `cypress/screenshots/`
- [ ] Executar com `--headed` para visualizar
- [ ] Adicionar `cy.pause()` antes da falha
- [ ] Verificar logs do backend
- [ ] Verificar console do browser
- [ ] Confirmar que backend/frontend estão rodando
- [ ] Verificar credenciais nos testes
- [ ] Confirmar dados no banco de dados
- [ ] Testar manualmente o fluxo

---

## 📞 Recursos Adicionais

- **Documentação Oficial:** https://docs.cypress.io
- **Exemplos:** https://github.com/cypress-io/cypress-example-recipes
- **Plugins:** https://docs.cypress.io/plugins/directory
- **Best Practices:** https://docs.cypress.io/guides/references/best-practices

---

**Dica Final:** Use `npm run cypress:open` para debug interativo e `npm run test:e2e` para execução rápida em CI/CD! 🚀
