import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../src/main';
import MenuItem from '../src/models/menuItemModel.js';
import Order from '../src/models/orderModel.js';

describe('Orders API Tests', () => {
  let menuItemId: string;

  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/order-management-test');
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Order.deleteMany({});
    await MenuItem.deleteMany({});

    const menuItem = await MenuItem.create({
      name: 'Test Pizza',
      description: 'Test description',
      price: 10.99,
      imageUrl: 'http://test.com/pizza.jpg'
    });
    menuItemId = menuItem._id.toString();
  });

  describe('POST /api/orders', () => {
    it('should create a new order with valid data', async () => {
      const orderData = {
        customerName: 'John Doe',
        address: '123 Main St, City',
        phone: '123-456-7890',
        items: [
          { menuItem: menuItemId, quantity: 2 }
        ]
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.customerName).toBe('John Doe');
      expect(response.body.status).toBe('Order Received');
      expect(response.body.totalAmount).toBe(21.98);
      expect(response.body.items).toHaveLength(1);
      expect(response.body.items[0].quantity).toBe(2);
    });

    it('should reject order with missing customer name', async () => {
      const orderData = {
        address: '123 Main St, City',
        phone: '123-456-7890',
        items: [
          { menuItem: menuItemId, quantity: 1 }
        ]
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject order with invalid phone format', async () => {
      const orderData = {
        customerName: 'John Doe',
        address: '123 Main St, City',
        phone: 'invalid',
        items: [
          { menuItem: menuItemId, quantity: 1 }
        ]
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject order with empty items array', async () => {
      const orderData = {
        customerName: 'John Doe',
        address: '123 Main St, City',
        phone: '123-456-7890',
        items: []
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject order with quantity less than 1', async () => {
      const orderData = {
        customerName: 'John Doe',
        address: '123 Main St, City',
        phone: '123-456-7890',
        items: [
          { menuItem: menuItemId, quantity: 0 }
        ]
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should calculate total amount correctly', async () => {
      const orderData = {
        customerName: 'John Doe',
        address: '123 Main St, City',
        phone: '123-456-7890',
        items: [
          { menuItem: menuItemId, quantity: 3 }
        ]
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderData);

      expect(response.status).toBe(201);
      expect(response.body.totalAmount).toBe(32.97);
    });
  });

  describe('GET /api/orders/:id', () => {
    it('should get order by id', async () => {
      const orderData = {
        customerName: 'John Doe',
        address: '123 Main St, City',
        phone: '123-456-7890',
        items: [
          { menuItem: menuItemId, quantity: 1 }
        ]
      };

      const createResponse = await request(app)
        .post('/api/orders')
        .send(orderData);

      const orderId = createResponse.body._id;

      const response = await request(app).get(`/api/orders/${orderId}`);

      expect(response.status).toBe(200);
      expect(response.body._id).toBe(orderId);
      expect(response.body.customerName).toBe('John Doe');
    });

    it('should return 404 for non-existent order', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app).get(`/api/orders/${fakeId}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/orders/:id/status', () => {
    it('should get order status', async () => {
      const orderData = {
        customerName: 'John Doe',
        address: '123 Main St, City',
        phone: '123-456-7890',
        items: [
          { menuItem: menuItemId, quantity: 1 }
        ]
      };

      const createResponse = await request(app)
        .post('/api/orders')
        .send(orderData);

      const orderId = createResponse.body._id;

      const response = await request(app).get(`/api/orders/${orderId}/status`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('Order Received');
      expect(response.body).toHaveProperty('createdAt');
    });
  });
});
