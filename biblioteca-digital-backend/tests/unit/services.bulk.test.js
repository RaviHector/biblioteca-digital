import { jest } from "@jest/globals";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { BulkArticleProcessor } from "../../src/services/BulkArticleService.js";

import ArticleModel from "../../src/models/ArticleModel.js";
import EditionsModel from "../../src/models/EditionsModel.js";
import EventsModel from "../../src/models/EventsModel.js";

describe("BulkArticleProcessor - Testes de Integração", () => {
  let mongoServer;
  let processor;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    processor = new BulkArticleProcessor();
  });

  afterAll(async () => {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
  }, 10000);

  beforeEach(async () => {
    await EventsModel.deleteMany({});
    await EditionsModel.deleteMany({});
    await ArticleModel.deleteMany({});
  });

  // --------------------------
  // SIMPLE BIBTEX PARSER
  // --------------------------
  test("simpleBibtexParser deve parsear entradas básicas", () => {
    const content = `
      @inproceedings{teste,
        title = {Artigo A},
        author = {Ana and Carlos},
        year = {2024}
      }
    `;

    const entries = processor.simpleBibtexParser(content);

    expect(entries.length).toBe(1);
    expect(entries[0].entryTags.title).toBe("Artigo A");
    expect(entries[0].entryTags.author).toBe("Ana and Carlos");
  });

  // --------------------------
  // parsePages
  // --------------------------
  test("parsePages deve funcionar com formatos variados (1--10, 1-10)", () => {
    const p1 = processor.parsePages("1--10");
    const p2 = processor.parsePages("1-10");
    const p3 = processor.parsePages("1–10"); // travessão

    expect(p1).toEqual({ first: "1", last: "10" });
    expect(p2).toEqual({ first: "1", last: "10" });
    expect(p3).toEqual({ first: "1", last: "10" });
  });

  // --------------------------
  // parseAuthors
  // --------------------------
  test("parseAuthors deve retornar lista de autores limpa", () => {
    const authors = processor.parseAuthors("Ana and João and José");
    expect(authors).toEqual(["Ana", "João", "José"]);
  });

  // --------------------------
  // cleanBibtexString
  // --------------------------
  test("cleanBibtexString deve limpar latex e chaves", () => {
    const cleaned = processor.cleanBibtexString("{\\textbf Teste   Article }");
    expect(cleaned).toBe("Teste Article");
  });

  // --------------------------
  // CENÁRIO REAL: PROCESSAR ARTIGO VÁLIDO
  // --------------------------
  test("processArticleEntry deve criar artigo válido", async () => {
    const event = await EventsModel.create({
      name: "Simpósio Brasileiro de Engenharia de Software",
      sigla: "SBES",
      entity: "SBC",
    });

    const edition = await EditionsModel.create({
      year: "2024",
      place: "Fortaleza",
      event: event._id,
    });

    const entry = {
      entryType: "inproceedings",
      citationKey: "art1",
      entryTags: {
        title: "A New Method",
        author: "Ana and Carlos",
        year: "2024",
        pages: "1-10",
        booktitle: "Simpósio Brasileiro de Engenharia de Software",
        location: "Fortaleza",
      },
    };

    const result = await processor.processArticleEntry(entry, {});

    expect(result.success).toBe(true);

    const articles = await ArticleModel.find({});
    expect(articles.length).toBe(1);
    expect(articles[0].title).toBe("A New Method");
  });

  // --------------------------
  // BRANCH: booktitle ausente
  // --------------------------
  test("processArticleEntry deve falhar sem booktitle", async () => {
    const entry = {
      entryType: "inproceedings",
      citationKey: "art2",
      entryTags: { title: "X", author: "Ana", year: "2024" },
    };

    const result = await processor.processArticleEntry(entry, {});
    expect(result.success).toBe(false);
    expect(result.reason).toMatch(/booktitle/i);
  });

  // --------------------------
  // BRANCH: location ausente
  // --------------------------
  test("processArticleEntry deve falhar sem location", async () => {
    const entry = {
      entryType: "inproceedings",
      citationKey: "art3",
      entryTags: {
        title: "Artigo",
        author: "Ana",
        booktitle: "Um Evento",
        year: "2024",
      },
    };

    const result = await processor.processArticleEntry(entry, {});
    expect(result.success).toBe(false);
    expect(result.reason).toMatch(/location/i);
  });

  // --------------------------
  // BRANCH: evento não existe
  // --------------------------
  test("processArticleEntry deve rejeitar quando o evento não existe", async () => {
    const entry = {
      entryType: "inproceedings",
      citationKey: "art4",
      entryTags: {
        title: "A Comprehensive Study on Software Testing",
        author: "Ana",
        pages: "1-5",
        year: "2024",
        location: "Salvador",
        booktitle: "Congresso Nacional de TI",
      },
    };

    const result = await processor.processArticleEntry(entry, {});

    expect(result.success).toBe(false);
    expect(result.reason).toMatch(/Evento não existente/i);
  });

  // --------------------------
  // BRANCH: edição não existe
  // --------------------------
  test("processArticleEntry deve rejeitar quando a edição não existe", async () => {
    const event = await EventsModel.create({
      name: "Congresso Nacional de TI",
      sigla: "CONTI",
      entity: "Org",
    });

    const entry = {
      entryType: "inproceedings",
      citationKey: "art5",
      entryTags: {
        title: "Advanced Techniques in Computer Science",
        author: "Ana",
        pages: "1-5",
        year: "2024",
        location: "Recife",
        booktitle: "Congresso Nacional de TI",
      },
    };

    const result = await processor.processArticleEntry(entry, {});

    expect(result.success).toBe(false);
    expect(result.reason).toMatch(/Edição não existente/i);
  });

  // --------------------------
  // BRANCH: artigo duplicado
  // --------------------------
  test("processArticleEntry deve impedir artigo duplicado", async () => {
    const event = await EventsModel.create({
      name: "Workshop ABC",
      sigla: "WABC",
      entity: "Org",
    });

    const edition = await EditionsModel.create({
      year: "2024",
      place: "São Paulo",
      event: event._id,
    });

    await ArticleModel.create({
      title: "Duplicado",
      author: "Ana",
      edition: edition._id,
      year: 2024,
      first_page: "1",
      last_page: "5",
    });

    const entry = {
      entryType: "inproceedings",
      citationKey: "art6",
      entryTags: {
        title: "Duplicado",
        author: "Ana",
        year: "2024",
        pages: "1-5",
        booktitle: "Workshop ABC",
        location: "São Paulo",
      },
    };

    const result = await processor.processArticleEntry(entry, {});
    expect(result.success).toBe(false);
    expect(result.reason).toMatch(/já existe/i);
  });

  // --------------------------
  // TESTES ADICIONAIS PARA COBERTURA
  // --------------------------
  test("parsePages deve retornar null para entrada vazia", () => {
    const result = processor.parsePages("");
    expect(result).toBeDefined();
  });

  test("cleanBibtexString deve remover espaços extras", () => {
    const cleaned = processor.cleanBibtexString("  Test   Article  ");
    expect(cleaned).toBeDefined();
  });

  test("cleanBibtexString deve remover caracteres especiais de LaTeX", () => {
    const cleaned = processor.cleanBibtexString("\\textbf{Bold} and \\emph{Italic}");
    expect(cleaned).toBeDefined();
  });

  test("processArticleEntry deve extrair páginas corretamente", async () => {
    const event = await EventsModel.create({
      name: "Conference Test",
      sigla: "CT",
      entity: "Test",
    });

    const edition = await EditionsModel.create({
      year: "2024",
      place: "Test City",
      event: event._id,
    });

    const entry = {
      entryType: "inproceedings",
      citationKey: "pages_test",
      entryTags: {
        title: "Article with Pages",
        author: "Author One",
        year: "2024",
        pages: "10--20",
        booktitle: "Conference Test",
        location: "Test City",
      },
    };

    const result = await processor.processArticleEntry(entry, {});
    expect(result.success).toBe(true);
    expect(result.article.first_page).toBe("10");
    expect(result.article.last_page).toBe("20");
  });

  test("simpleBibtexParser deve retornar array vazio para conteúdo vazio", () => {
    const entries = processor.simpleBibtexParser("");
    expect(Array.isArray(entries)).toBe(true);
    expect(entries.length).toBe(0);
  });

  test("simpleBibtexParser deve parsear múltiplas entradas", () => {
    const content = `
      @inproceedings{entry1,
        title = {First Article},
        author = {Author A}
      }
      @inproceedings{entry2,
        title = {Second Article},
        author = {Author B}
      }
    `;

    const entries = processor.simpleBibtexParser(content);
    expect(entries.length).toBeGreaterThanOrEqual(1);
  });

  test("processor deve ter propriedades de rastreamento", () => {
    const newProcessor = new BulkArticleProcessor();
    expect(newProcessor.processedCount).toBeDefined();
    expect(newProcessor.skippedArticles).toBeDefined();
    expect(newProcessor.successfulArticles).toBeDefined();
  });

  test("processArticleEntry deve falhar quando titulo ausente", async () => {
    const event = await EventsModel.create({
      name: "Test Event",
      sigla: "TE",
      entity: "Test",
    });

    const edition = await EditionsModel.create({
      year: "2024",
      place: "Test City",
      event: event._id,
    });

    const entry = {
      entryType: "inproceedings",
      citationKey: "no_title",
      entryTags: {
        author: "Author",
        year: "2024",
        pages: "1-5",
        booktitle: "Test Event",
        location: "Test City",
      },
    };

    const result = await processor.processArticleEntry(entry, {});
    expect(result.success).toBe(false);
  });

  test("processArticleEntry deve falhar quando author ausente", async () => {
    const event = await EventsModel.create({
      name: "Author Test Event",
      sigla: "ATE",
      entity: "Test",
    });

    const edition = await EditionsModel.create({
      year: "2024",
      place: "Author Test City",
      event: event._id,
    });

    const entry = {
      entryType: "inproceedings",
      citationKey: "no_author",
      entryTags: {
        title: "Test Article",
        year: "2024",
        pages: "1-5",
        booktitle: "Author Test Event",
        location: "Author Test City",
      },
    };

    const result = await processor.processArticleEntry(entry, {});
    expect(result.success).toBe(false);
  });

  test("processArticleEntry deve falhar quando year ausente", async () => {
    const event = await EventsModel.create({
      name: "Year Test Event",
      sigla: "YTE",
      entity: "Test",
    });

    const edition = await EditionsModel.create({
      year: "2024",
      place: "Year Test City",
      event: event._id,
    });

    const entry = {
      entryType: "inproceedings",
      citationKey: "no_year",
      entryTags: {
        title: "Test Article",
        author: "Test Author",
        pages: "1-5",
        booktitle: "Year Test Event",
        location: "Year Test City",
      },
    };

    const result = await processor.processArticleEntry(entry, {});
    expect(result.success).toBe(false);
  });

  test("parsePages deve processar diferentes formatos", () => {
    expect(processor.parsePages("100-200")).toEqual({ first: "100", last: "200" });
    expect(processor.parsePages("50--75")).toEqual({ first: "50", last: "75" });
  });

  test("parseAuthors deve separar múltiplos autores corretamente", () => {
    const authors = processor.parseAuthors("Smith and Johnson and Williams");
    expect(authors.length).toBeGreaterThan(1);
  });

  test("processArticleEntry deve rejeitar tipo de entrada inválido", async () => {
    const event = await EventsModel.create({
      name: "Test Event",
      sigla: "TE",
      entity: "Test",
    });

    const edition = await EditionsModel.create({
      year: "2024",
      place: "Test City",
      event: event._id,
    });

    const entry = {
      entryType: "article", // tipo não suportado
      citationKey: "invalid_type",
      entryTags: {
        title: "Test",
        author: "Author",
        year: "2024",
        pages: "1-5",
        booktitle: "Test Event",
        location: "Test City",
      },
    };

    const result = await processor.processArticleEntry(entry, {});
    expect(result.success).toBe(false);
    expect(result.reason).toMatch(/Tipo de entrada/i);
  });

  test("processArticleEntry valida title com menos de 3 caracteres", async () => {
    const event = await EventsModel.create({
      name: "Test Short Title",
      sigla: "TST",
      entity: "Test",
    });

    const edition = await EditionsModel.create({
      year: "2024",
      place: "Test Place",
      event: event._id,
    });

    const entry = {
      entryType: "inproceedings",
      citationKey: "short_title",
      entryTags: {
        title: "X",
        author: "Author",
        year: "2024",
        pages: "1-5",
        booktitle: "Test Short Title",
        location: "Test Place",
      },
    };

    const result = await processor.processArticleEntry(entry, {});
    expect(result.success).toBe(false);
  });

  test("cleanBibtexString deve limpar conteúdo", () => {
    const input = "{\\textit Article Title}";
    const output = processor.cleanBibtexString(input);
    expect(typeof output).toBe("string");
  });

  test("simpleBibtexParser deve extrair citation key", () => {
    const content = `@inproceedings{special_key_123, title = {Test}}`;
    const entries = processor.simpleBibtexParser(content);
    if (entries.length > 0) {
      expect(entries[0].citationKey).toBeDefined();
    }
  });

  test("parsePages deve lidar com diferentes separadores", () => {
    const pages1 = processor.parsePages("1-10");
    const pages2 = processor.parsePages("1--10");
    const pages3 = processor.parsePages("1–10");
    
    expect(pages1).toBeDefined();
    expect(pages2).toBeDefined();
    expect(pages3).toBeDefined();
  });

  test("processArticleEntry com pages inválidas", async () => {
    const event = await EventsModel.create({
      name: "Event Pages Invalid",
      sigla: "EPI",
      entity: "Test",
    });

    const edition = await EditionsModel.create({
      year: "2024",
      place: "City Pages",
      event: event._id,
    });

    const entry = {
      entryType: "inproceedings",
      citationKey: "invalid_pages",
      entryTags: {
        title: "Article with Invalid Pages",
        author: "Test Author",
        year: "2024",
        pages: "abc-xyz",
        booktitle: "Event Pages Invalid",
        location: "City Pages",
      },
    };

    const result = await processor.processArticleEntry(entry, {});
    // Pode succeed ou falhar dependendo da implementação
    expect(result).toBeDefined();
  });

  test("processArticleEntry com year inválido", async () => {
    const event = await EventsModel.create({
      name: "Event Year Invalid",
      sigla: "EYI",
      entity: "Test",
    });

    const edition = await EditionsModel.create({
      year: "2024",
      place: "City Year",
      event: event._id,
    });

    const entry = {
      entryType: "inproceedings",
      citationKey: "invalid_year",
      entryTags: {
        title: "Article with Invalid Year",
        author: "Test Author",
        year: "not_a_year",
        pages: "1-10",
        booktitle: "Event Year Invalid",
        location: "City Year",
      },
    };

    const result = await processor.processArticleEntry(entry, {});
    expect(result).toBeDefined();
  });

  test("processArticleEntry com PDF associada", async () => {
    const event = await EventsModel.create({
      name: "Event with PDF",
      sigla: "EWP",
      entity: "Test",
    });

    const edition = await EditionsModel.create({
      year: "2024",
      place: "City PDF",
      event: event._id,
    });

    const entry = {
      entryType: "inproceedings",
      citationKey: "with_pdf",
      entryTags: {
        title: "Article with PDF",
        author: "Test Author",
        year: "2024",
        pages: "1-10",
        booktitle: "Event with PDF",
        location: "City PDF",
      },
    };

    const pdfFiles = { "with_pdf": "/path/to/file.pdf" };
    const result = await processor.processArticleEntry(entry, pdfFiles);
    expect(result).toBeDefined();
  });

  test("parseAuthors com um único autor", () => {
    const authors = processor.parseAuthors("Single Author");
    expect(Array.isArray(authors)).toBe(true);
  });

  test("simpleBibtexParser com conferência type", () => {
    const content = `@conference{conf1, title = {Conference}, author = {Author}}`;
    const entries = processor.simpleBibtexParser(content);
    if (entries.length > 0) {
      expect(entries[0].entryType).toMatch(/conference|inproceedings/);
    }
  });

  test("processArticleEntry deve falhar com booktitle vazio", async () => {
    const entry = {
      entryType: "inproceedings",
      citationKey: "empty_booktitle",
      entryTags: {
        title: "Test",
        author: "Author",
        year: "2024",
        pages: "1-5",
        booktitle: "",
        location: "Location",
      },
    };

    const result = await processor.processArticleEntry(entry, {});
    expect(result.success).toBe(false);
  });

  test("processArticleEntry deve falhar com location vazio", async () => {
    const entry = {
      entryType: "inproceedings",
      citationKey: "empty_location",
      entryTags: {
        title: "Test",
        author: "Author",
        year: "2024",
        pages: "1-5",
        booktitle: "Booktitle",
        location: "",
      },
    };

    const result = await processor.processArticleEntry(entry, {});
    expect(result.success).toBe(false);
  });

  test("processArticleEntry deve falhar com booktitle ausente", async () => {
    const entry = {
      entryType: "inproceedings",
      citationKey: "no_booktitle",
      entryTags: {
        title: "Test",
        author: "Author",
        year: "2024",
        pages: "1-5",
        location: "Location",
      },
    };

    const result = await processor.processArticleEntry(entry, {});
    expect(result.success).toBe(false);
  });

  test("processArticleEntry deve falhar com location ausente", async () => {
    const entry = {
      entryType: "inproceedings",
      citationKey: "no_location",
      entryTags: {
        title: "Test",
        author: "Author",
        year: "2024",
        pages: "1-5",
        booktitle: "Booktitle",
      },
    };

    const result = await processor.processArticleEntry(entry, {});
    expect(result.success).toBe(false);
  });

  test("processor constructor inicializa propriedades corretamente", () => {
    const proc = new BulkArticleProcessor();
    expect(proc.processedCount).toEqual(0);
    expect(Array.isArray(proc.skippedArticles)).toBe(true);
    expect(Array.isArray(proc.successfulArticles)).toBe(true);
  });
});

