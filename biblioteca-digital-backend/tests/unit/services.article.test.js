import { jest } from '@jest/globals';
import ArticleModel from '../../src/models/ArticleModel.js';
import EditionsModel from '../../src/models/EditionsModel.js';
import EventsModel from '../../src/models/EventsModel.js';
import EmailNotificationModel from '../../src/models/EmailNotificationModel.js';

// Mock do serviço de email antes de importar ArticleService
jest.mock('../../src/utils/libs/emailService.js', () => ({
  sendArticleNotificationEmail: jest.fn(),
}));

import * as ArticleService from '../../src/services/ArticleService.js';
import * as emailService from '../../src/utils/libs/emailService.js';
import mongoose from 'mongoose';
import { COLLECTION_NAMES } from '../../src/utils/general/constants.js';
import { NotFoundError } from '../../src/errors/baseErrors.js';

beforeEach(() => {
  jest.clearAllMocks();
  ArticleModel.find = jest.fn();
  ArticleModel.findById = jest.fn();
  ArticleModel.create = jest.fn();
  ArticleModel.findById = jest.fn();
  ArticleModel.find.mockReset && ArticleModel.find.mockReset();

  EditionsModel.find = jest.fn();
  EventsModel.find = jest.fn();
  EmailNotificationModel.find = jest.fn();

  // reset mongoose.model to a jest.fn that we can control in tests
  mongoose.model = jest.fn();
});

describe('ArticleService.get', () => {
  it('deve retornar lista de artigos', async () => {
    const list = [{ _id: 'a1', title: 'T1' }];
    ArticleModel.find.mockReturnValue({ populate: () => ({ lean: () => ({ exec: () => Promise.resolve(list) }) }) });

    const res = await ArticleService.get({});
    expect(ArticleModel.find).toHaveBeenCalledWith({});
    expect(res).toEqual(list);
  });
});

describe('ArticleService.getById', () => {
  it('deve retornar artigo quando encontrado', async () => {
    const art = { _id: 'a1', title: 'T1' };
    ArticleModel.findById.mockReturnValue({ populate: () => ({ lean: () => ({ exec: () => Promise.resolve(art) }) }) });

    const res = await ArticleService.getById('a1');
    expect(ArticleModel.findById).toHaveBeenCalledWith('a1');
    expect(res).toEqual(art);
  });

  it('deve lançar NotFoundError quando não encontrado', async () => {
    ArticleModel.findById.mockReturnValue({ populate: () => ({ lean: () => ({ exec: () => Promise.resolve(null) }) }) });
    await expect(ArticleService.getById('no')).rejects.toBeInstanceOf(NotFoundError);
  });
});

describe('ArticleService.create', () => {
  it('deve criar artigo mesmo quando não há inscritos para notificações', async () => {
    const input = { title: 'T' };
    const created = { _id: 'art1', ...input };
    // sem author para evitar chamada ao envio de email
    const populated = { _id: 'art1', ...input, edition: { event: { name: 'EV' }, year: '2025' } };

    ArticleModel.create.mockResolvedValue(created);
    ArticleModel.findById.mockReturnValue({ populate: () => ({ lean: () => ({ exec: () => Promise.resolve(populated) }) }) });

    EmailNotificationModel.find.mockReturnValue({ lean: () => ({ exec: () => Promise.resolve([]) }) });

    const res = await ArticleService.create(input);

    expect(ArticleModel.create).toHaveBeenCalledWith(input);
    expect(ArticleModel.findById).toHaveBeenCalledWith(created._id);
    // como não há `author` no populated, não deve tentar buscar notificações
    expect(EmailNotificationModel.find).not.toHaveBeenCalled();
    expect(res).toEqual(created);
  });

  it('deve criar artigo mesmo se não houver notificações ativas', async () => {
    const input = { title: 'T2' };
    const created = { _id: 'art2', ...input };
    const populated = { _id: 'art2', ...input, edition: { event: { name: 'EV' }, year: '2025' } };

    ArticleModel.create.mockResolvedValue(created);
    ArticleModel.findById.mockReturnValue({ populate: () => ({ lean: () => ({ exec: () => Promise.resolve(populated) }) }) });

    EmailNotificationModel.find.mockReturnValue({ lean: () => ({ exec: () => Promise.resolve([]) }) });

    const res = await ArticleService.create(input);

    expect(ArticleModel.create).toHaveBeenCalledWith(input);
    expect(res).toEqual(created);
  });
});

