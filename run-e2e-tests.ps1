# Script para executar os testes E2E da Biblioteca Digital
# Este script verifica se o backend e frontend estão rodando e executa os testes

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Testes E2E - Biblioteca Digital" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Função para verificar se uma porta está em uso
function Test-Port {
    param (
        [int]$Port
    )
    $connection = Test-NetConnection -ComputerName localhost -Port $Port -WarningAction SilentlyContinue
    return $connection.TcpTestSucceeded
}

# Verificar se o backend está rodando (porta 3333)
Write-Host "Verificando Backend (porta 3333)..." -ForegroundColor Yellow
if (Test-Port -Port 3333) {
    Write-Host "[OK] Backend está rodando" -ForegroundColor Green
} else {
    Write-Host "[ERRO] Backend não está rodando na porta 3333" -ForegroundColor Red
    Write-Host "       Execute: cd biblioteca-digital-backend; npm run dev" -ForegroundColor Yellow
    Write-Host ""
    $continue = Read-Host "Deseja continuar mesmo assim? (s/n)"
    if ($continue -ne 's' -and $continue -ne 'S') {
        exit 1
    }
}

# Verificar se o frontend está rodando (porta 5173)
Write-Host "Verificando Frontend (porta 5173)..." -ForegroundColor Yellow
if (Test-Port -Port 5173) {
    Write-Host "[OK] Frontend está rodando" -ForegroundColor Green
} else {
    Write-Host "[ERRO] Frontend não está rodando na porta 5173" -ForegroundColor Red
    Write-Host "       Execute: cd biblioteca-digital-web-frontend; npm run dev" -ForegroundColor Yellow
    Write-Host ""
    $continue = Read-Host "Deseja continuar mesmo assim? (s/n)"
    if ($continue -ne 's' -and $continue -ne 'S') {
        exit 1
    }
}

Write-Host ""
Write-Host "Escolha o modo de execução:" -ForegroundColor Cyan
Write-Host "1. Interface Interativa (Cypress GUI)" -ForegroundColor White
Write-Host "2. Headless (Terminal - sem visualização)" -ForegroundColor White
Write-Host "3. Headed (Terminal - com visualização)" -ForegroundColor White
Write-Host "4. Executar teste específico" -ForegroundColor White
Write-Host "5. Chrome Browser" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Opção [1-5]"

# Navegar para o diretório do frontend
Set-Location -Path "biblioteca-digital-web-frontend"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "Abrindo Cypress..." -ForegroundColor Green
        npm run cypress:open
    }
    "2" {
        Write-Host ""
        Write-Host "Executando testes em modo headless..." -ForegroundColor Green
        npm run test:e2e
    }
    "3" {
        Write-Host ""
        Write-Host "Executando testes em modo headed..." -ForegroundColor Green
        npm run test:e2e:headed
    }
    "4" {
        Write-Host ""
        Write-Host "Testes disponíveis:" -ForegroundColor Cyan
        Write-Host "1. Autenticação" -ForegroundColor White
        Write-Host "2. Busca e Redirecionamento" -ForegroundColor White
        Write-Host "3. Upload BibTeX" -ForegroundColor White
        Write-Host "4. Criar Usuário" -ForegroundColor White
        Write-Host ""
        $testChoice = Read-Host "Qual teste deseja executar? [1-4]"
        
        $testFile = switch ($testChoice) {
            "1" { "cypress/e2e/1-authentication.cy.js" }
            "2" { "cypress/e2e/2-article-search-redirect.cy.js" }
            "3" { "cypress/e2e/3-bibtex-upload.cy.js" }
            "4" { "cypress/e2e/4-admin-create-user.cy.js" }
            default { 
                Write-Host "Opção inválida!" -ForegroundColor Red
                exit 1
            }
        }
        
        Write-Host ""
        Write-Host "Executando $testFile..." -ForegroundColor Green
        npx cypress run --spec $testFile
    }
    "5" {
        Write-Host ""
        Write-Host "Executando testes no Chrome..." -ForegroundColor Green
        npm run test:e2e:chrome
    }
    default {
        Write-Host "Opção inválida!" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Execução Concluída!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Vídeos salvos em: cypress/videos/" -ForegroundColor Yellow
Write-Host "Screenshots em: cypress/screenshots/" -ForegroundColor Yellow
Write-Host ""