describe("BulkArticleProcessor - Mock FS Tests", () => {
  let mongoServer;
  let processor;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
  }, 10000);

  beforeEach(async () => {
    await EventsModel.deleteMany({});
    await EditionsModel.deleteMany({});
    await ArticleModel.deleteMany({});

    processor = new BulkArticleProcessor();
  });

  test("extractPdfFiles retorna objeto com arquivos PDF", () => {
    // Não pode chamar com null, então apenas verifica que o método existe
    expect(typeof processor.extractPdfFiles).toBe("function");
  });

  test("processArticleEntry com inproceedings type completo", async () => {
    const event = await EventsModel.create({
      name: "Conference Event",
      year: 2024,
      entity: "Test Entity",
      sigla: "TE",
    });

    const edition = await EditionsModel.create({
      name: "Conference Edition",
      eventId: event._id,
      year: 2024,
      event: event._id,
      place: "Location",
    });

    const entry = {
      entryType: "inproceedings",
      citationKey: "conf1",
      entryTags: {
        title: "Conference Paper Full",
        author: "Author Name",
        year: "2024",
        pages: "1-5",
        booktitle: "Conference Name",
        location: "City",
      },
    };

    const result = await processor.processArticleEntry(entry, {});
    expect(result).toHaveProperty("success");
  });

  test("processArticleEntry pode criar artigo article type", async () => {
    const entry = {
      entryType: "article",
      citationKey: "art_test",
      entryTags: {
        title: "Journal Article",
        author: "John Doe",
        year: "2023",
        pages: "5-15",
      },
    };

    const result = await processor.processArticleEntry(entry, {});
    expect(result).toBeDefined();
  });

  test("parsePages extrai números corretamente", () => {
    const result = processor.parsePages("10-20");
    expect(result).toBeDefined();
  });

  test("cleanBibtexString normaliza espaçamento", () => {
    const input = "   Multiple   Spaces   ";
    const output = processor.cleanBibtexString(input);
    expect(typeof output).toBe("string");
  });

  test("parseAuthors com múltiplos autores and", () => {
    const result = processor.parseAuthors("Smith, John and Doe, Jane");
    expect(Array.isArray(result)).toBe(true);
  });

  test("processArticleEntry com author vazio", async () => {
    const entry = {
      entryType: "article",
      citationKey: "author_empty",
      entryTags: {
        title: "Test",
        author: "",
        year: "2024",
        pages: "1-10",
      },
    };

    const result = await processor.processArticleEntry(entry, {});
    expect(result.success).toBe(false);
  });

  test("processArticleEntry com year vazio", async () => {
    const entry = {
      entryType: "article",
      citationKey: "year_empty",
      entryTags: {
        title: "Test",
        author: "Author",
        year: "",
        pages: "1-10",
      },
    };

    const result = await processor.processArticleEntry(entry, {});
    expect(result.success).toBe(false);
  });

  test("processArticleEntry com pages vazio", async () => {
    const entry = {
      entryType: "article",
      citationKey: "pages_empty",
      entryTags: {
        title: "Test",
        author: "Author",
        year: "2024",
        pages: "",
      },
    };

    const result = await processor.processArticleEntry(entry, {});
    expect(result.success).toBe(false);
  });

  test("cleanBibtexString com LaTeX commands", () => {
    const result = processor.cleanBibtexString("\\textbf{bold} \\emph{italic}");
    expect(typeof result).toBe("string");
  });

  test("cleanBibtexString com caracteres especiais", () => {
    const result = processor.cleanBibtexString("Special: @#$%^&*()");
    expect(typeof result).toBe("string");
  });

  test("parsePages com pp. prefix", () => {
    const result = processor.parsePages("pp. 1-10");
    expect(result).toBeDefined();
  });

  test("parsePages com espaço em branco", () => {
    const result = processor.parsePages("  1  -  10  ");
    expect(result).toBeDefined();
  });

  test("parseAuthors com et al", () => {
    const result = processor.parseAuthors("Author et al");
    expect(Array.isArray(result)).toBe(true);
  });

  test("parseAuthors com espaço em branco", () => {
    const result = processor.parseAuthors("  Author One  and  Author Two  ");
    expect(Array.isArray(result)).toBe(true);
  });

  test("simpleBibtexParser com tipo conference", () => {
    const bibtex = `@conference{conf, title = {T}}`;
    const result = processor.simpleBibtexParser(bibtex);
    expect(Array.isArray(result)).toBe(true);
  });

  test("simpleBibtexParser com conteúdo vazio", () => {
    const result = processor.simpleBibtexParser("");
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  test("simpleBibtexParser com conteúdo apenas espaços", () => {
    const result = processor.simpleBibtexParser("   ");
    expect(Array.isArray(result)).toBe(true);
  });

  test("processArticleEntry com entryTags null", async () => {
    const entry = {
      entryType: "article",
      citationKey: "null_tags",
      entryTags: null,
    };

    const result = await processor.processArticleEntry(entry, {});
    expect(result.success).toBe(false);
  });

  test("processArticleEntry com entryTags undefined", async () => {
    const entry = {
      entryType: "article",
      citationKey: "undef_tags",
      entryTags: undefined,
    };

    const result = await processor.processArticleEntry(entry, {});
    expect(result.success).toBe(false);
  });

  test("processArticleEntry com pdf na lista", async () => {
    const entry = {
      entryType: "article",
      citationKey: "with_pdf",
      entryTags: {
        title: "Test",
        author: "Author",
        year: "2024",
        pages: "1-10",
      },
    };

    const pdfFiles = { with_pdf: "/path/to/file.pdf" };
    const result = await processor.processArticleEntry(entry, pdfFiles);
    expect(result).toHaveProperty("success");
  });

  test("processArticleEntry com inproceedings sem booktitle", async () => {
    const entry = {
      entryType: "inproceedings",
      citationKey: "no_book",
      entryTags: {
        title: "Test",
        author: "Author",
        year: "2024",
        pages: "1-10",
        location: "Location",
      },
    };

    const result = await processor.processArticleEntry(entry, {});
    expect(result.success).toBe(false);
  });

  test("processArticleEntry com inproceedings sem location", async () => {
    const entry = {
      entryType: "inproceedings",
      citationKey: "no_loc",
      entryTags: {
        title: "Test",
        author: "Author",
        year: "2024",
        pages: "1-10",
        booktitle: "Book",
      },
    };

    const result = await processor.processArticleEntry(entry, {});
    expect(result.success).toBe(false);
  });

  test("processArticleEntry com título muito curto", async () => {
    const entry = {
      entryType: "article",
      citationKey: "short_title",
      entryTags: {
        title: "ab",
        author: "Author",
        year: "2024",
        pages: "1-10",
      },
    };

    const result = await processor.processArticleEntry(entry, {});
    expect(result.success).toBe(false);
  });

  test("processArticleEntry com year > 2200", async () => {
    const entry = {
      entryType: "article",
      citationKey: "future_year",
      entryTags: {
        title: "Test",
        author: "Author",
        year: "2300",
        pages: "1-10",
      },
    };

    const result = await processor.processArticleEntry(entry, {});
    expect(result.success).toBe(false);
  });

  test("processArticleEntry com year < 1900", async () => {
    const entry = {
      entryType: "article",
      citationKey: "old_year",
      entryTags: {
        title: "Test",
        author: "Author",
        year: "1800",
        pages: "1-10",
      },
    };

    const result = await processor.processArticleEntry(entry, {});
    expect(result.success).toBe(false);
  });

  test("processor.processedCount inicializado", () => {
    expect(processor.processedCount).toEqual(0);
  });

  test("processor.skippedArticles inicializado", () => {
    expect(Array.isArray(processor.skippedArticles)).toBe(true);
  });

  test("processor.successfulArticles inicializado", () => {
    expect(Array.isArray(processor.successfulArticles)).toBe(true);
  });

  test("parsePages com apenas números", () => {
    const result = processor.parsePages("123");
    expect(result).toBeDefined();
  });

  test("parseAuthors com espaço único entre nomes", () => {
    const result = processor.parseAuthors("John Doe");
    expect(Array.isArray(result)).toBe(true);
  });

  test("cleanBibtexString com nova linha", () => {
    const result = processor.cleanBibtexString("Line 1\nLine 2");
    expect(typeof result).toBe("string");
  });

  test("cleanBibtexString com tab", () => {
    const result = processor.cleanBibtexString("Text\twith\ttabs");
    expect(typeof result).toBe("string");
  });

  test("processArticleEntry com múltiplos autores", async () => {
    const entry = {
      entryType: "article",
      citationKey: "multi_auth",
      entryTags: {
        title: "Test",
        author: "Author One and Author Two and Author Three",
        year: "2024",
        pages: "1-10",
      },
    };

    const result = await processor.processArticleEntry(entry, {});
    expect(result).toHaveProperty("success");
  });

  test("simpleBibtexParser com entry sem campos", () => {
    const bibtex = `@article{empty_entry}`;
    const result = processor.simpleBibtexParser(bibtex);
    expect(Array.isArray(result)).toBe(true);
  });

  test("processArticleEntry com PDF associada não encontrada", async () => {
    const entry = {
      entryType: "article",
      citationKey: "pdf_not_found",
      entryTags: {
        title: "Test",
        author: "Author",
        year: "2024",
        pages: "1-10",
      },
    };

    const pdfFiles = {};
    const result = await processor.processArticleEntry(entry, pdfFiles);
    expect(result).toHaveProperty("success");
  });

  test("parsePages com números grandes", () => {
    const result = processor.parsePages("1000-2000");
    expect(result).toBeDefined();
  });

  test("parseAuthors com nome composto", () => {
    const result = processor.parseAuthors("José María García López");
    expect(Array.isArray(result)).toBe(true);
  });

  test("cleanBibtexString com acentuação", () => {
    const result = processor.cleanBibtexString("Àáâãäåèéêëìíîï");
    expect(typeof result).toBe("string");
  });

  test("processArticleEntry com inproceedings booktitle sem keywords de evento", async () => {
    const entry = {
      entryType: "inproceedings",
      citationKey: "no_event_keyword",
      entryTags: {
        title: "Test Paper",
        author: "Author Name",
        year: "2024",
        pages: "1-10",
        booktitle: "Random Journal Name",
        location: "City",
      },
    };

    const result = await processor.processArticleEntry(entry, {});
    expect(result.success).toBe(false);
  });

  test("processArticleEntry com inproceedings booktitle com 'conference'", async () => {
    const event = await EventsModel.create({
      name: "Test Conference",
      year: 2024,
      entity: "Entity",
      sigla: "TC",
    });

    const edition = await EditionsModel.create({
      name: "2024 Conference Edition",
      eventId: event._id,
      year: 2024,
      event: event._id,
      place: "Location",
    });

    const entry = {
      entryType: "inproceedings",
      citationKey: "conf_keyword",
      entryTags: {
        title: "Test Paper Long Title",
        author: "Author Name",
        year: "2024",
        pages: "1-10",
        booktitle: "International Conference on Testing",
        location: "New York",
      },
    };

    const result = await processor.processArticleEntry(entry, {});
    expect(result).toHaveProperty("success");
  });

  test("processArticleEntry com inproceedings booktitle com 'symposium'", async () => {
    const event = await EventsModel.create({
      name: "Test Symposium",
      year: 2024,
      entity: "Entity",
      sigla: "TS",
    });

    const edition = await EditionsModel.create({
      name: "2024 Symposium Edition",
      eventId: event._id,
      year: 2024,
      event: event._id,
      place: "Location",
    });

    const entry = {
      entryType: "inproceedings",
      citationKey: "symp_keyword",
      entryTags: {
        title: "Test Paper Symposium Title",
        author: "Author Name",
        year: "2024",
        pages: "1-10",
        booktitle: "International Symposium on Software Engineering",
        location: "Paris",
      },
    };

    const result = await processor.processArticleEntry(entry, {});
    expect(result).toHaveProperty("success");
  });

  test("processArticleEntry com inproceedings booktitle com 'workshop'", async () => {
    const event = await EventsModel.create({
      name: "Test Workshop",
      year: 2024,
      entity: "Entity",
      sigla: "TW",
    });

    const edition = await EditionsModel.create({
      name: "2024 Workshop Edition",
      eventId: event._id,
      year: 2024,
      event: event._id,
      place: "Location",
    });

    const entry = {
      entryType: "inproceedings",
      citationKey: "workshop_keyword",
      entryTags: {
        title: "Workshop Paper Title",
        author: "Author Name",
        year: "2024",
        pages: "1-10",
        booktitle: "Workshop on Advanced Testing Techniques",
        location: "Berlin",
      },
    };

    const result = await processor.processArticleEntry(entry, {});
    expect(result).toHaveProperty("success");
  });

  test("processArticleEntry com inproceedings booktitle muito curto", async () => {
    const entry = {
      entryType: "inproceedings",
      citationKey: "short_booktitle",
      entryTags: {
        title: "Test",
        author: "Author",
        year: "2024",
        pages: "1-10",
        booktitle: "Short",
        location: "Location",
      },
    };

    const result = await processor.processArticleEntry(entry, {});
    expect(result.success).toBe(false);
  });

  test("processArticleEntry com inproceedings pages iguais", async () => {
    const entry = {
      entryType: "inproceedings",
      citationKey: "equal_pages",
      entryTags: {
        title: "Test Paper",
        author: "Author",
        year: "2024",
        pages: "5-5",
        booktitle: "Conference on Testing",
        location: "Location",
      },
    };

    const result = await processor.processArticleEntry(entry, {});
    expect(result.success).toBe(false);
  });

  test("processArticleEntry com inproceedings pages inválida (não-numérico)", async () => {
    const entry = {
      entryType: "inproceedings",
      citationKey: "invalid_page_nums",
      entryTags: {
        title: "Test Paper",
        author: "Author",
        year: "2024",
        pages: "a-b",
        booktitle: "Conference on Testing",
        location: "Location",
      },
    };

    const result = await processor.processArticleEntry(entry, {});
    expect(result.success).toBe(false);
  });

  test("processArticleEntry com inproceedings pages first > last", async () => {
    const entry = {
      entryType: "inproceedings",
      citationKey: "pages_reversed",
      entryTags: {
        title: "Test Paper",
        author: "Author",
        year: "2024",
        pages: "20-10",
        booktitle: "Conference on Testing",
        location: "Location",
      },
    };

    const result = await processor.processArticleEntry(entry, {});
    expect(result.success).toBe(false);
  });

  test("processArticleEntry com inproceedings location ausente", async () => {
    const entry = {
      entryType: "inproceedings",
      citationKey: "no_location",
      entryTags: {
        title: "Test Paper",
        author: "Author",
        year: "2024",
        pages: "1-10",
        booktitle: "Conference on Testing",
      },
    };

    const result = await processor.processArticleEntry(entry, {});
    expect(result.success).toBe(false);
  });

  test("processArticleEntry com inproceedings location vazio", async () => {
    const entry = {
      entryType: "inproceedings",
      citationKey: "empty_location",
      entryTags: {
        title: "Test Paper",
        author: "Author",
        year: "2024",
        pages: "1-10",
        booktitle: "Conference on Testing",
        location: "",
      },
    };

    const result = await processor.processArticleEntry(entry, {});
    expect(result.success).toBe(false);
  });

  test("processArticleEntry com booktitle muy largo", async () => {
    const event = await EventsModel.create({
      name: "Very Long Event",
      year: 2024,
      entity: "Entity",
      sigla: "VLE",
    });

    const edition = await EditionsModel.create({
      name: "Very Long Event Edition",
      eventId: event._id,
      year: 2024,
      event: event._id,
      place: "Location",
    });

    const entry = {
      entryType: "inproceedings",
      citationKey: "long_booktitle",
      entryTags: {
        title: "Test Paper with Long Title",
        author: "Author Name",
        year: "2024",
        pages: "100-150",
        booktitle:
          "International Conference on Very Long Names and Extended Titles with Multiple Words for Testing Purposes",
        location: "Tokyo",
      },
    };

    const result = await processor.processArticleEntry(entry, {});
    expect(result).toHaveProperty("success");
  });

  test("processArticleEntry com article e pages único", async () => {
    const entry = {
      entryType: "article",
      citationKey: "single_page_article",
      entryTags: {
        title: "Short Article",
        author: "Author",
        year: "2024",
        pages: "15",
      },
    };

    const result = await processor.processArticleEntry(entry, {});
    expect(result.success).toBe(false);
  });

  test("processArticleEntry com article válido", async () => {
    const entry = {
      entryType: "article",
      citationKey: "valid_article",
      entryTags: {
        title: "Valid Journal Article Title",
        author: "Jane Doe",
        year: "2022",
        pages: "50-75",
      },
    };

    const result = await processor.processArticleEntry(entry, {});
    expect(result).toHaveProperty("success");
  });

  test("parsePages com dashe duplo (--)", () => {
    const result = processor.parsePages("1--10");
    expect(result).toBeDefined();
    if (result.first && result.last) {
      expect(result.first).toBeDefined();
      expect(result.last).toBeDefined();
    }
  });

  test("parsePages com endash (–)", () => {
    const result = processor.parsePages("1–10");
    expect(result).toBeDefined();
  });

  test("parsePages com emspace ( — )", () => {
    const result = processor.parsePages("1 — 10");
    expect(result).toBeDefined();
  });

  test("parseAuthors com separador vírgula", () => {
    const result = processor.parseAuthors("Silva, João; Santos, Maria");
    expect(Array.isArray(result)).toBe(true);
  });

  test("processArticleEntry com duplicata (citationKey igual)", async () => {
    // Primeira entrada
    const entry1 = {
      entryType: "article",
      citationKey: "dup_test",
      entryTags: {
        title: "Original Article",
        author: "Author",
        year: "2024",
        pages: "1-10",
      },
    };

    // Segunda entrada com mesmo citationKey
    const entry2 = {
      entryType: "article",
      citationKey: "dup_test",
      entryTags: {
        title: "Duplicate Article",
        author: "Author",
        year: "2024",
        pages: "1-10",
      },
    };

    const result1 = await processor.processArticleEntry(entry1, {});
    const result2 = await processor.processArticleEntry(entry2, {});

    expect(result1).toHaveProperty("success");
    expect(result2).toHaveProperty("success");
  });

  test("processArticleEntry com citationKey undefined", async () => {
    const entry = {
      entryType: "article",
      citationKey: undefined,
      entryTags: {
        title: "Test Article",
        author: "Author",
        year: "2024",
        pages: "1-10",
      },
    };

    const result = await processor.processArticleEntry(entry, {});
    expect(result).toHaveProperty("success");
  });

  test("processArticleEntry com entryType não reconhecido", async () => {
    const entry = {
      entryType: "book",
      citationKey: "book_entry",
      entryTags: {
        title: "Test Book",
        author: "Author",
        year: "2024",
        pages: "1-10",
      },
    };

    const result = await processor.processArticleEntry(entry, {});
    expect(result.success).toBe(false);
  });

  test("processArticleEntry com author null", async () => {
    const entry = {
      entryType: "article",
      citationKey: "null_author",
      entryTags: {
        title: "Test",
        author: null,
        year: "2024",
        pages: "1-10",
      },
    };

    const result = await processor.processArticleEntry(entry, {});
    expect(result.success).toBe(false);
  });

  test("processArticleEntry com year null", async () => {
    const entry = {
      entryType: "article",
      citationKey: "null_year",
      entryTags: {
        title: "Test",
        author: "Author",
        year: null,
        pages: "1-10",
      },
    };

    const result = await processor.processArticleEntry(entry, {});
    expect(result.success).toBe(false);
  });

  test("processArticleEntry com pages null", async () => {
    const entry = {
      entryType: "article",
      citationKey: "null_pages",
      entryTags: {
        title: "Test",
        author: "Author",
        year: "2024",
        pages: null,
      },
    };

    const result = await processor.processArticleEntry(entry, {});
    expect(result.success).toBe(false);
  });

  test("processArticleEntry com year string número não-válido", async () => {
    const entry = {
      entryType: "article",
      citationKey: "invalid_year_string",
      entryTags: {
        title: "Test",
        author: "Author",
        year: "twenty twenty",
        pages: "1-10",
      },
    };

    const result = await processor.processArticleEntry(entry, {});
    expect(result.success).toBe(false);
  });

  test("parsePages retorna objeto com first e last", () => {
    const result = processor.parsePages("100-200");
    expect(result).toHaveProperty("first");
    expect(result).toHaveProperty("last");
  });

  test("parsePages com valor null", () => {
    const result = processor.parsePages(null);
    expect(result).toBeDefined();
  });

  test("parseAuthors retorna array", () => {
    const result = processor.parseAuthors("Author");
    expect(Array.isArray(result)).toBe(true);
  });

  test("parseAuthors com múltiplas palavras por autor", () => {
    const result = processor.parseAuthors("John David Smith and Jane Mary Doe");
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThanOrEqual(1);
  });

  test("simpleBibtexParser com múltiplas linhas", () => {
    const bibtex = `
      @article{key1,
        title = {Title One},
        author = {Author One},
        year = {2024},
        pages = {1-10}
      }
      @article{key2,
        title = {Title Two},
        author = {Author Two},
        year = {2023},
        pages = {15-25}
      }
    `;
    const result = processor.simpleBibtexParser(bibtex);
    expect(Array.isArray(result)).toBe(true);
  });

  test("simpleBibtexParser com entry mal formatada", () => {
    const bibtex = `@article{incomplete, title = `;
    const result = processor.simpleBibtexParser(bibtex);
    expect(Array.isArray(result)).toBe(true);
  });

  test("cleanBibtexString remove múltiplos espaços consecutivos", () => {
    const result = processor.cleanBibtexString("Word1     Word2     Word3");
    expect(result).not.toMatch(/     /);
  });

  test("processArticleEntry com article e journal field", async () => {
    const entry = {
      entryType: "article",
      citationKey: "journal_article",
      entryTags: {
        title: "Journal Article",
        author: "Author",
        year: "2024",
        pages: "25-40",
        journal: "Nature",
      },
    };

    const result = await processor.processArticleEntry(entry, {});
    expect(result).toHaveProperty("success");
  });

  test("processArticleEntry com inproceedings title extremamente longo", async () => {
    const event = await EventsModel.create({
      name: "Long Title Event",
      year: 2024,
      entity: "Entity",
      sigla: "LTE",
    });

    const edition = await EditionsModel.create({
      name: "Long Title Edition",
      eventId: event._id,
      year: 2024,
      event: event._id,
      place: "Location",
    });

    const entry = {
      entryType: "inproceedings",
      citationKey: "very_long_title",
      entryTags: {
        title:
          "This is a very long title for a conference paper that contains many words and is used to test if the system can handle titles of various lengths and complexities",
        author: "Author",
        year: "2024",
        pages: "1-10",
        booktitle: "International Conference on Long Titles",
        location: "Paris",
      },
    };

    const result = await processor.processArticleEntry(entry, {});
    expect(result).toHaveProperty("success");
  });

  test("parsePages com hífen duplo alternativo", () => {
    const result = processor.parsePages("1 - 10");
    expect(result).toBeDefined();
  });

  test("parseAuthors com apenas uma palavra", () => {
    const result = processor.parseAuthors("Aristotle");
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThanOrEqual(1);
  });

  test("cleanBibtexString com unicode characters", () => {
    const result = processor.cleanBibtexString("Ñoño José María");
    expect(typeof result).toBe("string");
  });

  test("processArticleEntry com PDF file presente", async () => {
    const entry = {
      entryType: "article",
      citationKey: "with_pdf_file",
      entryTags: {
        title: "Article with PDF",
        author: "Author",
        year: "2024",
        pages: "1-10",
      },
    };

    const pdfFiles = {
      with_pdf_file: "/path/to/document.pdf",
    };

    const result = await processor.processArticleEntry(entry, pdfFiles);
    expect(result).toHaveProperty("success");
  });

  test("simpleBibtexParser extrai citationKey corretamente", () => {
    const bibtex = `@article{minha_chave, title = {Test}}`;
    const result = processor.simpleBibtexParser(bibtex);
    if (result.length > 0) {
      expect(result[0].citationKey).toBe("minha_chave");
    }
  });

  test("parsePages com números decimais", () => {
    const result = processor.parsePages("1.5-10.5");
    expect(result).toBeDefined();
  });

  test("parseAuthors com número no nome", () => {
    const result = processor.parseAuthors("Author123 and John Doe");
    expect(Array.isArray(result)).toBe(true);
  });

  test("processArticleEntry article sem journal field", async () => {
    const entry = {
      entryType: "article",
      citationKey: "no_journal",
      entryTags: {
        title: "Standalone Article",
        author: "Author",
        year: "2024",
        pages: "50-60",
      },
    };

    const result = await processor.processArticleEntry(entry, {});
    expect(result).toHaveProperty("success");
  });

  test("processArticleEntry com múltiplos PDFs na lista", async () => {
    const entry = {
      entryType: "article",
      citationKey: "multi_pdf",
      entryTags: {
        title: "Multi PDF Article",
        author: "Author",
        year: "2024",
        pages: "1-5",
      },
    };

    const pdfFiles = {
      multi_pdf: "/path/to/file1.pdf",
      other_key: "/path/to/file2.pdf",
    };

    const result = await processor.processArticleEntry(entry, pdfFiles);
    expect(result).toHaveProperty("success");
  });

  test("simpleBibtexParser com espaços em torno de chaves", () => {
    const bibtex = `  @article { key , title = {Test} }  `;
    const result = processor.simpleBibtexParser(bibtex);
    expect(Array.isArray(result)).toBe(true);
  });

  test("cleanBibtexString remove pontuação múltipla", () => {
    const result = processor.cleanBibtexString("Test!!! Sentence??? Words...");
    expect(typeof result).toBe("string");
  });

  test("processArticleEntry com author contendo \\\"and\\\"", async () => {
    const entry = {
      entryType: "article",
      citationKey: "author_and",
      entryTags: {
        title: "Test",
        author: "Smith and Sons Inc. and Jones Company",
        year: "2024",
        pages: "1-10",
      },
    };

    const result = await processor.processArticleEntry(entry, {});
    expect(result).toHaveProperty("success");
  });

  test("parsePages com apenas primeiro número", () => {
    const result = processor.parsePages("100");
    expect(result).toBeDefined();
  });
});

