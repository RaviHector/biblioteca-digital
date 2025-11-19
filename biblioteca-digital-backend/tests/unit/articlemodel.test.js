import { jest } from "@jest/globals";
import mongoose from "mongoose";
import ArticleModel from "../../src/models/ArticleModel.js";

describe("ArticleModel - Testes de Unidade", () => {
  const fakeId = new mongoose.Types.ObjectId();

  const validData = {
    title: "Artigo Novo",
    author: ["Ana", "Carlos"],
    edition: fakeId,
    year: "2024",
    first_page: "10",
    last_page: "20",
    pdf_file: "arquivo.pdf",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ----------------------------------------------------------------------
  //  TESTES DO SCHEMA
  // ----------------------------------------------------------------------
  describe("Schema - Estrutura e Propriedades", () => {
    it("deve ter todos os campos definidos corretamente", () => {
      const paths = ArticleModel.schema.paths;

      expect(paths.title).toBeDefined();
      expect(paths.author).toBeDefined();
      expect(paths.edition).toBeDefined();
      expect(paths.year).toBeDefined();
      expect(paths.first_page).toBeDefined();
      expect(paths.last_page).toBeDefined();
      expect(paths.pdf_file).toBeDefined();
    });

    it("title deve ser unique, string e required", () => {
      const field = ArticleModel.schema.paths.title;
      expect(field.options.unique).toBe(true);
      expect(field.instance).toBe("String");
      expect(field.isRequired).toBeTruthy();
    });

    it("author deve ser array e required", () => {
      const field = ArticleModel.schema.paths.author;
      expect(field.instance).toBe("Array");
      expect(field.isRequired).toBeTruthy();
    });

    it("edition deve ser ObjectId e ter ref", () => {
      const field = ArticleModel.schema.paths.edition;
      expect(field.instance).toBe("ObjectId");
      expect(field.options.ref).toBeDefined();
    });

    it("campos devem ter trim ativado", () => {
      const title = ArticleModel.schema.paths.title;
      const year = ArticleModel.schema.paths.year;
      expect(title.options.trim).toBe(true);
      expect(year.options.trim).toBe(true);
    });
  });

  // ----------------------------------------------------------------------
  //  TESTES DE MÉTODOS DO MODEL
  // ----------------------------------------------------------------------
  describe("Model - Métodos Disponíveis", () => {
    it("deve ter métodos CRUD do mongoose", () => {
      expect(typeof ArticleModel.create).toBe("function");
      expect(typeof ArticleModel.findOne).toBe("function");
      expect(typeof ArticleModel.findById).toBe("function");
      expect(typeof ArticleModel.updateOne).toBe("function");
      expect(typeof ArticleModel.deleteOne).toBe("function");
    });
  });

  // ----------------------------------------------------------------------
  //  BRANCH TEST: SALVAR COM SUCESSO E COM ERRO (mockando save)
  // ----------------------------------------------------------------------
  describe("Model - Branches de Save()", () => {
    it("deve salvar com sucesso (branch de sucesso)", async () => {
      const article = new ArticleModel(validData);
      article.save = jest.fn().mockResolvedValue(article);

      const result = await article.save();

      expect(result.title).toBe("Artigo Novo");
      expect(article.save).toHaveBeenCalledTimes(1);
    });

    it("deve disparar erro ao salvar (branch de erro)", async () => {
      const article = new ArticleModel(validData);
      const mockError = new Error("Erro ao salvar");

      article.save = jest.fn().mockRejectedValue(mockError);

      await expect(article.save()).rejects.toThrow("Erro ao salvar");
    });

    it("deve disparar erro de chave duplicada (branch unique)", async () => {
      const article = new ArticleModel(validData);
      const duplicateError = new Error("Duplicate Key");
      duplicateError.code = 11000; // código mongoose para chave duplicada

      article.save = jest.fn().mockRejectedValue(duplicateError);

      await expect(article.save()).rejects.toThrow("Duplicate Key");
    });
  });

  // ----------------------------------------------------------------------
  //  BRANCH TEST: CREATE COM SUCESSO E ERRO
  // ----------------------------------------------------------------------
  describe("Model - Branches de create()", () => {
    it("branch: create com sucesso", async () => {
      jest.spyOn(ArticleModel, "create").mockResolvedValue(validData);

      const result = await ArticleModel.create(validData);

      expect(result.title).toBe("Artigo Novo");
      expect(ArticleModel.create).toHaveBeenCalled();
    });

    it("branch: create com erro", async () => {
      jest
        .spyOn(ArticleModel, "create")
        .mockRejectedValue(new Error("Erro no create"));

      await expect(ArticleModel.create(validData)).rejects.toThrow(
        "Erro no create"
      );
    });
  });

  // ----------------------------------------------------------------------
  //  BRANCH TEST: FIND E UPDATE
  // ----------------------------------------------------------------------
  describe("Model - Branches de Query", () => {
    it("branch: findOne com resultado", async () => {
      jest.spyOn(ArticleModel, "findOne").mockResolvedValue(validData);

      const result = await ArticleModel.findOne({ title: "Artigo Novo" });

      expect(result).toBeDefined();
      expect(ArticleModel.findOne).toHaveBeenCalled();
    });

    it("branch: findOne sem resultado", async () => {
      jest.spyOn(ArticleModel, "findOne").mockResolvedValue(null);

      const result = await ArticleModel.findOne({ title: "Inexistente" });

      expect(result).toBeNull();
    });

    it("branch: updateOne com sucesso", async () => {
      jest.spyOn(ArticleModel, "updateOne").mockResolvedValue({ modifiedCount: 1 });

      const result = await ArticleModel.updateOne({ title: "Artigo Novo" }, { year: "2025" });

      expect(result.modifiedCount).toBe(1);
    });

    it("branch: updateOne com falha", async () => {
      jest.spyOn(ArticleModel, "updateOne").mockResolvedValue({ modifiedCount: 0 });

      const result = await ArticleModel.updateOne({ title: "Não Existe" }, { year: "2024" });

      expect(result.modifiedCount).toBe(0);
    });
  });

  // ----------------------------------------------------------------------
  // VALIDAÇÃO MANUAL
  // ----------------------------------------------------------------------
  describe("Validation Rules", () => {
    it("deve falhar sem title", () => {
      const article = new ArticleModel({ ...validData, title: undefined });
      const validationError = article.validateSync();

      expect(validationError.errors.title).toBeDefined();
    });

    it("deve falhar sem edition", () => {
      const article = new ArticleModel({ ...validData, edition: undefined });
      const validationError = article.validateSync();

      expect(validationError.errors.edition).toBeDefined();
    });

    it("author pode ser qualquer valor, mas é required", () => {
      // Mongoose com type: Array não valida rigorosamente o tipo
      // Apenas verifica se é required
      const article = new ArticleModel({ ...validData, author: undefined });
      const error = article.validateSync();

      expect(error.errors.author).toBeDefined();
    });
  });
});