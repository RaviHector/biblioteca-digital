import { jest } from "@jest/globals";
import {
  AppError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  BadRequest,
  InternalServerError,
} from "../../src/errors/baseErrors.js";

describe("BaseErrors - Testes de Classes de Erro", () => {
  test("AppError deve ser criada com propriedades corretas", () => {
    const error = new AppError("TestError", 400, "Test message", true);

    expect(error.name).toBe("TestError");
    expect(error.httpCode).toBe(400);
    expect(error.message).toBe("Test message");
    expect(error.isOperational).toBe(true);
  });

  test("AppError deve herdar de Error", () => {
    const error = new AppError("TestError", 400, "Test", true);
    expect(error instanceof Error).toBe(true);
  });

  test("ValidationError deve ter código FORBIDDEN", () => {
    const error = new ValidationError("Validation failed");

    expect(error.name).toBe("ValidationError");
    expect(error.httpCode).toBe(403);
    expect(error.message).toBe("Validation failed");
    expect(error.isOperational).toBe(true);
  });

  test("UnauthorizedError deve ter código UNAUTHORIZED", () => {
    const error = new UnauthorizedError("Unauthorized access");

    expect(error.httpCode).toBe(401);
    expect(error.message).toBe("Unauthorized access");
  });

  test("ForbiddenError deve ter código FORBIDDEN", () => {
    const error = new ForbiddenError("Forbidden access");

    expect(error.httpCode).toBe(403);
    expect(error.message).toBe("Forbidden access");
  });

  test("NotFoundError deve ter código NOT_FOUND", () => {
    const error = new NotFoundError("Resource not found");

    expect(error.httpCode).toBe(404);
    expect(error.message).toBe("Resource not found");
  });

  test("ConflictError deve ter código CONFLICT", () => {
    const error = new ConflictError("Resource conflict");

    expect(error.httpCode).toBe(409);
    expect(error.message).toBe("Resource conflict");
  });

  test("BadRequest deve ter código BAD_REQUEST", () => {
    const error = new BadRequest("Bad request");

    expect(error.httpCode).toBe(400);
    expect(error.message).toBe("Bad request");
  });

  test("InternalServerError deve ter mensagem padrão", () => {
    const error = new InternalServerError();

    expect(error.httpCode).toBe(500);
    expect(error.message).toBe("Something went wrong");
  });

  test("InternalServerError deve aceitar mensagem customizada", () => {
    const error = new InternalServerError("Custom error");

    expect(error.message).toBe("Custom error");
    expect(error.httpCode).toBe(500);
  });

  test("Todos erros devem ter isOperational = true", () => {
    const errors = [
      new ValidationError("test"),
      new UnauthorizedError("test"),
      new ForbiddenError("test"),
      new NotFoundError("test"),
      new ConflictError("test"),
      new BadRequest("test"),
      new InternalServerError("test"),
    ];

    errors.forEach((error) => {
      expect(error.isOperational).toBe(true);
      expect(error.httpCode).toBeDefined();
      expect(error.message).toBeDefined();
    });
  });

  test("AppError com isOperational = false", () => {
    const error = new AppError("Critical", 500, "Critical error", false);

    expect(error.isOperational).toBe(false);
  });
});
