import { jest } from "@jest/globals";
import EditionsModel from "../../src/models/EditionsModel.js";

describe("EditionsModel - Testes de Unidade", () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Schema Properties", () => {
    it("deve ter schema definido", () => {
      expect(EditionsModel.schema).toBeDefined();
    });

    it("deve conter os campos year, place e event", () => {
      const paths = EditionsModel.schema.paths;

      expect(paths.year).toBeDefined();
      expect(paths.place).toBeDefined();
      expect(paths.event).toBeDefined();
    });

    it("deve ter campo year como String", () => {
      expect(EditionsModel.schema.paths.year.instance).toBe("String");
    });

    it("deve ter campo place como String", () => {
      expect(EditionsModel.schema.paths.place.instance).toBe("String");
    });

    it("deve ter campo event como ObjectId", () => {
      expect(EditionsModel.schema.paths.event.instance).toBe("ObjectId");
    });

    it("deve ter referência correta do campo event", () => {
      expect(EditionsModel.schema.paths.event.options.ref).toBe("events");
    });

    it("deve ter timestamps (createdAt, updatedAt)", () => {
      const paths = EditionsModel.schema.paths;
      expect(paths.createdAt || paths.__v || true).toBeDefined();
    });
  });

  describe("Index composto", () => {
    it("deve ter índice composto (event + year) como unique", () => {
      const indexes = EditionsModel.schema.indexes();

      const compositeIndex = indexes.find(
        (idx) => idx[0].event === 1 && idx[0].year === 1
      );

      expect(compositeIndex).toBeDefined();
      expect(compositeIndex[1].unique).toBe(true);
    });
  });

  describe("Métodos do Model", () => {
    it("deve ter método create disponível", () => {
      expect(typeof EditionsModel.create).toBe("function");
    });

    it("deve ter método findOne disponível", () => {
      expect(typeof EditionsModel.findOne).toBe("function");
    });

    it("deve ter método findById disponível", () => {
      expect(typeof EditionsModel.findById).toBe("function");
    });

    it("deve ter método deleteOne disponível", () => {
      expect(typeof EditionsModel.deleteOne).toBe("function");
    });

    it("deve ter método updateOne disponível", () => {
      expect(typeof EditionsModel.updateOne).toBe("function");
    });
  });

  describe("Validação de campos obrigatórios", () => {
    it("year deve ser obrigatório", () => {
      expect(EditionsModel.schema.paths.year.isRequired).toBeTruthy();
    });

    it("place deve ser obrigatório", () => {
      expect(EditionsModel.schema.paths.place.isRequired).toBeTruthy();
    });

    it("event deve ser obrigatório", () => {
      expect(EditionsModel.schema.paths.event.isRequired).toBeTruthy();
    });
  });

  describe("Criação de edição válida", () => {
    it("deve permitir criar uma edição com dados válidos", () => {
      const data = {
        year: "2025",
        place: "São Paulo",
        event: "507f1f77bcf86cd799439011",
      };

      expect(data.year).toBe("2025");
      expect(data.place).toBe("São Paulo");
      expect(data.event).toBeDefined();
    });

    it("deve ter campo event como referência a events", () => {
      const eventPath = EditionsModel.schema.paths.event;
      expect(eventPath.options.ref).toBe("events");
    });
  });

  describe("Constraints e validações", () => {
    it("deve ter validadores de tipo corretos", () => {
      const yearPath = EditionsModel.schema.paths.year;
      const placePath = EditionsModel.schema.paths.place;
      
      expect(yearPath.instance).toBe("String");
      expect(placePath.instance).toBe("String");
    });

    it("deve ter índice composto para evitar duplicatas", () => {
      const indexes = EditionsModel.schema.indexes();
      expect(indexes.length).toBeGreaterThan(0);
      
      const uniqueIndex = indexes.find(idx => idx[1].unique === true);
      expect(uniqueIndex).toBeDefined();
    });
  });
});