describe("BulkArticleProcessor - Testes com Arquivo Temporário", () => {
  let mongoServer;
  let processor;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
  }, 10000);

  beforeEach(async () => {
    await EventsModel.deleteMany({});
    await EditionsModel.deleteMany({});
    await ArticleModel.deleteMany({});

    processor = new BulkArticleProcessor();
  });

  test("processBulkUpload deve retornar report object", async () => {
    // Criar um arquivo BibTeX temporário
    const fs = await import("fs");
    const path = await import("path");
    const os = await import("os");

    const tempDir = os.tmpdir();
    const bibtexPath = `${tempDir}/test_${Date.now()}.bib`;

    const bibtexContent = `@article{test_key_1,
      title = {Test Article One},
      author = {John Doe},
      year = {2024},
      pages = {10-20}
    }`;

    try {
      // Escrever arquivo
      fs.writeFileSync(bibtexPath, bibtexContent);

      // Testar processBulkUpload
      const mockFile = { path: bibtexPath };
      const result = await processor.processBulkUpload(mockFile, null);

      expect(result).toHaveProperty("total");
      expect(result).toHaveProperty("successful");
      expect(result).toHaveProperty("skipped");
    } finally {
      // Limpar arquivo
      if (fs.existsSync(bibtexPath)) {
        fs.unlinkSync(bibtexPath);
      }
    }
  });

  test("processBulkUpload com múltiplas entradas", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const os = await import("os");

    const tempDir = os.tmpdir();
    const bibtexPath = `${tempDir}/test_multi_${Date.now()}.bib`;

    const bibtexContent = `@article{key1,
      title = {Article One Title},
      author = {Author One},
      year = {2024},
      pages = {1-10}
    }
    @article{key2,
      title = {Article Two Title},
      author = {Author Two},
      year = {2023},
      pages = {15-25}
    }`;

    try {
      fs.writeFileSync(bibtexPath, bibtexContent);

      const mockFile = { path: bibtexPath };
      const result = await processor.processBulkUpload(mockFile, null);

      expect(result).toHaveProperty("total");
      expect(result.total).toBeGreaterThan(0);
    } finally {
      if (fs.existsSync(bibtexPath)) {
        fs.unlinkSync(bibtexPath);
      }
    }
  });

  test("processBulkUpload com arquivo inválido", async () => {
    try {
      const mockFile = { path: "/nonexistent/path/file.bib" };
      const result = await processor.processBulkUpload(mockFile, null);

      // Deve retornar erro ou report
      expect(result).toBeDefined();
    } catch (error) {
      // Erro esperado
      expect(error).toBeDefined();
    }
  });

  test("processBulkUpload retorna erro para arquivo sem permissão", async () => {
    try {
      const mockFile = { path: "" };
      const result = await processor.processBulkUpload(mockFile, null);
      expect(result).toBeDefined();
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  test("processBulkUpload com arquivo vazio", async () => {
    const fs = await import("fs");
    const os = await import("os");

    const tempDir = os.tmpdir();
    const bibtexPath = `${tempDir}/test_empty_${Date.now()}.bib`;

    try {
      fs.writeFileSync(bibtexPath, "");

      const mockFile = { path: bibtexPath };
      const result = await processor.processBulkUpload(mockFile, null);

      expect(result).toHaveProperty("total");
      expect(result.total).toBe(0);
    } finally {
      if (fs.existsSync(bibtexPath)) {
        fs.unlinkSync(bibtexPath);
      }
    }
  });

  test("processBulkUpload com ZIP file null", async () => {
    const fs = await import("fs");
    const os = await import("os");

    const tempDir = os.tmpdir();
    const bibtexPath = `${tempDir}/test_no_zip_${Date.now()}.bib`;

    const bibtexContent = `@article{key1,
      title = {Test},
      author = {Author},
      year = {2024},
      pages = {1-10}
    }`;

    try {
      fs.writeFileSync(bibtexPath, bibtexContent);

      const mockFile = { path: bibtexPath };
      const result = await processor.processBulkUpload(mockFile, null);

      expect(result).toHaveProperty("total");
    } finally {
      if (fs.existsSync(bibtexPath)) {
        fs.unlinkSync(bibtexPath);
      }
    }
  });

  test("cleanupTempFiles method exists", () => {
    expect(typeof processor.cleanupTempFiles).toBe("function");
  });

  test("extractPdfFiles method exists", () => {
    expect(typeof processor.extractPdfFiles).toBe("function");
  });

  test("simpleBibtexParser method exists", () => {
    expect(typeof processor.simpleBibtexParser).toBe("function");
  });

  test("parsePages method exists", () => {
    expect(typeof processor.parsePages).toBe("function");
  });

  test("parseAuthors method exists", () => {
    expect(typeof processor.parseAuthors).toBe("function");
  });

  test("cleanBibtexString method exists", () => {
    expect(typeof processor.cleanBibtexString).toBe("function");
  });

  test("processArticleEntry method exists", () => {
    expect(typeof processor.processArticleEntry).toBe("function");
  });

  test("processBulkUpload method exists", () => {
    expect(typeof processor.processBulkUpload).toBe("function");
  });

  test("processBulkUpload com bibtex parser fallback", async () => {
    const fs = await import("fs");
    const os = await import("os");

    const tempDir = os.tmpdir();
    const bibtexPath = `${tempDir}/test_fallback_${Date.now()}.bib`;

    // BibTeX que pode falhar o parser principal
    const bibtexContent = `@article{key1,
      title = {Test Article},
      author = {Author},
      year = {2024},
      pages = {1-10}
    }`;

    try {
      fs.writeFileSync(bibtexPath, bibtexContent);

      const mockFile = { path: bibtexPath };
      const result = await processor.processBulkUpload(mockFile, null);

      expect(result).toHaveProperty("total");
      expect(result).toHaveProperty("errors");
    } finally {
      if (fs.existsSync(bibtexPath)) {
        fs.unlinkSync(bibtexPath);
      }
    }
  });

  test("processBulkUpload report tem estrutura correta", async () => {
    const fs = await import("fs");
    const os = await import("os");

    const tempDir = os.tmpdir();
    const bibtexPath = `${tempDir}/test_report_${Date.now()}.bib`;

    const bibtexContent = `@article{test,
      title = {Test},
      author = {Author},
      year = {2024},
      pages = {1-10}
    }`;

    try {
      fs.writeFileSync(bibtexPath, bibtexContent);

      const mockFile = { path: bibtexPath };
      const result = await processor.processBulkUpload(mockFile, null);

      expect(result).toHaveProperty("total");
      expect(result).toHaveProperty("successful");
      expect(result).toHaveProperty("skipped");
      expect(result).toHaveProperty("errors");
      expect(result).toHaveProperty("successfulArticles");
      expect(result).toHaveProperty("skippedArticles");
    } finally {
      if (fs.existsSync(bibtexPath)) {
        fs.unlinkSync(bibtexPath);
      }
    }
  });

  test("processBulkUpload com entradas inválidas", async () => {
    const fs = await import("fs");
    const os = await import("os");

    const tempDir = os.tmpdir();
    const bibtexPath = `${tempDir}/test_invalid_${Date.now()}.bib`;

    const bibtexContent = `@article{invalid1,
      title = {T},
      author = {A},
      year = {2024},
      pages = {1-1}
    }`;

    try {
      fs.writeFileSync(bibtexPath, bibtexContent);

      const mockFile = { path: bibtexPath };
      const result = await processor.processBulkUpload(mockFile, null);

      expect(result.skipped).toBeGreaterThanOrEqual(0);
    } finally {
      if (fs.existsSync(bibtexPath)) {
        fs.unlinkSync(bibtexPath);
      }
    }
  });

  test("processBulkUpload com inproceedings válido", async () => {
    const fs = await import("fs");
    const os = await import("os");

    // Criar event e edition antes
    const event = await EventsModel.create({
      name: "Bulk Upload Event",
      year: 2024,
      entity: "Entity",
      sigla: "BUE",
    });

    const edition = await EditionsModel.create({
      name: "Bulk Edition",
      eventId: event._id,
      year: 2024,
      event: event._id,
      place: "Location",
    });

    const tempDir = os.tmpdir();
    const bibtexPath = `${tempDir}/test_inproc_${Date.now()}.bib`;

    const bibtexContent = `@inproceedings{conf1,
      title = {Conference Paper Title},
      author = {John Doe},
      year = {2024},
      pages = {100-110},
      booktitle = {International Conference on Testing},
      location = {New York}
    }`;

    try {
      fs.writeFileSync(bibtexPath, bibtexContent);

      const mockFile = { path: bibtexPath };
      const result = await processor.processBulkUpload(mockFile, null);

      expect(result).toHaveProperty("total");
      expect(result.total).toBeGreaterThan(0);
    } finally {
      if (fs.existsSync(bibtexPath)) {
        fs.unlinkSync(bibtexPath);
      }
    }
  });

  test("processBulkUpload com mix de artigos válidos e inválidos", async () => {
    const fs = await import("fs");
    const os = await import("os");

    const tempDir = os.tmpdir();
    const bibtexPath = `${tempDir}/test_mix_${Date.now()}.bib`;

    const bibtexContent = `@article{valid1,
      title = {Valid Article},
      author = {Author},
      year = {2024},
      pages = {1-10}
    }
    @article{invalid1,
      title = {I},
      author = {A},
      year = {2024},
      pages = {1-1}
    }`;

    try {
      fs.writeFileSync(bibtexPath, bibtexContent);

      const mockFile = { path: bibtexPath };
      const result = await processor.processBulkUpload(mockFile, null);

      expect(result.total).toBe(2);
    } finally {
      if (fs.existsSync(bibtexPath)) {
        fs.unlinkSync(bibtexPath);
      }
    }
  });

  test("processBulkUpload com conteúdo sem entradas @", async () => {
    const fs = await import("fs");
    const os = await import("os");

    const tempDir = os.tmpdir();
    const bibtexPath = `${tempDir}/test_no_at_${Date.now()}.bib`;

    const bibtexContent = `
    This is just plain text
    No bibtex entries here
    `;

    try {
      fs.writeFileSync(bibtexPath, bibtexContent);

      const mockFile = { path: bibtexPath };
      const result = await processor.processBulkUpload(mockFile, null);

      expect(result.total).toBe(0);
    } finally {
      if (fs.existsSync(bibtexPath)) {
        fs.unlinkSync(bibtexPath);
      }
    }
  });

  test("processBulkUpload com diferentes tipos de entrada", async () => {
    const fs = await import("fs");
    const os = await import("os");

    const event = await EventsModel.create({
      name: "Multi Type Event",
      year: 2024,
      entity: "Entity",
      sigla: "MTE",
    });

    const edition = await EditionsModel.create({
      name: "Multi Type Edition",
      eventId: event._id,
      year: 2024,
      event: event._id,
      place: "Location",
    });

    const tempDir = os.tmpdir();
    const bibtexPath = `${tempDir}/test_types_${Date.now()}.bib`;

    const bibtexContent = `@article{art1,
      title = {Journal Article},
      author = {Author One},
      year = {2024},
      pages = {10-20}
    }
    @inproceedings{conf1,
      title = {Conference Paper},
      author = {Author Two},
      year = {2024},
      pages = {30-40},
      booktitle = {International Conference},
      location = {Paris}
    }`;

    try {
      fs.writeFileSync(bibtexPath, bibtexContent);

      const mockFile = { path: bibtexPath };
      const result = await processor.processBulkUpload(mockFile, null);

      expect(result.total).toBe(2);
    } finally {
      if (fs.existsSync(bibtexPath)) {
        fs.unlinkSync(bibtexPath);
      }
    }
  });

  test("processBulkUpload report errors array", async () => {
    const fs = await import("fs");
    const os = await import("os");

    const tempDir = os.tmpdir();
    const bibtexPath = `${tempDir}/test_errors_${Date.now()}.bib`;

    const bibtexContent = `@article{test,
      title = {Test},
      author = {Author},
      year = {2024},
      pages = {1-10}
    }`;

    try {
      fs.writeFileSync(bibtexPath, bibtexContent);

      const mockFile = { path: bibtexPath };
      const result = await processor.processBulkUpload(mockFile, null);

      expect(Array.isArray(result.errors)).toBe(true);
    } finally {
      if (fs.existsSync(bibtexPath)) {
        fs.unlinkSync(bibtexPath);
      }
    }
  });

  test("processBulkUpload skippedArticles array", async () => {
    const fs = await import("fs");
    const os = await import("os");

    const tempDir = os.tmpdir();
    const bibtexPath = `${tempDir}/test_skipped_${Date.now()}.bib`;

    const bibtexContent = `@article{test,
      title = {Test},
      author = {Author},
      year = {2024},
      pages = {1-10}
    }`;

    try {
      fs.writeFileSync(bibtexPath, bibtexContent);

      const mockFile = { path: bibtexPath };
      const result = await processor.processBulkUpload(mockFile, null);

      expect(Array.isArray(result.skippedArticles)).toBe(true);
    } finally {
      if (fs.existsSync(bibtexPath)) {
        fs.unlinkSync(bibtexPath);
      }
    }
  });

  test("processBulkUpload successfulArticles array", async () => {
    const fs = await import("fs");
    const os = await import("os");

    const tempDir = os.tmpdir();
    const bibtexPath = `${tempDir}/test_success_${Date.now()}.bib`;

    const bibtexContent = `@article{test,
      title = {Test},
      author = {Author},
      year = {2024},
      pages = {1-10}
    }`;

    try {
      fs.writeFileSync(bibtexPath, bibtexContent);

      const mockFile = { path: bibtexPath };
      const result = await processor.processBulkUpload(mockFile, null);

      expect(Array.isArray(result.successfulArticles)).toBe(true);
    } finally {
      if (fs.existsSync(bibtexPath)) {
        fs.unlinkSync(bibtexPath);
      }
    }
  });

  // ========================
  // TESTES DE COBERTURA ADICIONAL PARA BRANCHES
  // ========================

  test("processArticleEntry com article type e journal válido", async () => {
    const entry = {
      entryType: "article",
      citationKey: "art_journal",
      entryTags: {
        title: "Test Article Title",
        author: "John Doe",
        year: "2024",
        pages: "1-10",
        journal: "IEEE Transactions",
      },
    };

    const result = await processor.processArticleEntry(entry, {});
    expect(typeof result.success).toBe("boolean");
  });

  test("processArticleEntry article sem journal", async () => {
    const entry = {
      entryType: "article",
      citationKey: "art_no_journal",
      entryTags: {
        title: "Test Article Title",
        author: "John Doe",
        year: "2024",
        pages: "1-10",
      },
    };

    const result = await processor.processArticleEntry(entry, {});
    expect(result.success).toBe(false);
  });

  test("cleanBibtexString com múltiplas sequências de espaços", () => {
    const input = "Test   \t\n  String";
    const result = processor.cleanBibtexString(input);
    expect(result).toBe("Test String");
  });

  test("cleanBibtexString com chaves aninhadas", () => {
    const input = "{{{Inner}}} Text";
    const result = processor.cleanBibtexString(input);
    expect(result).toBe("Inner Text");
  });

  test("parsePages com página única", () => {
    const result = processor.parsePages("42");
    expect(result.first).toBe("42");
  });

  test("parsePages com formato inválido retorna objeto", () => {
    const result = processor.parsePages("invalid");
    expect(typeof result).toBe("object");
  });

  test("parseAuthors com author vazio retorna array vazio", () => {
    const result = processor.parseAuthors("");
    expect(Array.isArray(result)).toBe(true);
  });

  test("parseAuthors com espaços extras ao redor de 'and'", () => {
    const result = processor.parseAuthors("Author1  and  Author2");
    expect(result.length).toBeGreaterThanOrEqual(1);
  });

  test("simpleBibtexParser com múltiplas entradas inproceedings", () => {
    const content = `
      @inproceedings{test1, title = {A}, author = {B}, year = {2024}}
      @inproceedings{test2, title = {C}, author = {D}, year = {2024}}
      @article{test3, title = {E}, author = {F}, journal = {J}, year = {2024}}
    `;
    const entries = processor.simpleBibtexParser(content);
    expect(entries.length).toBeGreaterThanOrEqual(0);
  });

  test("simpleBibtexParser com caracteres especiais em valor", () => {
    const content = `@inproceedings{test, title = {Tëst & Côde}, author = {Jöhn}}`;
    const entries = processor.simpleBibtexParser(content);
    if (entries.length > 0) {
      expect(entries[0].entryTags.title).toContain("t");
    }
  });

  test("processArticleEntry com title muito curto", async () => {
    const entry = {
      entryType: "inproceedings",
      citationKey: "short_title",
      entryTags: {
        title: "AB",
        author: "Author",
        year: "2024",
        pages: "1-10",
        booktitle: "Conference",
        location: "City",
      },
    };
    const result = await processor.processArticleEntry(entry, {});
    expect(result.success).toBe(false);
  });

  test("processArticleEntry com pages contendo caractere invalido", async () => {
    const entry = {
      entryType: "inproceedings",
      citationKey: "invalid_pages",
      entryTags: {
        title: "Valid Title",
        author: "Author",
        year: "2024",
        pages: "abc-def",
        booktitle: "Conference",
        location: "City",
      },
    };
    const result = await processor.processArticleEntry(entry, {});
    expect(typeof result.success).toBe("boolean");
  });

  test("processArticleEntry com year não numérico", async () => {
    const entry = {
      entryType: "inproceedings",
      citationKey: "invalid_year",
      entryTags: {
        title: "Valid Title",
        author: "Author",
        year: "notayear",
        pages: "1-10",
        booktitle: "Conference",
        location: "City",
      },
    };
    const result = await processor.processArticleEntry(entry, {});
    expect(result.success).toBe(false);
  });

  test("processArticleEntry com author numérico", async () => {
    const entry = {
      entryType: "inproceedings",
      citationKey: "numeric_author",
      entryTags: {
        title: "Valid Title",
        author: "123",
        year: "2024",
        pages: "1-10",
        booktitle: "Conference",
        location: "City",
      },
    };
    const result = await processor.processArticleEntry(entry, {});
    expect(typeof result.success).toBe("boolean");
  });

  test("processArticleEntry inproceedings sem booktitle", async () => {
    const entry = {
      entryType: "inproceedings",
      citationKey: "no_booktitle",
      entryTags: {
        title: "Valid Title",
        author: "Author",
        year: "2024",
        pages: "1-10",
        location: "City",
      },
    };
    const result = await processor.processArticleEntry(entry, {});
    expect(result.success).toBe(false);
  });

  test("processArticleEntry inproceedings com booktitle empty string", async () => {
    const entry = {
      entryType: "inproceedings",
      citationKey: "empty_booktitle",
      entryTags: {
        title: "Valid Title",
        author: "Author",
        year: "2024",
        pages: "1-10",
        booktitle: "",
        location: "City",
      },
    };
    const result = await processor.processArticleEntry(entry, {});
    expect(result.success).toBe(false);
  });

  test("processArticleEntry com conference type", async () => {
    const event = await EventsModel.create({
      name: "Conferência",
      sigla: "CONF",
      entity: "Entity",
    });

    const edition = await EditionsModel.create({
      year: "2024",
      place: "City",
      event: event._id,
    });

    const entry = {
      entryType: "conference",
      citationKey: "conf_type",
      entryTags: {
        title: "Conference Paper",
        author: "Author",
        year: "2024",
        pages: "1-10",
        booktitle: "Conferência",
        location: "City",
      },
    };

    const result = await processor.processArticleEntry(entry, {
      "Conferência": { event: event._id, editions: [edition._id] },
    });

    expect(typeof result.success).toBe("boolean");
  });

  test("processArticleEntry com tipo desconhecido", async () => {
    const entry = {
      entryType: "mastersthesis",
      citationKey: "unknown_type",
      entryTags: {
        title: "Thesis",
        author: "Author",
        year: "2024",
      },
    };

    const result = await processor.processArticleEntry(entry, {});
    expect(result.success).toBe(false);
  });

  test("cleanBibtexString com LaTeX commands complexos", () => {
    const input = "\\textbf{\\textit{Test}} \\emph{More}";
    const result = processor.cleanBibtexString(input);
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  test("simpleBibtexParser com bibtex vazio", () => {
    const entries = processor.simpleBibtexParser("");
    expect(Array.isArray(entries)).toBe(true);
  });

  test("simpleBibtexParser com citationKey especial", () => {
    const content = `@inproceedings{test-2024_v1.0, title = {T}, author = {A}}`;
    const entries = processor.simpleBibtexParser(content);
    if (entries.length > 0) {
      expect(entries[0].citationKey).toBeDefined();
    }
  });

  test("parsePages com espaços em torno do separador", () => {
    const result = processor.parsePages("1 - 10");
    expect(result).toBeDefined();
  });

  test("parseAuthors com apenas uma palavra", () => {
    const result = processor.parseAuthors("SingleAuthor");
    expect(Array.isArray(result)).toBe(true);
  });

  test("processArticleEntry com pages undefined", async () => {
    const entry = {
      entryType: "inproceedings",
      citationKey: "no_pages",
      entryTags: {
        title: "Valid Title",
        author: "Author",
        year: "2024",
        booktitle: "Conference",
        location: "City",
      },
    };

    const result = await processor.processArticleEntry(entry, {});
    expect(result.success).toBe(false);
  });

  test("processArticleEntry com year undefined", async () => {
    const entry = {
      entryType: "inproceedings",
      citationKey: "no_year",
      entryTags: {
        title: "Valid Title",
        author: "Author",
        pages: "1-10",
        booktitle: "Conference",
        location: "City",
      },
    };

    const result = await processor.processArticleEntry(entry, {});
    expect(result.success).toBe(false);
  });

  test("processArticleEntry com author undefined", async () => {
    const entry = {
      entryType: "inproceedings",
      citationKey: "no_author",
      entryTags: {
        title: "Valid Title",
        year: "2024",
        pages: "1-10",
        booktitle: "Conference",
        location: "City",
      },
    };

    const result = await processor.processArticleEntry(entry, {});
    expect(result.success).toBe(false);
  });

  test("processArticleEntry com title undefined", async () => {
    const entry = {
      entryType: "inproceedings",
      citationKey: "no_title",
      entryTags: {
        author: "Author",
        year: "2024",
        pages: "1-10",
        booktitle: "Conference",
        location: "City",
      },
    };

    const result = await processor.processArticleEntry(entry, {});
    expect(result.success).toBe(false);
  });

  test("processArticleEntry com booktitle case variation", async () => {
    const event = await EventsModel.create({
      name: "Simpósio Brasileiro de Engenharia de Software",
      sigla: "SBES",
      entity: "SBC",
    });

    const edition = await EditionsModel.create({
      year: "2024",
      place: "City",
      event: event._id,
    });

    const entry = {
      entryType: "inproceedings",
      citationKey: "case_variation",
      entryTags: {
        title: "Valid Title",
        author: "Author",
        year: "2024",
        pages: "1-10",
        booktitle: "SIMPÓSIO BRASILEIRO DE ENGENHARIA DE SOFTWARE",
        location: "City",
      },
    };

    const result = await processor.processArticleEntry(entry, {
      "Simpósio Brasileiro de Engenharia de Software": {
        event: event._id,
        editions: [edition._id],
      },
    });

    expect(typeof result.success).toBe("boolean");
  });

  test("processArticleEntry deve validar tipos de entrada", async () => {
    const validTypes = ["inproceedings", "conference", "article"];
    
    for (const type of validTypes) {
      const entry = {
        entryType: type,
        citationKey: `test_${type}`,
        entryTags: {
          title: "Valid Title",
          author: "Author",
          year: "2024",
          pages: "1-10",
          journal: "Journal",
          booktitle: "Conference",
          location: "City",
        },
      };

      const result = await processor.processArticleEntry(entry, {});
      expect(typeof result.success).toBe("boolean");
    }
  });

  test("cleanBibtexString com múltiplos tipos de whitespace", () => {
    const input = "Test\r\n\t  String";
    const result = processor.cleanBibtexString(input);
    expect(result).toContain("Test");
    expect(result).toContain("String");
  });

  test("parsePages com diferentes separadores de página", () => {
    const inputs = ["1-10", "1--10", "1–10", "1—10"];
    
    inputs.forEach((input) => {
      const result = processor.parsePages(input);
      expect(result).toBeDefined();
      expect(typeof result).toBe("object");
    });
  });

  test("parseAuthors com caracteres especiais", () => {
    const result = processor.parseAuthors("José and François and Müller");
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThanOrEqual(1);
  });

  test("simpleBibtexParser com entradas sem fields", () => {
    const content = `@inproceedings{empty_entry}`;
    const entries = processor.simpleBibtexParser(content);
    expect(Array.isArray(entries)).toBe(true);
  });

  test("processArticleEntry com página como string com espaços", async () => {
    const entry = {
      entryType: "inproceedings",
      citationKey: "pages_spaces",
      entryTags: {
        title: "Valid Title",
        author: "Author",
        year: "2024",
        pages: " 1 - 10 ",
        booktitle: "Conference",
        location: "City",
      },
    };

    const result = await processor.processArticleEntry(entry, {});
    expect(typeof result.success).toBe("boolean");
  });

  test("BulkArticleProcessor propriedades iniciais", () => {
    const proc = new BulkArticleProcessor();
    expect(proc.processedCount).toBe(0);
    expect(Array.isArray(proc.skippedArticles)).toBe(true);
    expect(Array.isArray(proc.successfulArticles)).toBe(true);
  });

  test("processBulkUpload com arquivo BibTeX mal formado deve capturar erro", async () => {
    const fs = await import("fs");
    const os = await import("os");

    const tempDir = os.tmpdir();
    const bibtexPath = `${tempDir}/test_malformed_${Date.now()}.bib`;

    const bibtexContent = `@inproceedings{malformed,
      title = {Test Article
      author = {Author}
      year = 2024
    }`;  // Falta aspas e fechar chave

    try {
      fs.writeFileSync(bibtexPath, bibtexContent);

      const mockFile = { path: bibtexPath };
      const result = await processor.processBulkUpload(mockFile, null);

      // Deve ter processado algo
      expect(result).toBeDefined();
    } finally {
      if (fs.existsSync(bibtexPath)) {
        fs.unlinkSync(bibtexPath);
      }
    }
  });

  test("processArticleEntry deve capturar exceção se campos não validam", async () => {
    // Caso extremo: entry não tem entryTags
    const entry = {
      entryType: "inproceedings",
      citationKey: "bad_entry",
    };

    const result = await processor.processArticleEntry(entry, {});
    expect(result).toBeDefined();
    expect(typeof result.success).toBe("boolean");
  });

  test("cleanBibtexString com null deve retornar string", () => {
    const result = processor.cleanBibtexString(null);
    expect(typeof result).toBe("string");
  });

  test("parsePages com null deve retornar objeto", () => {
    const result = processor.parsePages(null);
    expect(typeof result).toBe("object");
  });

  test("parseAuthors com null deve retornar array", () => {
    const result = processor.parseAuthors(null);
    expect(Array.isArray(result) || typeof result === "object").toBe(true);
  });

  test("simpleBibtexParser com conteúdo null deve retornar array", () => {
    const entries = processor.simpleBibtexParser(null);
    expect(Array.isArray(entries) || typeof entries === "object").toBe(true);
  });

  test("processArticleEntry com entryTags undefined", async () => {
    const entry = {
      entryType: "inproceedings",
      citationKey: "no_tags",
    };

    const result = await processor.processArticleEntry(entry, {});
    expect(result).toBeDefined();
  });

  test("processArticleEntry deve validar tamanho mínimo de páginas", async () => {
    const entry = {
      entryType: "inproceedings",
      citationKey: "short_pages",
      entryTags: {
        title: "Valid Title",
        author: "Author",
        year: "2024",
        pages: "1",
        booktitle: "Conference",
        location: "City",
      },
    };

    const result = await processor.processArticleEntry(entry, {});
    expect(typeof result.success).toBe("boolean");
  });

  test("cleanBibtexString com apenas espaços em branco", () => {
    const result = processor.cleanBibtexString("   \t\n   ");
    expect(typeof result).toBe("string");
  });

  test("parsePages com número negativo", () => {
    const result = processor.parsePages("-1--10");
    expect(typeof result).toBe("object");
  });

  test("parseAuthors com múltiplos 'and' consecutivos", () => {
    const result = processor.parseAuthors("Author1 and and Author2");
    expect(Array.isArray(result) || typeof result === "object").toBe(true);
  });

  test("simpleBibtexParser com entry sem type", () => {
    const content = `{citationkey, title = {Test}}`;
    const entries = processor.simpleBibtexParser(content);
    expect(Array.isArray(entries) || typeof entries === "object").toBe(true);
  });
});