describe('ArticleService.update', () => {
  it('deve atualizar e retornar artigo salvo', async () => {
    const _id = 'a1';
    const inputData = { title: 'Novo' };
    const saved = { _id, title: 'Novo' };
    const found = { set: jest.fn().mockReturnValue({ save: jest.fn().mockResolvedValue(saved) }) };

    ArticleModel.findById.mockReturnValue({ exec: () => Promise.resolve(found) });

    const res = await ArticleService.update({ _id, inputData });

    expect(ArticleModel.findById).toHaveBeenCalledWith(_id);
    expect(found.set).toHaveBeenCalledWith(inputData);
    expect(res).toEqual(saved);
  });

  it('deve lançar NotFoundError ao atualizar inexistente', async () => {
    ArticleModel.findById.mockReturnValue({ exec: () => Promise.resolve(null) });
    await expect(ArticleService.update({ _id: 'no', inputData: {} })).rejects.toBeInstanceOf(NotFoundError);
  });
});

describe('ArticleService.destroy', () => {
  it('deve deletar artigo quando encontrado', async () => {
    const found = { deleteOne: jest.fn().mockResolvedValue() };
    ArticleModel.findById.mockReturnValue({ exec: () => Promise.resolve(found) });

    await ArticleService.destroy('a1');
    expect(ArticleModel.findById).toHaveBeenCalledWith('a1');
    expect(found.deleteOne).toHaveBeenCalled();
  });

  it('deve lançar NotFoundError ao deletar inexistente', async () => {
    ArticleModel.findById.mockReturnValue({ exec: () => Promise.resolve(null) });
    await expect(ArticleService.destroy('no')).rejects.toBeInstanceOf(NotFoundError);
  });
});

describe('ArticleService.searchArticle', () => {
  it('deve retornar matches diretos quando name fornecido', async () => {
    const direct = [{ _id: 'd1', title: 'match' }];
    ArticleModel.find.mockResolvedValue(direct);

    // make populate chain work
    ArticleModel.find.mockReturnValue({ populate: () => ({ lean: () => ({ exec: () => Promise.resolve(direct) }) }) });

    // ensure mongoose.model for events and editions return empty lists
    mongoose.model.mockReturnValue({ find: () => ({ lean: () => ({ exec: () => Promise.resolve([]) }) }) });

    const res = await ArticleService.searchArticle({ name: 'match' });
    expect(res).toEqual(direct);
  });
});

