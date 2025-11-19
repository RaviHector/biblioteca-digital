import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { ObjectId } from '../../src/config/mongo.js';
import { InternalServerError } from '../../src/errors/baseErrors.js';

describe('MongoDB ObjectId and Utils', () => {
  let mongoServer;

  beforeAll(async () => {
    // Setup test MongoDB
    mongoServer = await MongoMemoryServer.create();
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

  describe('ObjectId export', () => {
    test('should export mongoose ObjectId', () => {
      expect(ObjectId).toBeDefined();
    });

    test('should be able to create ObjectId instances', () => {
      const id = new ObjectId();
      expect(id).toBeDefined();
      expect(typeof id.toString()).toBe('string');
    });

    test('should be able to validate ObjectId strings', () => {
      const testId = '507f1f77bcf86cd799439011';
      const isValid = ObjectId.isValid(testId);
      expect(isValid).toBe(true);
    });

    test('should reject invalid ObjectId strings', () => {
      const invalidId = 'not-an-objectid';
      const isValid = ObjectId.isValid(invalidId);
      expect(isValid).toBe(false);
    });

    test('should create ObjectId from valid string', () => {
      const testId = '507f1f77bcf86cd799439011';
      const objectId = new ObjectId(testId);
      expect(objectId.toString()).toBe(testId);
    });

    test('should generate unique ObjectIds', () => {
      const id1 = new ObjectId();
      const id2 = new ObjectId();
      expect(id1.toString()).not.toBe(id2.toString());
    });

    test('should preserve ObjectId equality', () => {
      const testId = '507f1f77bcf86cd799439011';
      const objectId1 = new ObjectId(testId);
      const objectId2 = new ObjectId(testId);
      expect(objectId1.equals(objectId2)).toBe(true);
    });

    test('should handle ObjectId in object comparisons', () => {
      const id = new ObjectId();
      const obj = { _id: id };
      expect(obj._id.equals(id)).toBe(true);
    });

    test('should convert ObjectId to string', () => {
      const testId = '507f1f77bcf86cd799439011';
      const objectId = new ObjectId(testId);
      const stringId = objectId.toString();
      expect(stringId).toBe(testId);
      expect(typeof stringId).toBe('string');
    });

    test('should handle ObjectId in array operations', () => {
      const id1 = new ObjectId();
      const id2 = new ObjectId();
      const ids = [id1, id2];
      expect(ids).toHaveLength(2);
      expect(ids[0].equals(id1)).toBe(true);
    });
  });

  describe('Mongoose configuration', () => {
    test('should have Promise set to global Promise', () => {
      expect(mongoose.Promise).toBe(global.Promise);
    });

    test('should support strictQuery setting', () => {
      mongoose.set('strictQuery', true);
      const setting = mongoose.get('strictQuery');
      expect(setting).toBe(true);
    });

    test('should support schema creation', () => {
      const testSchema = new mongoose.Schema({
        name: String,
        email: String,
      });
      expect(testSchema).toBeDefined();
      expect(testSchema.paths.name).toBeDefined();
    });

    test('should support model compilation', () => {
      const testSchema = new mongoose.Schema({
        title: String,
      });
      
      const modelName = `TestModel_${Date.now()}`;
      const TestModel = mongoose.model(modelName, testSchema);
      expect(TestModel).toBeDefined();
      expect(TestModel.modelName).toBe(modelName);
    });

    test('should support property setting and getting', () => {
      mongoose.set('strictQuery', true);
      expect(mongoose.get('strictQuery')).toBe(true);

      mongoose.set('strictQuery', false);
      expect(mongoose.get('strictQuery')).toBe(false);
    });
  });

  describe('URI encoding and special characters', () => {
    test('should encode special characters in URIs', () => {
      const testUri = 
        'mongodb+srv://' +
        `${encodeURIComponent('user@domain.com')}:` +
        `${encodeURIComponent('p@ss!word')}@` +
        `${encodeURIComponent('cluster.mongodb.net')}/` +
        `${encodeURIComponent('testdb')}?` +
        `${encodeURIComponent('retryWrites=true')}`;
      
      expect(testUri).toContain('%40');
      expect(testUri).toBeDefined();
    });

    test('should handle empty options string', () => {
      const testUri = 
        'mongodb+srv://' +
        `${encodeURI('user')}:` +
        `${encodeURI('pass')}@` +
        `${encodeURI('server')}/` +
        `${encodeURI('db')}?` +
        `${encodeURI('')}`;
      
      expect(testUri).toBeDefined();
      expect(typeof testUri).toBe('string');
    });

    test('should construct proper MongoDB connection string', () => {
      const user = 'testuser';
      const pass = 'testpass';
      const server = 'cluster.mongodb.net';
      const db = 'testdb';
      const opts = 'retryWrites=true&w=majority';
      
      const uri = 
        'mongodb+srv://' +
        `${encodeURI(user)}:` +
        `${encodeURI(pass)}@` +
        `${encodeURI(server)}/` +
        `${encodeURI(db)}?` +
        `${encodeURI(opts)}`;
      
      expect(uri).toContain('mongodb+srv://');
      expect(uri).toContain(user);
      expect(uri).toContain(server);
      expect(uri).toContain(db);
    });

    test('should handle slashes in password', () => {
      const password = 'p@ss/word:special';
      const encoded = encodeURIComponent(password);
      expect(encoded).toBeDefined();
      expect(typeof encoded).toBe('string');
      expect(encoded).toContain('%40');
    });

    test('should handle hyphens in server name', () => {
      const server = 'my-cluster-0.mongodb.net';
      const encoded = encodeURI(server);
      expect(encoded).toBe(server);
    });

    test('should handle dots in domain', () => {
      const server = 'cluster0.mongodb.net';
      const encoded = encodeURI(server);
      expect(encoded).toBe(server);
    });

    test('should handle multiple special characters', () => {
      const password = 'p@ss!w#rd$%&*()';
      const encoded = encodeURIComponent(password);
      expect(encoded).toContain('%40');
      expect(encoded).toBeDefined();
    });
  });

  describe('Error handling', () => {
    test('should create InternalServerError with correct HTTP code', () => {
      const error = new InternalServerError('Test error');
      expect(error).toBeInstanceOf(InternalServerError);
      expect(error.httpCode).toBe(500);
    });

    test('should preserve error message in InternalServerError', () => {
      const message = 'MongoDB connection failed';
      const error = new InternalServerError(message);
      expect(error.message).toContain(message);
    });

    test('should mark InternalServerError as operational', () => {
      const error = new InternalServerError('Test error');
      expect(error.isOperational).toBe(true);
    });

    test('should properly construct error for MongoDB failures', () => {
      const originalError = 'connection timeout';
      const error = new InternalServerError(
        `Failed to connect to mongoDB. Error: ${originalError}.`
      );

      expect(error.message).toContain('Failed to connect to mongoDB');
      expect(error.message).toContain('connection timeout');
      expect(error.httpCode).toBe(500);
    });

    test('should create distinct error instances', () => {
      const error1 = new InternalServerError('Error 1');
      const error2 = new InternalServerError('Error 2');

      expect(error1).not.toBe(error2);
      expect(error1.message).not.toBe(error2.message);
    });
  });

  describe('Connection state management', () => {
    test('should track mongoose connection states', () => {
      const currentState = mongoose.connection.readyState;
      expect([0, 1, 2, 3]).toContain(currentState);
    });

    test('should allow state checking before operations', () => {
      const readyState = mongoose.connection.readyState;
      expect(typeof readyState).toBe('number');
    });
  });

  describe('MongoDB connection string building', () => {
    test('should build URI with all environment variables', () => {
      const user = 'testuser';
      const pass = 'testpass';
      const server = 'cluster.mongodb.net';
      const db = 'testdb';
      const options = 'retryWrites=true&w=majority';

      const uri = 
        'mongodb+srv://' +
        `${encodeURI(user)}:` +
        `${encodeURI(pass)}@` +
        `${encodeURI(server)}/` +
        `${encodeURI(db)}?` +
        `${encodeURI(options)}`;

      expect(uri.startsWith('mongodb+srv://')).toBe(true);
      expect(uri).toContain('@');
      expect(uri).toContain('?');
    });

    test('should handle different database names', () => {
      const dbNames = ['testdb', 'production', 'staging', 'dev'];
      
      dbNames.forEach(db => {
        const uri = `mongodb+srv://user:pass@server/${encodeURI(db)}`;
        expect(uri).toContain(db);
      });
    });

    test('should handle various option combinations', () => {
      const optionSets = [
        'retryWrites=true&w=majority',
        'retryWrites=true&w=majority&maxPoolSize=10',
        'directConnection=true',
        '',
      ];

      optionSets.forEach(opts => {
        const encoded = encodeURI(opts);
        expect(typeof encoded).toBe('string');
      });
    });
  });
});
