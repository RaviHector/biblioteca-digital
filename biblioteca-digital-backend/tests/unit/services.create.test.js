import { jest } from '@jest/globals';
import * as EventsService from '../../src/services/EventsService.js'
import EventsModel from '../../src/models/EventsModel.js';
import EditionsModel from '../../src/models/EditionsModel.js';
import ArticleModel from '../../src/models/ArticleModel.js';
import { NotFoundError } from '../../src/errors/baseErrors.js';

// Preparar mocks
beforeEach(() => {
  jest.clearAllMocks();
  EventsModel.create = jest.fn();
  EventsModel.find = jest.fn();
  EventsModel.findById = jest.fn();
  EditionsModel.find = jest.fn();
  EditionsModel.deleteMany = jest.fn();
  ArticleModel.deleteMany = jest.fn();
});

describe("EventsService.create", () => {
  it("deve criar e retornar um evento como objeto", async () => {
    const inputData = {
      name: "Novo Evento",
      sigla: "NE",
      entity: "UFMG",
    };

    const createdEvent = {
      ...inputData,
      _id: "abc123",
      toObject: () => ({ _id: "abc123", ...inputData }),
    };

    // Simula `EventsModel.create()`
    EventsModel.create.mockResolvedValue(createdEvent);

    const result = await EventsService.create(inputData);

    expect(EventsModel.create).toHaveBeenCalledWith(inputData);
    expect(result).toEqual({
      _id: "abc123",
      name: "Novo Evento",
      sigla: "NE",
      entity: "UFMG",
    });
  });
});

describe('EventsService.get', () => {
  it('deve retornar lista de eventos', async () => {
    const events = [{ _id: '1', name: 'E1' }];
    EventsModel.find.mockReturnValue({
      lean: () => ({ exec: () => Promise.resolve(events) }),
    });

    const result = await EventsService.get({});

    expect(EventsModel.find).toHaveBeenCalledWith({});
    expect(result).toEqual(events);
  });
});

describe('EventsService.getById', () => {
  it('deve retornar evento quando encontrado', async () => {
    const event = { _id: '1', name: 'E1' };
    EventsModel.findById.mockReturnValue({ lean: () => ({ exec: () => Promise.resolve(event) }) });

    const result = await EventsService.getById('1');

    expect(EventsModel.findById).toHaveBeenCalledWith('1');
    expect(result).toEqual(event);
  });

  it('deve lançar NotFoundError quando não encontrado', async () => {
    EventsModel.findById.mockReturnValue({ lean: () => ({ exec: () => Promise.resolve(null) }) });

    await expect(EventsService.getById('nonexistent')).rejects.toBeInstanceOf(NotFoundError);
  });
});

describe('EventsService.update', () => {
  it('deve atualizar e retornar o evento salvo', async () => {
    const _id = '1';
    const inputData = { name: 'Novo' };
    const saved = { _id, name: 'Novo' };
    const found = { set: jest.fn().mockReturnValue({ save: jest.fn().mockResolvedValue(saved) }) };

    EventsModel.findById.mockReturnValue({ exec: () => Promise.resolve(found) });

    const result = await EventsService.update({ _id, inputData });

    expect(EventsModel.findById).toHaveBeenCalledWith(_id);
    expect(found.set).toHaveBeenCalledWith(inputData);
    expect(result).toEqual(saved);
  });

  it('deve lançar NotFoundError ao tentar atualizar evento inexistente', async () => {
    EventsModel.findById.mockReturnValue({ exec: () => Promise.resolve(null) });

    await expect(EventsService.update({ _id: 'no', inputData: {} })).rejects.toBeInstanceOf(NotFoundError);
  });
});

describe('EventsService.destroy', () => {
  it('deve deletar evento, suas edições e artigos relacionados', async () => {
    const _id = 'evt1';
    const relatedEditions = [{ _id: 'ed1' }, { _id: 'ed2' }];
    const found = { deleteOne: jest.fn().mockResolvedValue() };

    EditionsModel.find.mockReturnValue({ select: jest.fn().mockReturnValue({ exec: () => Promise.resolve(relatedEditions) }) });
    ArticleModel.deleteMany.mockResolvedValue({ deletedCount: 2 });
    EditionsModel.deleteMany.mockResolvedValue({ deletedCount: 2 });
    EventsModel.findById.mockReturnValue({ exec: () => Promise.resolve(found) });

    await EventsService.destroy(_id);

    expect(EditionsModel.find).toHaveBeenCalledWith({ event: _id });
    expect(ArticleModel.deleteMany).toHaveBeenCalledWith({ edition: { $in: ['ed1', 'ed2'] } });
    expect(EditionsModel.deleteMany).toHaveBeenCalledWith({ event: _id });
    expect(found.deleteOne).toHaveBeenCalled();
  });
});