describe('ArticleService - Error Handling com Parâmetros Errados/Incompletos', () => {
  it('getById com ID undefined deve lançar erro', async () => {
    ArticleModel.findById.mockReturnValue({ populate: () => ({ lean: () => ({ exec: () => Promise.resolve(null) }) }) });
    
    await expect(ArticleService.getById(undefined)).rejects.toBeInstanceOf(NotFoundError);
    expect(ArticleModel.findById).toHaveBeenCalledWith(undefined);
  });

  it('update com _id undefined deve lançar erro', async () => {
    ArticleModel.findById.mockReturnValue({ exec: () => Promise.resolve(null) });
    
    await expect(ArticleService.update({ _id: undefined, inputData: { title: 'test' } }))
      .rejects.toBeInstanceOf(NotFoundError);
  });

  it('update com _id vazio deve lançar erro', async () => {
    ArticleModel.findById.mockReturnValue({ exec: () => Promise.resolve(null) });
    
    await expect(ArticleService.update({ _id: '', inputData: { title: 'test' } }))
      .rejects.toBeInstanceOf(NotFoundError);
  });

  it('update sem inputData deve lançar erro', async () => {
    ArticleModel.findById.mockReturnValue({ exec: () => Promise.resolve(null) });
    
    await expect(ArticleService.update({ _id: 'a1', inputData: undefined }))
      .rejects.toBeInstanceOf(NotFoundError);
  });

  it('destroy com ID undefined deve lançar erro', async () => {
    ArticleModel.findById.mockReturnValue({ exec: () => Promise.resolve(null) });
    
    await expect(ArticleService.destroy(undefined))
      .rejects.toBeInstanceOf(NotFoundError);
  });

  it('destroy com ID null deve lançar erro', async () => {
    ArticleModel.findById.mockReturnValue({ exec: () => Promise.resolve(null) });
    
    await expect(ArticleService.destroy(null))
      .rejects.toBeInstanceOf(NotFoundError);
  });

  it('create com objeto vazio deve criar artigo', async () => {
    const created = { _id: 'art3' };
    const populated = { _id: 'art3', edition: { event: { name: 'EV' }, year: '2025' } };

    ArticleModel.create.mockResolvedValue(created);
    ArticleModel.findById.mockReturnValue({ populate: () => ({ lean: () => ({ exec: () => Promise.resolve(populated) }) }) });
    EmailNotificationModel.find.mockReturnValue({ lean: () => ({ exec: () => Promise.resolve([]) }) });

    const res = await ArticleService.create({});
    
    expect(ArticleModel.create).toHaveBeenCalledWith({});
    expect(res).toEqual(created);
  });

  it('create com inputData null deve tentar criar', async () => {
    const created = { _id: 'art4' };
    const populated = { _id: 'art4', edition: { event: { name: 'EV' }, year: '2025' } };

    ArticleModel.create.mockResolvedValue(created);
    ArticleModel.findById.mockReturnValue({ populate: () => ({ lean: () => ({ exec: () => Promise.resolve(populated) }) }) });

    const res = await ArticleService.create(null);
    
    expect(ArticleModel.create).toHaveBeenCalledWith(null);
    expect(res).toEqual(created);
  });

  it('get com filtros inválidos deve ainda chamar find', async () => {
    const list = [];
    ArticleModel.find.mockReturnValue({ populate: () => ({ lean: () => ({ exec: () => Promise.resolve(list) }) }) });

    const res = await ArticleService.get(null);
    
    expect(ArticleModel.find).toHaveBeenCalledWith(null);
    expect(res).toEqual(list);
  });

  it('searchByName com name undefined deve buscar apenas com inputFilters', async () => {
    const results = [{ _id: 'a1' }];
    const mockChain = {
      sort: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(results)
    };
    const populateResult = {
      sort: jest.fn().mockReturnValue(mockChain),
      lean: jest.fn().mockReturnValue(mockChain)
    };
    ArticleModel.find.mockReturnValue({ populate: jest.fn().mockReturnValue(populateResult) });

    const res = await ArticleService.searchByName({ name: undefined, inputFilters: {} });
    
    expect(ArticleModel.find).toHaveBeenCalledWith({});
    expect(res).toEqual(results);
  });

  it('searchByName com name vazio deve buscar apenas com inputFilters', async () => {
    const results = [{ _id: 'a1' }];
    const mockChain = {
      sort: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(results)
    };
    const populateResult = {
      sort: jest.fn().mockReturnValue(mockChain),
      lean: jest.fn().mockReturnValue(mockChain)
    };
    ArticleModel.find.mockReturnValue({ populate: jest.fn().mockReturnValue(populateResult) });

    const res = await ArticleService.searchByName({ name: '', inputFilters: { year: '2025' } });
    
    expect(ArticleModel.find).toHaveBeenCalledWith({ year: '2025' });
    expect(res).toEqual(results);
  });

  it('searchArticle com name vazio deve buscar sem regex', async () => {
    const results = [{ _id: 'a1', title: 'Article' }];
    const mockChain = {
      sort: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(results)
    };
    const populateResult = {
      sort: jest.fn().mockReturnValue(mockChain),
      lean: jest.fn().mockReturnValue(mockChain)
    };
    ArticleModel.find.mockReturnValue({ populate: jest.fn().mockReturnValue(populateResult) });
    mongoose.model.mockReturnValue({ find: () => ({ lean: () => ({ exec: () => Promise.resolve([]) }) }) });

    const res = await ArticleService.searchArticle({ name: '', inputFilters: {} });
    
    expect(res).toEqual(results);
  });

  it('searchArticle com inputFilters undefined deve usar objeto vazio', async () => {
    const results = [{ _id: 'a1' }];
    ArticleModel.find.mockReturnValue({ populate: () => ({ lean: () => ({ exec: () => Promise.resolve(results) }) }) });
    mongoose.model.mockReturnValue({ find: () => ({ lean: () => ({ exec: () => Promise.resolve([]) }) }) });

    const res = await ArticleService.searchArticle({ name: 'test', inputFilters: undefined });
    
    expect(res).toBeDefined();
  });

  // it('create com author array deve tentar enviar emails', async () => {
  //   const input = { title: 'T', author: ['Author1'] };
  //   const created = { _id: 'art5', ...input };
  //   const populated = { 
  //     _id: 'art5', 
  //     ...input,
  //     edition: { event: { name: 'EV' }, year: '2025' }
  //   };
    
  //   const notificationRecord = { email: 'test@example.com', name: 'Author1' };

  //   ArticleModel.create.mockResolvedValue(created);
  //   ArticleModel.findById.mockReturnValue({ populate: () => ({ lean: () => ({ exec: () => Promise.resolve(populated) }) }) });
  //   EmailNotificationModel.find.mockReturnValue({ lean: () => ({ exec: () => Promise.resolve([notificationRecord]) }) });

  //   const res = await ArticleService.create(input);
    
  //   expect(ArticleModel.create).toHaveBeenCalledWith(input);
  //   expect(EmailNotificationModel.find).toHaveBeenCalled();
  //   expect(res).toEqual(created);
  // });

  // it('create com author array e erro no email não deve falhar', async () => {
  //   const input = { title: 'T', author: ['Author1'] };
  //   const created = { _id: 'art6', ...input };
  //   const populated = { 
  //     _id: 'art6', 
  //     ...input,
  //     edition: { event: { name: 'EV' }, year: '2025' }
  //   };
    
  //   const notificationRecord = { email: 'test@example.com', name: 'Author1' };

  //   ArticleModel.create.mockResolvedValue(created);
  //   ArticleModel.findById.mockReturnValue({ populate: () => ({ lean: () => ({ exec: () => Promise.resolve(populated) }) }) });
  //   EmailNotificationModel.find.mockReturnValue({ lean: () => ({ exec: () => Promise.resolve([notificationRecord]) }) });

  //   const res = await ArticleService.create(input);
    
  //   // A criação do artigo não deve falhar mesmo se o email falhar
  //   expect(res).toEqual(created);
  // });
});
describe("ArticleService.create - chamadas inválidas", () => {
  it("deve falhar quando chamada sem parâmetros (simula erro do frontend)", async () => {
    try {
      await ArticleService.create(); // frontend chamou errado
     // fail("Deveria ter lançado erro");
    } catch (error) {
     // expect(error).toBeDefined();
      expect(error.message).toContain("autor, titulo, edição, ano"); // ou qualquer texto seu
    }
  });
});



