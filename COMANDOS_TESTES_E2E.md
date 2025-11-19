# 🔧 Comandos Úteis e Debug - Testes E2E

## 🎯 Comandos de Execução

  ## Diretório

  Abra a pasta do frontend: `cd .\biblioteca-digital-web-frontend\`

  ## Rodar testes

  `npm run cypress:open`

  ## Possível erro

  Caso ocarra o seguinte erro: `O arquivo C:\Program Files\nodejs\npm.ps1 não pode ser carregado porque a execução de scripts foi desabilitada neste sistema`

  Execute esse comando: `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`

  Feito isso, execute novamente: `npm run cypress:open`
