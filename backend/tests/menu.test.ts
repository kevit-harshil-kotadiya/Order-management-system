import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../src/main';
import MenuItem from '../src/models/menuItemModel.js';

describe('Menu API Tests', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/order-management-test');
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await MenuItem.deleteMany({});
  });

  describe('GET /api/menu', () => {
    it('should return all menu items', async () => {
      // Create unique items for this test
      await MenuItem.create([
        { name: 'AAA Pizza', description: 'Test description', price: 10.99, imageUrl: 'http://test.com/pizza.jpg' },
        { name: 'BBB Burger', description: 'Test burger description', price: 8.99, imageUrl: 'http://test.com/burger.jpg' }
      ]);

      const response = await request(app).get('/api/menu');

      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('price');
      expect(response.body[0]).toHaveProperty('description');
    });

    it('should return menu items sorted by name', async () => {
      await MenuItem.create([
        { name: 'Z Pizza', description: 'Test description', price: 10.99, imageUrl: 'http://test.com/pizza.jpg' },
        { name: 'A Burger', description: 'Test burger description', price: 8.99, imageUrl: 'http://test.com/burger.jpg' }
      ]);

      const response = await request(app).get('/api/menu');

      expect(response.status).toBe(200);
      expect(response.body[0].name).toBe('A Burger');
      expect(response.body[1].name).toBe('Z Pizza');
    });
  });

  describe('GET /api/menu/:id', () => {
    it('should return a single menu item by id', async () => {
      const menuItem = await MenuItem.create({ name: 'Test Pizza', description: 'Test description', price: 10.99, imageUrl: 'http://test.com/pizza.jpg' });

      const response = await request(app).get(`/api/menu/${menuItem._id}`);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Test Pizza');
      expect(response.body.price).toBe(10.99);
    });

    it('should return 404 for non-existent menu item', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app).get(`/api/menu/${fakeId}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });
});
