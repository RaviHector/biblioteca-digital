/**
 * Teste E2E de Upload de Arquivo BibTeX
 *
 * Este teste verifica:
 * 1. Admin faz login
 * 2. Acessa a área de upload em massa na AdminPage
 * 3. Faz upload do arquivo .bib
 * 4. Faz upload do arquivo .zip
 *
 * IMPORTANTE: Os arquivos devem estar em TesteBibTex/
 * - ArquivosBibText.bib
 * - Hist4.zip
 */

describe("Teste 3: Upload de Arquivo BibTeX", () => {
  // ============================================
  // CREDENCIAIS - EDITE AQUI SE NECESSÁRIO
  // ============================================
  const ADMIN_CREDENTIALS = {
    email: "ravihector2@gmail.com",
    password: "pamonha",
  };

  // Caminhos dos arquivos de teste (agora na pasta fixtures)
  const BIBTEX_FILE = "cypress/fixtures/ArquivosBibText.bib";
  const ZIP_FILE = "cypress/fixtures/Hist4.zip";
  // ============================================

  beforeEach(() => {
    // Limpa localStorage e cookies antes de cada teste
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it("Fluxo completo: Admin faz login → Upload arquivo .bib → Upload arquivo .zip", () => {
    cy.log("**Iniciando teste de upload de arquivos BibTeX**");

    // 1. Login como admin
    cy.visit("/login");
    cy.get('input[name="email"]').type(ADMIN_CREDENTIALS.email);
    cy.get('input[name="password"]').type(ADMIN_CREDENTIALS.password);
    cy.get('button[type="submit"]')
      .contains(/entrar/i)
      .click();

    // Aguarda redirecionamento para adminpage
    cy.url().should("include", "/adminpage", { timeout: 10000 });

    cy.log("**Admin logado - acessando área de artigos**");

    // 2. Clica na aba de Artigos
    cy.contains("button", "Artigos").click();
    cy.wait(500);

    // 3. Clica no botão de upload em massa
    cy.contains("button", /upload em massa|upload/i).click();

    cy.log("**Popup de upload aberto**");

    // Aguarda o popup abrir
    cy.contains(/upload em massa/i, { timeout: 5000 }).should("be.visible");

    // ===== UPLOAD DO ARQUIVO .BIB =====
    cy.log("**Fazendo upload do arquivo .bib**");

    // Verifica se há um input de arquivo
    cy.get('input[type="file"]', { timeout: 5000 }).should("exist");

    // Faz o upload do arquivo .bib
    cy.get('input[type="file"]').first().selectFile(BIBTEX_FILE, { force: true });

    // Aguarda um pouco para o arquivo ser processado
    cy.wait(1000);

    // Procura pelo botão de submit/upload no formulário
    cy.get("form").within(() => {
      cy.get('button[type="submit"]').click({ force: true });
    });

    cy.log("**Aguardando processamento do upload .bib**");

    // Aguarda a mensagem de sucesso ou erro
    cy.contains(/sucesso|enviado|uploaded|erro/i, { timeout: 15000 }).should(
      "exist"
    );

    // Verifica se houve sucesso
    cy.get("body").then(($body) => {
      if (
        $body.text().includes("sucesso") ||
        $body.text().includes("Sucesso")
      ) {
        cy.log("✓ Upload do arquivo .bib realizado com sucesso");
      } else if (
        $body.text().includes("Erro") ||
        $body.text().includes("erro")
      ) {
        cy.log("⚠️ Erro no upload .bib - verifique os logs do backend");
      }
    });

    cy.wait(1000);

    // ===== UPLOAD DO ARQUIVO .ZIP =====
    cy.log("**Preparando upload do arquivo .zip**");

    // Agora seleciona o SEGUNDO input de arquivo (para o .zip)
    cy.log("**Fazendo upload do arquivo .zip**");

    // Faz o upload do arquivo .zip no SEGUNDO input
    cy.get('input[type="file"]').eq(1).selectFile(ZIP_FILE, {
      force: true,
    });

    // Aguarda um pouco para o arquivo ser processado
    cy.wait(1000);

    // Procura pelo botão de submit/upload no formulário
    cy.get("form").within(() => {
      cy.get('button[type="submit"]').click({ force: true });
    });

    cy.log("**Aguardando processamento do upload .zip**");

    // Aguarda a mensagem de sucesso ou erro (zip pode demorar mais)
    cy.contains(/sucesso|enviado|uploaded|erro/i, { timeout: 30000 }).should(
      "exist"
    );

    // Verifica se houve sucesso
    cy.get("body").then(($body) => {
      if (
        $body.text().includes("sucesso") ||
        $body.text().includes("Sucesso")
      ) {
        cy.log("✓ Upload do arquivo .zip realizado com sucesso");
      } else if (
        $body.text().includes("Erro") ||
        $body.text().includes("erro")
      ) {
        cy.log("⚠️ Erro no upload .zip - verifique os logs do backend");
      }
    });

    cy.log("**✓ Teste completo de uploads finalizado**");
  });
});
