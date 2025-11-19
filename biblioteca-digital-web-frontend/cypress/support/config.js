/**
 * Arquivo de Configuração dos Testes E2E
 * 
 * Centralize aqui todas as configurações dos testes para facilitar manutenção.
 * Importe este arquivo nos seus testes para usar as configurações.
 */

export const TEST_CONFIG = {
  // URLs
  baseUrl: 'http://localhost:5173',
  apiUrl: 'http://localhost:3333',

  // Credenciais de Usuários
  users: {
    admin: {
      email: 'admin@teste.com',
      password: 'admin123',
      name: 'Admin Teste'
    },
    normalUser: {
      email: 'usuario@teste.com',
      password: 'usuario123',
      name: 'Usuário Teste'
    }
  },

  // Configurações de Busca
  search: {
    defaultTerm: 'artigo', // Termo que deve retornar resultados
    debounceDelay: 500     // Delay do debounce em milissegundos
  },

  // Arquivos para Upload
  files: {
    bibtexFile: '../../TesteBibTex/ArquivosBibText.bib',
    zipFile: '../../TesteBibTex/Hist4.zip'
  },

  // Timeouts
  timeouts: {
    short: 5000,      // 5 segundos
    medium: 10000,    // 10 segundos
    long: 30000       // 30 segundos (para uploads)
  },

  // Rotas da Aplicação
  routes: {
    home: '/',
    login: '/login',
    adminPage: '/adminpage',
    events: '/events',
    profile: '/profile'
  },

  // Seletores Comuns
  selectors: {
    emailInput: 'input[name="email"]',
    passwordInput: 'input[name="password"]',
    nameInput: 'input[name="name"]',
    submitButton: 'button[type="submit"]',
    fileInput: 'input[type="file"]',
    searchInput: 'input[type="text"]'
  }
};

// Helper para gerar email único
export const generateUniqueEmail = (prefix = 'teste') => {
  return `${prefix}.${Date.now()}@example.com`;
};

// Helper para gerar nome único
export const generateUniqueName = (prefix = 'Usuário Teste') => {
  return `${prefix} ${Date.now()}`;
};
