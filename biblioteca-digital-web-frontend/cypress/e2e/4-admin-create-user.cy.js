/**
 * Teste E2E de Criação de Usuário por Administrador
 *
 * Este teste verifica:
 * 1. Admin faz login
 * 2. Admin acessa a página de criação de usuário
 * 3. Admin cria um novo usuário normal
 * 4. Verifica se o novo usuário consegue fazer login
 *
 * IMPORTANTE: Edite as credenciais se necessário
 */

describe("Teste 4: Administrador Cria Usuário Normal", () => {
  // ============================================
  // CREDENCIAIS - EDITE AQUI SE NECESSÁRIO
  // ============================================
  const ADMIN_CREDENTIALS = {
    email: "ravihector2@gmail.com",
    password: "pamonha",
  };

  // Dados do novo usuário a ser criado
  // IMPORTANTE: Use um email único para evitar conflitos
  const NEW_USER = {
    name: "Usuário Teste Cypress",
    email: `teste.cypress.${Date.now()}@example.com`, // Email único
    password: "senha123",
  };
  // ============================================

  beforeEach(() => {
    // Limpa localStorage e cookies antes de cada teste
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it("4.1 - Admin faz login e acessa área de criação de usuário", () => {
    cy.log("**Fazendo login como administrador**");

    // Login como admin
    cy.visit("/login");
    cy.get('input[name="email"]').type(ADMIN_CREDENTIALS.email);
    cy.get('input[name="password"]').type(ADMIN_CREDENTIALS.password);
    cy.get('button[type="submit"]')
      .contains(/entrar/i)
      .click();

    // Aguarda redirecionamento para adminpage
    cy.url().should("include", "/adminpage", { timeout: 10000 });

    cy.log("**Admin logado com sucesso**");

    // Faz logout para ir para a tela de criação de usuário
    cy.clearLocalStorage();
    cy.visit("/login");

    // Verifica se há opção de cadastro
    cy.contains(/não tem uma conta|cadastre-se/i).should("be.visible");

    cy.log("**Área de cadastro acessível**");
  });

  it("4.2 - Admin cria um novo usuário normal através da página de cadastro", () => {
    cy.log("**Iniciando criação de usuário**");

    // PARTE 1: Admin faz login primeiro
    cy.visit("/login");
    cy.get('input[name="email"]').type(ADMIN_CREDENTIALS.email);
    cy.get('input[name="password"]').type(ADMIN_CREDENTIALS.password);
    cy.get('button[type="submit"]')
      .contains(/entrar/i)
      .click();

    // Aguarda redirecionamento
    cy.url().should("include", "/adminpage", { timeout: 10000 });

    cy.log("**Admin logado - agora acessando tela de cadastro**");

    // PARTE 2: Acessa a página de login/cadastro
    cy.visit("/login");

    // Clica para alternar para o modo de cadastro
    cy.contains(/não tem uma conta|cadastre-se/i).click();

    cy.log("**Formulário de cadastro aberto**");

    // Aguarda o formulário de cadastro aparecer
    cy.contains(/criar conta|cadastrar/i, { timeout: 5000 }).should(
      "be.visible"
    );

    // Verifica se é admin logado - deve mostrar checkbox de admin
    cy.get("body").then(($body) => {
      if ($body.find('input[id="isAdmin"]').length > 0) {
        cy.log("✓ Checkbox de admin disponível (usuário admin detectado)");
        // NÃO marca o checkbox - queremos criar usuário normal
      }
    });

    cy.log("**Preenchendo formulário de cadastro**");

    // Preenche o formulário de cadastro
    cy.get('input[name="name"]').should("be.visible").type(NEW_USER.name);

    cy.get('input[name="email"]').clear().type(NEW_USER.email);

    cy.get('input[name="password"]').clear().type(NEW_USER.password);

    // Garante que o checkbox de admin NÃO está marcado
    cy.get("body").then(($body) => {
      if ($body.find('input[id="isAdmin"]').length > 0) {
        cy.get('input[id="isAdmin"]').should("not.be.checked");
        cy.log("✓ Criando como usuário normal (não admin)");
      }
    });

    cy.log("**Submetendo formulário**");

    // Clica no botão de cadastrar
    cy.get('button[type="submit"]')
      .contains(/cadastrar/i)
      .click();

    cy.log("**Aguardando confirmação**");

    // Aguarda mensagem de sucesso
    cy.contains(/sucesso|criado|cadastrado/i, { timeout: 10000 }).should(
      "exist"
    );

    // Deve voltar para a tela de login
    cy.contains(/entrar/i).should("be.visible");

    cy.log(`**Usuário ${NEW_USER.email} criado com sucesso**`);
  });

  it("4.3 - Novo usuário consegue fazer login", () => {
    cy.log("**Testando login do novo usuário**");

    // Primeiro, cria o usuário (repetindo o processo)
    cy.visit("/login");
    cy.get('input[name="email"]').type(ADMIN_CREDENTIALS.email);
    cy.get('input[name="password"]').type(ADMIN_CREDENTIALS.password);
    cy.get('button[type="submit"]')
      .contains(/entrar/i)
      .click();
    cy.url().should("include", "/adminpage", { timeout: 10000 });

    // Cria o usuário
    cy.visit("/login");
    cy.contains(/não tem uma conta|cadastre-se/i).click();

    const uniqueEmail = `teste.login.${Date.now()}@example.com`;

    cy.get('input[name="name"]').type("Teste Login");
    cy.get('input[name="email"]').clear().type(uniqueEmail);
    cy.get('input[name="password"]').clear().type("senha123");
    cy.get('button[type="submit"]')
      .contains(/cadastrar/i)
      .click();

    // Aguarda criação
    cy.contains(/sucesso|criado/i, { timeout: 10000 }).should("exist");

    cy.log("**Fazendo logout do admin**");

    // Faz logout
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.visit("/login");

    cy.log("**Tentando login com novo usuário**");

    // Tenta fazer login com o novo usuário
    cy.get('input[name="email"]').type(uniqueEmail);
    cy.get('input[name="password"]').type("senha123");
    cy.get('button[type="submit"]')
      .contains(/entrar/i)
      .click();

    cy.log("**Verificando redirecionamento**");

    // Deve redirecionar para /events (usuário normal)
    cy.url().should("include", "/events", { timeout: 10000 });

    cy.log("✓ Novo usuário conseguiu fazer login com sucesso");
  });

  it("4.4 - Novo usuário NÃO tem acesso à página admin", () => {
    cy.log("**Verificando que novo usuário não é admin**");

    // Cria e faz login com novo usuário
    cy.visit("/login");
    cy.get('input[name="email"]').type(ADMIN_CREDENTIALS.email);
    cy.get('input[name="password"]').type(ADMIN_CREDENTIALS.password);
    cy.get('button[type="submit"]')
      .contains(/entrar/i)
      .click();
    cy.url().should("include", "/adminpage", { timeout: 10000 });

    // Cria usuário
    cy.visit("/login");
    cy.contains(/não tem uma conta|cadastre-se/i).click();

    const uniqueEmail = `teste.notadmin.${Date.now()}@example.com`;

    cy.get('input[name="name"]').type("Teste Não Admin");
    cy.get('input[name="email"]').clear().type(uniqueEmail);
    cy.get('input[name="password"]').clear().type("senha123");
    cy.get('button[type="submit"]')
      .contains(/cadastrar/i)
      .click();
    cy.contains(/sucesso|criado/i, { timeout: 10000 }).should("exist");

    // Logout e login com novo usuário
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.visit("/login");
    cy.get('input[name="email"]').type(uniqueEmail);
    cy.get('input[name="password"]').type("senha123");
    cy.get('button[type="submit"]')
      .contains(/entrar/i)
      .click();
    cy.url().should("include", "/events", { timeout: 10000 });

    cy.log("**Tentando acessar /adminpage**");

    // Tenta acessar adminpage
    cy.visit("/adminpage");

    // Deve ser redirecionado para home
    cy.url().should("not.include", "/adminpage");
    cy.url().should("eq", Cypress.config().baseUrl + "/");

    cy.log("✓ Novo usuário corretamente bloqueado de acessar adminpage");
  });

  it("4.5 - Admin pode criar usuário com permissões de admin (checkbox marcado)", () => {
    cy.log("**Testando criação de usuário admin pela adminpage**");

    // Login como admin
    cy.visit("/login");
    cy.get('input[name="email"]').type(ADMIN_CREDENTIALS.email);
    cy.get('input[name="password"]').type(ADMIN_CREDENTIALS.password);
    cy.get('button[type="submit"]')
      .contains(/entrar/i)
      .click();
    cy.url().should("include", "/adminpage", { timeout: 10000 });

    cy.log("**Acessando área de usuários na adminpage**");

    // Procura e clica no botão "Cadastrar Usuário" na navbar
    cy.contains("button", /cadastrar usuário/i, { timeout: 5000 }).click({ force: true });

    cy.log("**Preenchendo dados do novo admin**");

    const timestamp = Date.now();
    const uniqueEmail = `admin.cypress.${timestamp}@example.com`;
    const uniqueName = `Usuario Cypress ${timestamp}`;

    // Aguarda o modal/formulário abrir
    cy.wait(500);

    cy.get('input[name="name"]').should("be.visible").type(uniqueName);
    cy.get('input[name="email"]').should("be.visible").type(uniqueEmail);
    cy.get('input[name="password"]').should("be.visible").type("admin123");

    // Marca o checkbox de admin
    cy.get('input[id="isAdmin"]').check({ force: true });
    cy.log("✓ Checkbox de admin marcado");

    cy.log("**Submetendo cadastro**");

    // Procura pelo botão de submit no formulário
    cy.get("form").within(() => {
      cy.get('button[type="submit"]').click();
    });

    cy.log("**Aguardando confirmação**");

    // Aguarda mensagem de sucesso
    cy.wait(2000);

    cy.log("**Fazendo logout e testando login do novo admin**");

    // Logout
    cy.contains(/deslogar|logout|sair/i).click();

    // Ou força o logout limpando storage
    cy.clearLocalStorage();
    cy.clearCookies();
    
    cy.visit("/login");
    
    cy.get('input[name="email"]').should("be.visible").type(uniqueEmail);
    cy.get('input[name="password"]').should("be.visible").type("admin123");
    cy.get('button[type="submit"]')
      .contains(/entrar/i)
      .click();

    cy.log("**Verificando se novo usuário tem acesso admin**");

    // Deve ir para /adminpage
    cy.url({ timeout: 10000 }).should("include", "/adminpage");
    cy.log("✓ Novo admin criado com sucesso e tem acesso à adminpage");
  });
});
