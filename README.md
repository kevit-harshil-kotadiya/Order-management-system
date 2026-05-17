# Order Management System

A full-stack food delivery order management system with real-time order tracking.

## Features

- **Menu Display**: Browse food items with images, descriptions, and prices
- **Shopping Cart**: Add items, adjust quantities, and remove items
- **Checkout**: Enter delivery details with form validation
- **Order Tracking**: Real-time order status updates (Order Received → Preparing → Out for Delivery → Delivered)
- **Test-Driven Development**: Comprehensive tests for both backend and frontend

## Tech Stack

### Backend
- Node.js + Express.js
- MongoDB with Mongoose ODM
- Server-Sent Events (SSE) for real-time updates
- Joi for input validation
- Jest + Supertest for testing

### Frontend
- React 18 with Vite
- React Router for navigation
- Vitest + React Testing Library for testing
- Custom SSE hook for real-time updates

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (running locally or cloud instance)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd order-management-system
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

## Running the Application

1. Start MongoDB (if running locally):
```bash
mongod
```

2. Start the backend server:
```bash
cd backend
npm run dev
```
Server runs on `http://localhost:3000`

3. Start the frontend (in a new terminal):
```bash
cd frontend
npm run dev
```
App runs on `http://localhost:5173`

## API Endpoints

### Menu
- `GET /api/menu` - Get all menu items
- `GET /api/menu/:id` - Get single menu item

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order by ID
- `GET /api/orders/:id/status` - Get order status
- `GET /api/orders/:id/events` - SSE endpoint for real-time updates

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Project Structure

```
order-management-system/
├── backend/
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # Express routes
│   │   ├── middleware/     # Validation middleware
│   │   └── server.js       # App entry point
│   └── tests/              # Backend tests
└── frontend/
    ├── src/
    │   ├── components/     # React components
    │   ├── hooks/          # Custom hooks
    │   ├── services/       # API client
    │   └── App.jsx         # Main app
    └── tests/              # Frontend tests
```

## Order Status Flow

Orders automatically progress through these statuses:
1. **Order Received** - Initial status after placing order
2. **Preparing** - Restaurant is preparing the food
3. **Out for Delivery** - Order is on the way
4. **Delivered** - Order has been delivered

Status changes are simulated every 30 seconds for demonstration purposes.
