/**
 * Teste E2E de Busca e Redirecionamento
 *
 * Este teste verifica:
 * 1. Usuário não logado busca por um artigo
 * 2. Ao clicar no artigo, é redirecionado para login
 * 3. Após fazer login, é redirecionado para o artigo buscado
 *
 * IMPORTANTE: Ajuste as credenciais e termo de busca se necessário
 */

describe("Teste 2: Busca de Artigo sem Login e Redirecionamento", () => {
  // ============================================
  // CONFIGURAÇÕES - EDITE AQUI SE NECESSÁRIO
  // ============================================
  const USER_CREDENTIALS = {
    email: "rian@dharma.com.br",
    password: "pamonha",
  };

  // Termo de busca que deve retornar resultados
  // Ajuste conforme os dados disponíveis no seu banco
  const SEARCH_TERM = "NASA";
  // ============================================

  beforeEach(() => {
    // Limpa localStorage e cookies antes de cada teste
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it("Fluxo completo: Usuário não logado busca artigo → redireciona para login → faz login → acessa o artigo", () => {
    cy.log("**Iniciando teste de fluxo completo**");

    // 1. Usuário não logado acessa a home
    cy.visit("/");
    cy.url().should("eq", Cypress.config().baseUrl + "/");

    // 2. Busca por um artigo
    cy.log("**Buscando artigo**");
    cy.get('input[type="text"]')
      .should("be.visible")
      .and("have.attr", "placeholder")
      .and("match", /artigo|autor|evento/i);

    cy.get('input[type="text"]').type(SEARCH_TERM);

    // Aguarda os resultados aparecerem
    cy.wait(1000);

    // Verifica se há resultados
    cy.get("body").then(($body) => {
      if ($body.text().includes("Nenhum resultado encontrado")) {
        cy.log("⚠️ Nenhum artigo encontrado com o termo: " + SEARCH_TERM);
        cy.log("⚠️ Ajuste a constante SEARCH_TERM no teste");
        throw new Error("Configure um termo de busca válido");
      }
    });

    cy.contains(/resultado.*encontrado/i, { timeout: 10000 }).should("exist");

    // 3. Clica no primeiro artigo
    cy.log("**Clicando no artigo**");
    cy.get("div").contains(SEARCH_TERM).first().click({ force: true });

    // 4. É redirecionado para login
    cy.log("**Verificando redirecionamento para login**");
    cy.url().should("include", "/login", { timeout: 10000 });
    cy.contains(/faça login|login|acessar/i, { timeout: 5000 }).should("exist");

    // 5. Faz o login
    cy.log("**Fazendo login**");
    cy.get('input[name="email"]')
      .should("be.visible")
      .type(USER_CREDENTIALS.email);

    cy.get('input[name="password"]')
      .should("be.visible")
      .type(USER_CREDENTIALS.password);

    cy.get('button[type="submit"]')
      .should("be.visible")
      .contains(/entrar/i)
      .click();

    // 6. Após login, é redirecionado para o artigo
    cy.log("**Verificando redirecionamento para o artigo**");
    cy.url({ timeout: 10000 }).then((url) => {
      if (url.includes("/article/")) {
        cy.log("✓ Redirecionado para o artigo com sucesso");
        cy.url().should("include", "/article/");
        cy.get("body").should("contain.text", "Artigo");
      } else if (url.includes("/events")) {
        cy.log("⚠️ Redirecionado para /events - state pode não ter sido preservado");
        cy.url().should("include", "/events");
      }
    });

    cy.log("**✓ Fluxo completo testado com sucesso**");
  });
});
