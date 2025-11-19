import { jest } from '@jest/globals';
import * as EditionsService from '../../src/services/EditionsService.js';
import EditionsModel from '../../src/models/EditionsModel.js';
import ArticleModel from '../../src/models/ArticleModel.js';
import { NotFoundError, ConflictError } from '../../src/errors/baseErrors.js';

beforeEach(() => {
  jest.clearAllMocks();
  EditionsModel.find = jest.fn();
  EditionsModel.findById = jest.fn();
  EditionsModel.findOne = jest.fn();
  EditionsModel.create = jest.fn();
  EditionsModel.aggregate = jest.fn();

  ArticleModel.deleteMany = jest.fn();
});

describe('EditionsService.get', () => {
  it('deve retornar lista de edições', async () => {
    const list = [{ _id: 'e1', year: '2025' }];
    EditionsModel.find.mockReturnValue({ populate: () => ({ lean: () => ({ exec: () => Promise.resolve(list) }) }) });

    const res = await EditionsService.get({});
    expect(EditionsModel.find).toHaveBeenCalledWith({});
    expect(res).toEqual(list);
  });
});

describe('EditionsService.getById', () => {
  it('deve retornar edição quando encontrada', async () => {
    const ed = { _id: 'e1', year: '2025' };
    EditionsModel.findById.mockReturnValue({ populate: () => ({ lean: () => ({ exec: () => Promise.resolve(ed) }) }) });

    const res = await EditionsService.getById('e1');
    expect(EditionsModel.findById).toHaveBeenCalledWith('e1');
    expect(res).toEqual(ed);
  });

  it('deve lançar NotFoundError quando não encontrado', async () => {
    EditionsModel.findById.mockReturnValue({ populate: () => ({ lean: () => ({ exec: () => Promise.resolve(null) }) }) });
    await expect(EditionsService.getById('no')).rejects.toBeInstanceOf(NotFoundError);
  });
});

describe('EditionsService.create', () => {
  it('deve criar edição quando não há conflito', async () => {
    const input = { event: 'evt1', year: '2025' };
    const created = { _id: 'ed1', ...input };

    EditionsModel.findOne.mockReturnValue({ exec: () => Promise.resolve(null) });
    EditionsModel.create.mockResolvedValue(created);

    const res = await EditionsService.create(input);
    expect(EditionsModel.findOne).toHaveBeenCalledWith({ event: input.event, year: input.year });
    expect(EditionsModel.create).toHaveBeenCalledWith(input);
    expect(res).toEqual(created);
  });

  it('deve lançar ConflictError quando já existe edição para mesmo evento/ano', async () => {
    const input = { event: 'evt1', year: '2025' };
    EditionsModel.findOne.mockReturnValue({ exec: () => Promise.resolve({ _id: 'exists' }) });

    await expect(EditionsService.create(input)).rejects.toBeInstanceOf(ConflictError);
  });
});

describe('EditionsService.update', () => {
  it('deve atualizar edição sem conflito', async () => {
    const _id = 'ed1';
    const inputData = { place: 'Loc' };
    const saved = { _id, place: 'Loc' };
    const found = { event: 'evt1', year: '2025', set: jest.fn().mockReturnValue({ save: jest.fn().mockResolvedValue(saved) }) };

    EditionsModel.findById.mockReturnValue({ exec: () => Promise.resolve(found) });
    EditionsModel.findOne.mockReturnValue({ exec: () => Promise.resolve(null) });

    const res = await EditionsService.update({ _id, inputData });

    expect(EditionsModel.findById).toHaveBeenCalledWith(_id);
    expect(found.set).toHaveBeenCalledWith(inputData);
    expect(res).toEqual(saved);
  });

  it('deve lançar ConflictError quando atualização cria conflito', async () => {
    const _id = 'ed1';
    const inputData = { year: '2025', event: 'evt1' };
    const found = { event: 'evt1', year: '2024', set: jest.fn() };

    EditionsModel.findById.mockReturnValue({ exec: () => Promise.resolve(found) });
    EditionsModel.findOne.mockReturnValue({ exec: () => Promise.resolve({ _id: 'other' }) });

    await expect(EditionsService.update({ _id, inputData })).rejects.toBeInstanceOf(ConflictError);
  });

  it('deve lançar NotFoundError quando não encontrado', async () => {
    EditionsModel.findById.mockReturnValue({ exec: () => Promise.resolve(null) });
    await expect(EditionsService.update({ _id: 'no', inputData: {} })).rejects.toBeInstanceOf(NotFoundError);
  });
});

describe('EditionsService.destroy', () => {
  it('deve deletar edição e seus artigos relacionados', async () => {
    const _id = 'ed1';
    const found = { deleteOne: jest.fn().mockResolvedValue() };

    ArticleModel.deleteMany.mockResolvedValue({ deletedCount: 3 });
    EditionsModel.findById.mockReturnValue({ exec: () => Promise.resolve(found) });

    await EditionsService.destroy(_id);

    expect(ArticleModel.deleteMany).toHaveBeenCalledWith({ edition: _id });
    expect(found.deleteOne).toHaveBeenCalled();
  });

  it('deve lançar NotFoundError quando não encontrado', async () => {
    EditionsModel.findById.mockReturnValue({ exec: () => Promise.resolve(null) });
    await expect(EditionsService.destroy('no')).rejects.toBeInstanceOf(NotFoundError);
  });
});

describe('EditionsService.searchByName', () => {
  it('deve buscar por name usando regex', async () => {
    const resList = [{ _id: 'e1', name: 'Name' }];
    EditionsModel.find.mockReturnValue({ populate: () => ({ sort: () => ({ lean: () => ({ exec: () => Promise.resolve(resList) }) }) }) });

    const res = await EditionsService.searchByName({ name: 'Name', inputFilters: {} });
    expect(EditionsModel.find).toHaveBeenCalled();
    expect(res).toEqual(resList);
  });
});

describe('EditionsService.searchEditions', () => {
  it('deve usar aggregate quando name fornecido', async () => {
    const out = [{ _id: 'a' }];
    EditionsModel.aggregate.mockResolvedValue(out);

    const res = await EditionsService.searchEditions({ name: 'x', inputFilters: {} });
    expect(EditionsModel.aggregate).toHaveBeenCalled();
    expect(res).toEqual(out);
  });

  it('deve retornar find quando name não fornecido', async () => {
    const list = [{ _id: 'b' }];
    EditionsModel.find.mockReturnValue({ populate: () => ({ sort: () => ({ lean: () => ({ exec: () => Promise.resolve(list) }) }) }) });

    const res = await EditionsService.searchEditions({ name: null, inputFilters: {} });
    expect(EditionsModel.find).toHaveBeenCalledWith({});
    expect(res).toEqual(list);
  });
});
