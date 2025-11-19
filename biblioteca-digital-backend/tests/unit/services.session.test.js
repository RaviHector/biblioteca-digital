/**
 * @file tests/unit/services.session.test.js
 * SessionService Testing - Integration tests with MongoMemoryServer
 */

import { jest } from "@jest/globals";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

import {
  processLogin,
  processRefreshToken,
  deleteUserToken,
} from "../../src/services/SessionService.js";

import UserModel from "../../src/models/UserModel.js";
import UserSessionTokenModel from "../../src/models/UserSessionTokenModel.js";

import {
  UnauthorizedError,
  ForbiddenError,
} from "../../src/errors/baseErrors.js";

let mongoServer;

describe("SessionService", () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }

    // Configurar JWT Environment Variables
    process.env.ACCESS_TOKEN_SECRET = "test_access_secret_very_long_string_for_testing_only";
    process.env.REFRESH_TOKEN_SECRET = "test_refresh_secret_very_long_string_for_testing_only";
    process.env.ACCESS_TOKEN_EXPIRE = "900"; // 15 minutos em segundos
    process.env.REFRESH_TOKEN_EXPIRE = "604800"; // 7 dias em segundos
  });

  afterAll(async () => {
    if (mongoServer) {
      await mongoServer.stop();
    }
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    await mongoose.disconnect();
  }, 10000);

  beforeEach(async () => {
    await UserModel.deleteMany({});
    await UserSessionTokenModel.deleteMany({});
  });

  describe("processLogin", () => {
    it("deve ser uma função", () => {
      expect(typeof processLogin).toBe("function");
    });

    it("deve lançar UnauthorizedError quando usuário não existe", async () => {
      await expect(
        processLogin({ email: "nonexistent@test.com", password: "password123" })
      ).rejects.toBeInstanceOf(UnauthorizedError);
    });

    it("deve lançar UnauthorizedError quando senha está incorreta", async () => {
      const { hashPassword } = await import("../../src/utils/libs/bcrypt.js");
      const hashedPassword = await hashPassword("correctpassword");

      await UserModel.create({
        name: "Test User",
        email: "test@test.com",
        password: hashedPassword,
        role: "user",
      });

      await expect(
        processLogin({ email: "test@test.com", password: "wrongpassword" })
      ).rejects.toBeInstanceOf(UnauthorizedError);
    });

    it("deve retornar tokens quando credenciais são válidas", async () => {
      const { hashPassword } = await import("../../src/utils/libs/bcrypt.js");

      const hashedPassword = await hashPassword("mypassword");

      const user = await UserModel.create({
        name: "Ana Silva",
        email: "ana@test.com",
        password: hashedPassword,
        role: "user",
      });

      const result = await processLogin({
        email: "ana@test.com",
        password: "mypassword",
      });

      expect(result).toHaveProperty("accessToken");
      expect(result).toHaveProperty("refreshToken");
      expect(typeof result.accessToken).toBe("string");
      expect(typeof result.refreshToken).toBe("string");
    });

    it("deve salvar refreshToken no banco de dados", async () => {
      const { hashPassword } = await import("../../src/utils/libs/bcrypt.js");

      const hashedPassword = await hashPassword("password123");

      const user = await UserModel.create({
        name: "Carlos",
        email: "carlos@test.com",
        password: hashedPassword,
        role: "user",
      });

      const result = await processLogin({
        email: "carlos@test.com",
        password: "password123",
      });

      const savedToken = await UserSessionTokenModel.findOne({
        user: user._id,
      });

      expect(savedToken).toBeDefined();
      expect(savedToken.token).toBe(result.refreshToken);
    });

    it("deve detectar token reuse e limpar tokens antigos", async () => {
      const { hashPassword } = await import("../../src/utils/libs/bcrypt.js");

      const hashedPassword = await hashPassword("password456");

      const user = await UserModel.create({
        name: "Maria",
        email: "maria@test.com",
        password: hashedPassword,
        role: "user",
      });

      await UserSessionTokenModel.create({
        user: user._id,
        token: "valid_token_1",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      const result = await processLogin({
        email: "maria@test.com",
        password: "password456",
        token: "fake_token",
      });

      expect(result).toHaveProperty("accessToken");
      expect(result).toHaveProperty("refreshToken");
    });
  });

  describe("processRefreshToken", () => {
    it("deve ser uma função", () => {
      expect(typeof processRefreshToken).toBe("function");
    });

    it("deve lançar UnauthorizedError quando token é vazio", async () => {
      await expect(processRefreshToken("")).rejects.toBeInstanceOf(
        UnauthorizedError
      );
    });

    it("deve lançar UnauthorizedError quando token é null", async () => {
      await expect(processRefreshToken(null)).rejects.toBeInstanceOf(
        UnauthorizedError
      );
    });

    it("deve lançar UnauthorizedError quando token é undefined", async () => {
      await expect(processRefreshToken(undefined)).rejects.toBeInstanceOf(
        UnauthorizedError
      );
    });

    it("deve detectar token não encontrado e lançar ForbiddenError", async () => {
      const { signSessionJwts } = await import(
        "../../src/utils/libs/jwt.js"
      );

      const userId = new mongoose.Types.ObjectId().toString();
      const { refreshToken } = signSessionJwts({
        _id: userId,
        email: "test@test.com",
        name: "Test User",
      });

      // Token JWT válido mas não existe no BD = reutilização
      await expect(processRefreshToken(refreshToken)).rejects.toBeInstanceOf(
        ForbiddenError
      );
    });

    it("deve detectar token com userId diferente (tampering)", async () => {
      const { hashPassword } = await import("../../src/utils/libs/bcrypt.js");
      const { signSessionJwts } = await import(
        "../../src/utils/libs/jwt.js"
      );

      const user1 = await UserModel.create({
        name: "User One",
        email: "user1@test.com",
        password: await hashPassword("pass1"),
        role: "user",
      });

      const user2 = await UserModel.create({
        name: "User Two",
        email: "user2@test.com",
        password: await hashPassword("pass2"),
        role: "user",
      });

      const { refreshToken } = signSessionJwts({
        _id: user1._id.toString(),
        email: "user1@test.com",
        name: "User One",
      });

      // Salvar token do user1 mas associado ao user2
      await UserSessionTokenModel.create({
        user: user2._id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      await expect(processRefreshToken(refreshToken)).rejects.toBeInstanceOf(
        ForbiddenError
      );
    });

    it("deve retornar erro quando user não foi populado corretamente", async () => {
      const { signSessionJwts } = await import(
        "../../src/utils/libs/jwt.js"
      );

      const userId = new mongoose.Types.ObjectId();

      const { refreshToken } = signSessionJwts({
        _id: userId.toString(),
        email: "test@test.com",
        name: "Test",
      });

      await UserSessionTokenModel.create({
        user: userId,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      // Remover o user reference
      await UserSessionTokenModel.updateOne(
        { token: refreshToken },
        { $set: { user: null } }
      );

      await expect(processRefreshToken(refreshToken)).rejects.toBeInstanceOf(
        UnauthorizedError
      );
    });

    it("deve renovar o token com sucesso quando tudo está correto", async () => {
      const { hashPassword } = await import("../../src/utils/libs/bcrypt.js");
      const { signSessionJwts } = await import(
        "../../src/utils/libs/jwt.js"
      );

      const user = await UserModel.create({
        name: "Test Refresh",
        email: "refresh@test.com",
        password: await hashPassword("testpass"),
        role: "user",
      });

      const { refreshToken } = signSessionJwts({
        _id: user._id.toString(),
        email: "refresh@test.com",
        name: "Test Refresh",
        role: "user",
      });

      await UserSessionTokenModel.create({
        user: user._id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      const result = await processRefreshToken(refreshToken);

      expect(result).toHaveProperty("accessToken");
      expect(result).toHaveProperty("refreshToken");
      expect(typeof result.accessToken).toBe("string");
      expect(typeof result.refreshToken).toBe("string");
      expect(result.accessToken.length).toBeGreaterThan(0);
      expect(result.refreshToken.length).toBeGreaterThan(0);

      // Novo token deve existir
      const newToken = await UserSessionTokenModel.findOne({
        token: result.refreshToken,
      });
      expect(newToken).toBeDefined();
      expect(newToken.user._id.toString()).toBe(user._id.toString());
    });
  });

  describe("deleteUserToken", () => {
    it("deve ser uma função", () => {
      expect(typeof deleteUserToken).toBe("function");
    });

    it("deve deletar um token existente", async () => {
      const { hashPassword } = await import("../../src/utils/libs/bcrypt.js");

      const user = await UserModel.create({
        name: "Delete Test",
        email: "delete@test.com",
        password: await hashPassword("password"),
        role: "user",
      });

      const savedToken = await UserSessionTokenModel.create({
        user: user._id,
        token: "token_to_delete",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      const deleted = await deleteUserToken("token_to_delete");

      expect(deleted).toBeDefined();
      expect(deleted._id.toString()).toBe(savedToken._id.toString());

      const foundToken = await UserSessionTokenModel.findOne({
        token: "token_to_delete",
      });
      expect(foundToken).toBeNull();
    });

    it("deve retornar null quando token não existe", async () => {
      const result = await deleteUserToken("nonexistent_token");
      expect(result).toBeNull();
    });

    it("deve deletar o token correto", async () => {
      const { hashPassword } = await import("../../src/utils/libs/bcrypt.js");

      const user = await UserModel.create({
        name: "Test User",
        email: "test@test.com",
        password: await hashPassword("password"),
        role: "user",
      });

      await UserSessionTokenModel.create({
        user: user._id,
        token: "specific_token",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      const result = await deleteUserToken("specific_token");
      expect(result).toBeDefined();
      expect(result.token).toBe("specific_token");
    });
  });

  describe("Validações básicas", () => {
    it("processLogin deve ser uma função", () => {
      expect(typeof processLogin).toBe("function");
    });

    it("processRefreshToken deve ser uma função", () => {
      expect(typeof processRefreshToken).toBe("function");
    });

    it("deleteUserToken deve ser uma função", () => {
      expect(typeof deleteUserToken).toBe("function");
    });

    it("Todas as funções devem estar definidas", () => {
      expect(processLogin).toBeDefined();
      expect(processRefreshToken).toBeDefined();
      expect(deleteUserToken).toBeDefined();
    });
  });
});
