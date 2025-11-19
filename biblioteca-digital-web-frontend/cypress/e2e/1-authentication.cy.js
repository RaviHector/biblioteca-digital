/**
 * Teste E2E de Autenticação
 *
 * Este teste verifica:
 * 1. Login de usuário administrador
 * 2. Login de usuário normal
 * 3. Tentativa de acesso à página admin por usuário normal (deve ser bloqueado)
 *
 * IMPORTANTE: Edite as credenciais abaixo caso necessário
 */

describe("Teste 1: Autenticação de Usuários", () => {
  // ============================================
  // CREDENCIAIS - EDITE AQUI SE NECESSÁRIO
  // ============================================
  const ADMIN_CREDENTIALS = {
    email: "ravihector2@gmail.com",
    password: "pamonha",
  };

  const USER_CREDENTIALS = {
    email: "rian@dharma.com.br",
    password: "pamonha",
  };
  // ============================================

  beforeEach(() => {
    // Limpa localStorage e cookies antes de cada teste
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it("1.1 - Deve fazer login como ADMINISTRADOR e acessar a página admin", () => {
    cy.log("**Iniciando login como administrador**");

    // Visita a página de login
    cy.visit("/login");
    cy.url().should("include", "/login");

    // Preenche o formulário de login
    cy.get('input[name="email"]')
      .should("be.visible")
      .type(ADMIN_CREDENTIALS.email);

    cy.get('input[name="password"]')
      .should("be.visible")
      .type(ADMIN_CREDENTIALS.password);

    // Clica no botão de login
    cy.get('button[type="submit"]')
      .should("be.visible")
      .contains(/entrar/i)
      .click();

    // Aguarda o redirecionamento e verifica se foi para a página admin
    cy.url().should("include", "/adminpage", { timeout: 10000 });

    // Verifica se elementos da página admin estão visíveis
    cy.contains("Busca Administrativa").should("be.visible");
    cy.contains("Artigos").should("be.visible");
    cy.contains("Edições").should("be.visible");
    cy.contains("Eventos").should("be.visible");

    cy.log("**Login de administrador bem-sucedido**");
  });

  it("1.2 - Deve fazer login como USUÁRIO NORMAL e acessar a página de eventos", () => {
    cy.log("**Iniciando login como usuário normal**");

    // Visita a página de login
    cy.visit("/login");
    cy.url().should("include", "/login");

    // Preenche o formulário de login
    cy.get('input[name="email"]')
      .should("be.visible")
      .type(USER_CREDENTIALS.email);

    cy.get('input[name="password"]')
      .should("be.visible")
      .type(USER_CREDENTIALS.password);

    // Clica no botão de login
    cy.get('button[type="submit"]')
      .should("be.visible")
      .contains(/entrar/i)
      .click();

    // Aguarda o redirecionamento - usuário normal deve ir para /events
    cy.url().should("include", "/events", { timeout: 10000 });

    cy.log("**Login de usuário normal bem-sucedido**");
  });

  it("1.3 - Usuário NORMAL NÃO deve conseguir acessar a página admin", () => {
    cy.log("**Testando bloqueio de acesso à página admin por usuário normal**");

    // Faz login como usuário normal
    cy.visit("/login");
    cy.get('input[name="email"]').type(USER_CREDENTIALS.email);
    cy.get('input[name="password"]').type(USER_CREDENTIALS.password);
    cy.get('button[type="submit"]')
      .contains(/entrar/i)
      .click();

    // Aguarda o redirecionamento para /events
    cy.url().should("include", "/events", { timeout: 10000 });

    // Tenta acessar a página admin diretamente
    cy.visit("/adminpage");

    // O sistema deve redirecionar para a home (/) pois o usuário não é admin
    cy.url().should("not.include", "/adminpage");
    cy.url().should("eq", Cypress.config().baseUrl + "/");

    cy.log("**Bloqueio de acesso funcionando corretamente**");
  });

  it("1.4 - Não deve permitir login com credenciais inválidas", () => {
    cy.log("**Testando login com credenciais inválidas**");

    cy.visit("/login");

    // Tenta fazer login com credenciais inválidas
    cy.get('input[name="email"]').type("invalido@teste.com");
    cy.get('input[name="password"]').type("senhaerrada");
    cy.get('button[type="submit"]')
      .contains(/entrar/i)
      .click();

    // Deve permanecer na página de login
    cy.url().should("include", "/login");

    // Verifica se há mensagem de erro (toast)
    cy.contains(/erro/i, { timeout: 5000 }).should("exist");

    cy.log("**Validação de credenciais funcionando corretamente**");
  });
});
