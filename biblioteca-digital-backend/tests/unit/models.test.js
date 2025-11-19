import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import ArticleModel from '../../src/models/ArticleModel.js';
import EditionsModel from '../../src/models/EditionsModel.js';
import EventsModel from '../../src/models/EventsModel.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
  mongoose.set('strictQuery', true);
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

describe('Models - Basic Tests', () => {
  describe('ArticleModel', () => {
    test('ArticleModel should have correct schema', () => {
      expect(ArticleModel.schema.paths.title).toBeDefined();
      expect(ArticleModel.schema.paths.author).toBeDefined();
      expect(ArticleModel.schema.paths.year).toBeDefined();
      expect(ArticleModel.schema.paths.first_page).toBeDefined();
      expect(ArticleModel.schema.paths.last_page).toBeDefined();
    });

    test('ArticleModel should create document', async () => {
      const event = await EventsModel.create({
        name: `Event ${Date.now()}`,
        sigla: 'E',
        entity: 'Entity',
      });

      const edition = await EditionsModel.create({
        year: '2024',
        place: 'City',
        event: event._id,
      });

      const article = await ArticleModel.create({
        title: `Test Article ${Date.now()}`,
        author: ['Author 1', 'Author 2'],
        year: '2024',
        first_page: '1',
        last_page: '10',
        edition: edition._id,
      });

      expect(article._id).toBeDefined();
      expect(article.title).toBeTruthy();
      expect(article.author).toHaveLength(2);
    });

    test('ArticleModel should find by ID', async () => {
      const event = await EventsModel.create({
        name: `Event ${Date.now()}`,
        sigla: 'E2',
        entity: 'Entity 2',
      });

      const edition = await EditionsModel.create({
        year: '2024',
        place: 'City 2',
        event: event._id,
      });

      const article = await ArticleModel.create({
        title: `Find Article ${Date.now()}`,
        author: ['Author A'],
        year: '2024',
        first_page: '1',
        last_page: '10',
        edition: edition._id,
      });

      const found = await ArticleModel.findById(article._id);
      expect(found).toBeDefined();
      expect(found._id).toEqual(article._id);
    });

    test('ArticleModel should update document', async () => {
      const event = await EventsModel.create({
        name: `Event ${Date.now()}`,
        sigla: 'E3',
        entity: 'Entity 3',
      });

      const edition = await EditionsModel.create({
        year: '2024',
        place: 'City 3',
        event: event._id,
      });

      const article = await ArticleModel.create({
        title: `Update Article ${Date.now()}`,
        author: ['Author'],
        year: '2024',
        first_page: '1',
        last_page: '10',
        edition: edition._id,
      });

      const updated = await ArticleModel.findByIdAndUpdate(
        article._id,
        { year: '2025' },
        { new: true }
      );

      expect(updated.year).toBe('2025');
    });

    test('ArticleModel should delete document', async () => {
      const event = await EventsModel.create({
        name: `Event ${Date.now()}`,
        sigla: 'E4',
        entity: 'Entity 4',
      });

      const edition = await EditionsModel.create({
        year: '2024',
        place: 'City 4',
        event: event._id,
      });

      const article = await ArticleModel.create({
        title: `Delete Article ${Date.now()}`,
        author: ['Author'],
        year: '2024',
        first_page: '1',
        last_page: '10',
        edition: edition._id,
      });

      await ArticleModel.findByIdAndDelete(article._id);
      const found = await ArticleModel.findById(article._id);
      expect(found).toBeNull();
    });

    test('ArticleModel should search by title', async () => {
      const event = await EventsModel.create({
        name: `Event ${Date.now()}`,
        sigla: 'E5',
        entity: 'Entity 5',
      });

      const edition = await EditionsModel.create({
        year: '2024',
        place: 'City 5',
        event: event._id,
      });

      const uniqueTitle = `Unique Title ${Date.now()}`;
      const article = await ArticleModel.create({
        title: uniqueTitle,
        author: ['Author'],
        year: '2024',
        first_page: '1',
        last_page: '10',
        edition: edition._id,
      });

      const found = await ArticleModel.findOne({ title: uniqueTitle });
      expect(found).toBeDefined();
      expect(found.title).toBe(uniqueTitle);
    });

    test('ArticleModel should register timestamps', async () => {
      const event = await EventsModel.create({
        name: `Event ${Date.now()}`,
        sigla: 'E6',
        entity: 'Entity 6',
      });

      const edition = await EditionsModel.create({
        year: '2024',
        place: 'City 6',
        event: event._id,
      });

      const article = await ArticleModel.create({
        title: `Timestamp Article ${Date.now()}`,
        author: ['Author'],
        year: '2024',
        first_page: '1',
        last_page: '10',
        edition: edition._id,
      });

      expect(article.createdAt).toBeDefined();
      expect(article.updatedAt).toBeDefined();
    });
  });

  describe('EditionsModel', () => {
    test('EditionsModel should have correct schema', () => {
      expect(EditionsModel.schema.paths.year).toBeDefined();
      expect(EditionsModel.schema.paths.place).toBeDefined();
      expect(EditionsModel.schema.paths.event).toBeDefined();
    });

    test('EditionsModel should create document', async () => {
      const event = await EventsModel.create({
        name: `Event ${Date.now()}`,
        sigla: 'ED',
        entity: 'Entity',
      });

      const edition = await EditionsModel.create({
        year: '2024',
        place: 'New York',
        event: event._id,
      });

      expect(edition._id).toBeDefined();
      expect(edition.year).toBe('2024');
      expect(edition.place).toBe('New York');
    });

    test('EditionsModel should find by ID', async () => {
      const event = await EventsModel.create({
        name: `Event ${Date.now()}`,
        sigla: 'ED2',
        entity: 'Entity 2',
      });

      const edition = await EditionsModel.create({
        year: '2024',
        place: 'Paris',
        event: event._id,
      });

      const found = await EditionsModel.findById(edition._id);
      expect(found).toBeDefined();
      expect(found.place).toBe('Paris');
    });
  });

  describe('EventsModel', () => {
    test('EventsModel should have correct schema', () => {
      expect(EventsModel.schema.paths.name).toBeDefined();
      expect(EventsModel.schema.paths.sigla).toBeDefined();
      expect(EventsModel.schema.paths.entity).toBeDefined();
    });

    test('EventsModel should create document', async () => {
      const event = await EventsModel.create({
        name: `Conference ${Date.now()}`,
        sigla: 'CONF',
        entity: 'Organization',
      });

      expect(event._id).toBeDefined();
      expect(event.name).toBeTruthy();
      expect(event.sigla).toBe('CONF');
    });

    test('EventsModel should find by ID', async () => {
      const event = await EventsModel.create({
        name: `Symposium ${Date.now()}`,
        sigla: 'SYMP',
        entity: 'Institute',
      });

      const found = await EventsModel.findById(event._id);
      expect(found).toBeDefined();
      expect(found.sigla).toBe('SYMP');
    });

    test('EventsModel should register timestamps', async () => {
      const event = await EventsModel.create({
        name: `Workshop ${Date.now()}`,
        sigla: 'WS',
        entity: 'Center',
      });

      expect(event.createdAt).toBeDefined();
      expect(event.updatedAt).toBeDefined();
    });
  });
});
