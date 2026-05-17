# Order Management System

A full-stack food delivery order management system with real-time order tracking.

## Features

- **Menu Display**: Browse food items with images, descriptions, and prices
- **Shopping Cart**: Add items, adjust quantities, and remove items
- **Checkout**: Enter delivery details with form validation
- **Order Tracking**: Real-time order status updates using Socket.IO (Order Received → Preparing → Out for Delivery → Delivered)
- **Test-Driven Development**: Comprehensive tests for both backend and frontend
- **WebSocket Events**: Live order status broadcasting to connected clients

## Tech Stack

### Backend
- Node.js + Express.js
- MongoDB with Mongoose ODM
- Socket.IO for real-time WebSocket communication
- Express-validator for input validation
- Jest + Supertest for testing

### Frontend
- React 18 with Vite
- React Router for navigation
- Vitest + React Testing Library for testing
- Socket.IO-client for real-time order updates

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

## Socket.IO Events

### Client → Server Events
| Event | Payload | Description |
|-------|---------|-------------|
| `join-order` | `orderId: string` | Join a room to receive updates for a specific order |
| `leave-order` | `orderId: string` | Leave the order room |

### Server → Client Events
| Event | Payload | Description |
|-------|---------|-------------|
| `order-status-updated` | `{ orderId, status, timestamp }` | Emitted when an order's status changes |

### Usage Example (Frontend)
```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

// Join to receive updates for an order
socket.emit('join-order', orderId);

// Listen for status updates
socket.on('order-status-updated', (data) => {
  console.log(`Order ${data.orderId} is now ${data.status}`);
});

// Cleanup
socket.emit('leave-order', orderId);
```

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
│   │   ├── config/         # Database & Socket.IO configuration
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # Express routes
│   │   ├── middleware/     # Validation middleware
│   │   └── main.ts         # App entry point
│   └── tests/              # Backend tests
└── frontend/
    ├── src/
    │   ├── components/     # React components
    │   ├── hooks/          # Custom hooks (useSocket)
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

## Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/order-management

# Frontend URL (for Socket.IO CORS)
FRONTEND_URL=http://localhost:5173
```

For production deployment (e.g., AWS EC2), update:
- `MONGODB_URI` - Use MongoDB Atlas or your production database
- `FRONTEND_URL` - Your deployed frontend URL
