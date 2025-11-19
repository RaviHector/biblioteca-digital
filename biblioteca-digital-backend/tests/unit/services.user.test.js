import { jest } from '@jest/globals';
import UserModel from '../../src/models/UserModel.js';
import * as UserService from '../../src/services/UserService.js';
import { NotFoundError, ForbiddenError } from '../../src/errors/baseErrors.js';

beforeEach(() => {
  jest.clearAllMocks();
  UserModel.find = jest.fn();
  UserModel.findById = jest.fn();
  UserModel.findOne = jest.fn();
  UserModel.create = jest.fn();
});

describe('UserService.get', () => {
  it('deve retornar lista de usuários', async () => {
    const list = [{ _id: 'u1', email: 'a@a.com' }];
    UserModel.find.mockReturnValue({ lean: () => ({ exec: () => Promise.resolve(list) }) });

    const res = await UserService.get({});
    expect(UserModel.find).toHaveBeenCalledWith({});
    expect(res).toEqual(list);
  });
});

describe('UserService.getById', () => {
  it('deve retornar usuário quando encontrado', async () => {
    const u = { _id: 'u1', email: 'a@a.com' };
    UserModel.findById.mockReturnValue({ lean: () => ({ exec: () => Promise.resolve(u) }) });

    const res = await UserService.getById('u1');
    expect(UserModel.findById).toHaveBeenCalledWith('u1');
    expect(res).toEqual(u);
  });

  it('deve lançar NotFoundError quando não encontrado', async () => {
    UserModel.findById.mockReturnValue({ lean: () => ({ exec: () => Promise.resolve(null) }) });
    await expect(UserService.getById('no')).rejects.toBeInstanceOf(NotFoundError);
  });
});

describe('UserService.create', () => {
  it('deve criar usuário com senha hasheada', async () => {
    const input = { email: 'x@y.com', password: 'plain' };
    const createdDoc = { _id: 'u2', email: 'x@y.com', toObject: () => ({ _id: 'u2', email: 'x@y.com' }) };

    UserModel.findOne.mockReturnValue({ lean: () => ({ exec: () => Promise.resolve(null) }) });
    // allow real hashPassword to run (bcrypt is installed) or just assert create was called
    UserModel.create.mockResolvedValue(createdDoc);

    const res = await UserService.create(input);

    expect(UserModel.findOne).toHaveBeenCalledWith({ email: input.email });
    expect(UserModel.create).toHaveBeenCalledWith(expect.objectContaining({ email: input.email, password: expect.any(String) }));
    expect(res).toEqual({ _id: 'u2', email: 'x@y.com' });
  });

  it('deve lançar erro se email já existe', async () => {
    const input = { email: 'x@y.com', password: 'plain' };
    UserModel.findOne.mockReturnValue({ lean: () => ({ exec: () => Promise.resolve({ _id: 'exists' }) }) });

    await expect(UserService.create(input)).rejects.toThrow(/Email já está em uso/);
  });

  it('deve lançar ForbiddenError ao criar admin sem permissões', async () => {
    const input = { email: 'adm@e.com', password: 'p', isAdmin: true };
    UserModel.findOne.mockReturnValue({ lean: () => ({ exec: () => Promise.resolve(null) }) });

    await expect(UserService.create(input, null)).rejects.toBeInstanceOf(ForbiddenError);
  });
});

describe('UserService.update', () => {
  it('deve atualizar usuário e hashear nova senha se fornecida', async () => {
    const _id = 'u3';
    const inputData = { password: 'newpass' };
    const found = { set: jest.fn().mockReturnValue({ save: jest.fn().mockResolvedValue({ toObject: () => ({ _id, email: 'u@e.com' }) }) }) };

    UserModel.findById.mockReturnValue({ exec: () => Promise.resolve(found) });
    const res = await UserService.update({ _id, inputData });

    expect(UserModel.findById).toHaveBeenCalledWith(_id);
    expect(found.set).toHaveBeenCalledWith(expect.objectContaining({ password: expect.any(String) }));
    expect(res).toEqual({ _id, email: 'u@e.com' });
  });

  it('deve lançar NotFoundError ao atualizar inexistente', async () => {
    UserModel.findById.mockReturnValue({ exec: () => Promise.resolve(null) });
    await expect(UserService.update({ _id: 'no', inputData: {} })).rejects.toBeInstanceOf(NotFoundError);
  });
});

describe('UserService.destroy', () => {
  it('deve deletar usuário quando encontrado', async () => {
    const found = { deleteOne: jest.fn().mockResolvedValue() };
    UserModel.findById.mockReturnValue({ exec: () => Promise.resolve(found) });

    await UserService.destroy('u1');
    expect(UserModel.findById).toHaveBeenCalledWith('u1');
    expect(found.deleteOne).toHaveBeenCalled();
  });

  it('deve lançar NotFoundError ao deletar inexistente', async () => {
    UserModel.findById.mockReturnValue({ exec: () => Promise.resolve(null) });
    await expect(UserService.destroy('no')).rejects.toBeInstanceOf(NotFoundError);
  });
});
