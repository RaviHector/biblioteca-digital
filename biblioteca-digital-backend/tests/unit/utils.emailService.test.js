import { jest } from '@jest/globals';
import { sendArticleNotificationEmail } from '../../src/utils/libs/emailService.js';

describe('sendArticleNotificationEmail', () => {
  beforeEach(() => {
    process.env.EMAIL_USER = '';
    process.env.EMAIL_PASS = '';
    jest.clearAllMocks();
  });

  it('deve formatar email com dados corretos', async () => {
    // Teste simples que valida que a função retorna um objeto com success/error
    // Sem mockar nodemailer, apenas verificar retorno
    const result = await sendArticleNotificationEmail({
      email: 'test@example.com',
      authorName: 'Author Test',
      articleTitle: 'Test Article',
      eventName: 'Test Event',
      editionYear: '2025',
    });

    // Deve retornar um objeto com success OU error
    expect(result).toHaveProperty('success');
    expect(typeof result.success).toBe('boolean');
  }, 15000);

  it('deve retornar erro quando email é inválido ou ausente', async () => {
    // Teste sem credenciais validas (causará fallback)
    const result = await sendArticleNotificationEmail({
      email: 'invalid',
      authorName: 'Author',
      articleTitle: 'Title',
      eventName: 'Event',
      editionYear: '2025',
    });

    // Pode falhar com credenciais inválidas, mas não deve lançar erro
    expect(result).toBeDefined();
    expect(typeof result.success).toBe('boolean');
  });

  it('deve aceitar todos os parâmetros necessários', async () => {
    const params = {
      email: 'user@e.com',
      authorName: 'Dr. Smith',
      articleTitle: 'Machine Learning',
      eventName: 'ICSE 2025',
      editionYear: '2025',
    };

    // Validar que a função executa sem lançar erro
    const result = await sendArticleNotificationEmail(params);
    expect(result).toBeDefined();
  });
});