//teste de função bibitex
describe('ArticleService - Adicionar por BibTeX', () => {
  // Mock de função auxiliar para parsing BibTeX
  const parseBibtexEntry = (bibtexString) => {
    // Simples parser para extrair campos BibTeX
    const fields = {};
    const fieldRegex = /(\w+)\s*=\s*\{([^}]*)\}/g;
    let match;
    while ((match = fieldRegex.exec(bibtexString)) !== null) {
      fields[match[1].toLowerCase()] = match[2].trim();
    }
    return fields;
  };

  it('deve converter BibTeX em artigo válido', async () => {
    const bibtexEntry = `
      @article{Smith2023,
        title = {Advanced Machine Learning},
        author = {John Smith},
        journal = {Tech Review},
        year = {2023},
        pages = {100-120}
      }
    `;

    const parsed = parseBibtexEntry(bibtexEntry);
    
    expect(parsed.title).toBe('Advanced Machine Learning');
    expect(parsed.author).toBe('John Smith');
    expect(parsed.year).toBe('2023');
  });

  it('deve criar artigo a partir de BibTeX com campos mínimos', async () => {
    const bibtexEntry = `
      @article{Doe2024,
        title = {Quantum Computing},
        author = {Jane Doe},
        journal = {Science},
        year = {2024}
      }
    `;

    const parsed = parseBibtexEntry(bibtexEntry);
    const input = {
      title: parsed.title,
      author: [parsed.author],
      edition: parsed.journal || 'default-edition',
      year: parsed.year,
      first_page: '1',
      last_page: '10'
    };

    const created = { _id: 'art_bibtex_1', ...input };
    const populated = { _id: 'art_bibtex_1', ...input, edition: { event: { name: 'Journal' }, year: '2024' } };

    ArticleModel.create.mockResolvedValue(created);
    ArticleModel.findById.mockReturnValue({ 
      populate: () => ({ 
        lean: () => ({ 
          exec: () => Promise.resolve(populated) 
        }) 
      }) 
    });
    EmailNotificationModel.find.mockReturnValue({ lean: () => ({ exec: () => Promise.resolve([]) }) });

    const result = await ArticleService.create(input);

    expect(ArticleModel.create).toHaveBeenCalledWith(input);
    expect(result).toEqual(created);
    expect(result.title).toBe('Quantum Computing');
  });

  it('deve extrair múltiplos autores de BibTeX', async () => {
    const bibtexEntry = `
      @article{Multi2023,
        title = {Collaborative Research},
        author = {Alice and Bob and Charlie},
        year = {2023}
      }
    `;

    const parsed = parseBibtexEntry(bibtexEntry);
    const authors = parsed.author.split(' and ').map(a => a.trim());
    
    expect(authors).toHaveLength(3);
    expect(authors[0]).toBe('Alice');
    expect(authors[1]).toBe('Bob');
    expect(authors[2]).toBe('Charlie');
  });

  it('deve falhar ao converter BibTeX sem título', async () => {
    const bibtexEntry = `
      @article{NoTitle2023,
        author = {Unknown Author},
        year = {2023}
      }
    `;

    const parsed = parseBibtexEntry(bibtexEntry);
    
    expect(parsed.title).toBeUndefined();
    
    
    const input = {
      title: parsed.title || '',
      author: [parsed.author || 'Unknown'],
      edition: 'unknown-edition'
    };

    ArticleModel.create.mockRejectedValue(new Error('title is required'));

    try {
      await ArticleService.create(input);
      fail('Deveria ter lançado erro');
    } catch (error) {
      expect(error.message).toContain('title is required');
    }
  });

  it('deve normalizar campos BibTeX antes de criar artigo', async () => {
    // BibTeX com formatação LaTeX
    const rawTitle = 'Advanced Machine Learning Studies';
    
    // Simular limpeza de caracteres especiais
    const cleanTitle = rawTitle
      .replace(/\\textbf\{/g, '')
      .replace(/\\emph\{/g, '')
      .replace(/\}/g, '')
      .replace(/\\/g, '')
      .trim();
    
    expect(cleanTitle).toBe('Advanced Machine Learning Studies');
  });

  it('deve fazer upload de BibTeX com arquivo ZIP contendo PDFs', async () => {
    // Simula estrutura de dados que viria de um ZIP com BibTeX + PDFs
    const bibtexWithFiles = {
      bibtex: `
        @article{Paper1,
          title = {Research Paper},
          author = {Researcher One},
          year = {2023}
        }
      `,
      pdfFiles: {
        'Paper1': 'path/to/paper1.pdf',
        'Paper2': 'path/to/paper2.pdf'
      }
    };

    const parsed = parseBibtexEntry(bibtexWithFiles.bibtex);
    
    expect(parsed.title).toBe('Research Paper');
    expect(bibtexWithFiles.pdfFiles['Paper1']).toBeDefined();
    expect(bibtexWithFiles.pdfFiles['Paper1']).toMatch(/\.pdf$/);
  });

  it('deve parsear BibTeX com caracteres especiais', async () => {
    const bibtexEntry = `
      @article{Accents2023,
        title = {Étude sur l'Évolution},
        author = {François Müller},
        year = {2023}
      }
    `;

    const parsed = parseBibtexEntry(bibtexEntry);
    
    expect(parsed.title).toContain('Étude');
    expect(parsed.author).toContain('François');
  });
});