# Order Management System - Implementation Plan

## Project Overview
Build a full-stack food delivery order management system with React frontend and Node.js backend.

## Architecture Decisions
- **Frontend**: React + Vite (faster than Next.js for this SPA use case)
- **Backend**: Node.js + Express.js
- **Database**: SQLite with better-sqlite3 (simple, file-based, sufficient for demo)
- **Real-time**: Server-Sent Events (SSE) for order status updates
- **Testing**: Jest + Supertest (backend), Vitest + React Testing Library (frontend)

## Project Structure
```
order-management-system/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # SQLite database setup
│   │   ├── controllers/
│   │   │   ├── menuController.js    # Menu item CRUD
│   │   │   └── orderController.js   # Order operations
│   │   ├── routes/
│   │   │   ├── menu.js              # Menu endpoints
│   │   │   └── orders.js            # Order endpoints
│   │   ├── services/
│   │   │   └── orderService.js      # Business logic + SSE
│   │   ├── models/
│   │   │   ├── MenuItem.js          # Menu item schema
│   │   │   └── Order.js             # Order schema
│   │   ├── middleware/
│   │   │   └── validation.js        # Input validation
│   │   ├── utils/
│   │   │   └── statusSimulator.js   # Simulate order status changes
│   │   └── server.js                # Express app entry point
│   ├── tests/
│   │   ├── menu.test.js
│   │   └── orders.test.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── MenuList.jsx         # Display menu items
│   │   │   ├── MenuItem.jsx         # Single menu item card
│   │   │   ├── Cart.jsx             # Shopping cart
│   │   │   ├── CheckoutForm.jsx     # Delivery details form
│   │   │   ├── OrderStatus.jsx      # Track order status
│   │   │   └── Layout.jsx           # App layout
│   │   ├── services/
│   │   │   └── api.js               # API client
│   │   ├── hooks/
│   │   │   └── useOrderStatus.js    # SSE hook for real-time updates
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tests/
│   │   ├── MenuList.test.jsx
│   │   ├── Cart.test.jsx
│   │   └── CheckoutForm.test.jsx
│   └── package.json
└── README.md
```

## API Endpoints

### Menu Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/menu` | Get all menu items |
| GET | `/api/menu/:id` | Get single menu item |

### Order Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Create new order |
| GET | `/api/orders/:id` | Get order by ID |
| GET | `/api/orders/:id/status` | Get current order status |
| GET | `/api/orders/:id/events` | SSE endpoint for status updates |

## Database Schema

### menu_items
```sql
CREATE TABLE menu_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT
);
```

### orders
```sql
CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  status TEXT DEFAULT 'Order Received',
  total_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### order_items
```sql
CREATE TABLE order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  menu_item_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);
```

## Implementation Steps

### Phase 1: Backend Foundation
1. Initialize backend project with Express
2. Setup SQLite database with schema
3. Create menu seed data (pizza, burgers, drinks, etc.)
4. Implement menu endpoints
5. Write menu API tests

### Phase 2: Order Management
1. Implement order creation endpoint
2. Add input validation middleware
3. Create order status endpoints
4. Implement SSE for real-time updates
5. Add status simulator (auto-transition statuses)
6. Write order API tests

### Phase 3: Frontend Foundation
1. Initialize React + Vite project
2. Setup routing (react-router)
3. Create layout components
4. Implement MenuList and MenuItem components
5. Write frontend component tests

### Phase 4: Cart & Checkout
1. Implement cart state management
2. Create Cart component
3. Build CheckoutForm with validation
4. Integrate with backend API
5. Write cart & checkout tests

### Phase 5: Order Tracking
1. Create OrderStatus component
2. Implement SSE hook for real-time updates
3. Add status visualization (progress bar/steps)
4. Write order tracking tests

### Phase 6: Polish & Integration
1. Add error handling and loading states
2. Style the UI (CSS modules or Tailwind)
3. Add responsive design
4. End-to-end testing
5. Documentation

## Status Flow
```
Order Received → Preparing → Out for Delivery → Delivered
```

## Testing Coverage
- **Backend**: CRUD operations, input validation, status updates, SSE
- **Frontend**: Component rendering, user interactions, form validation, API integration

## Notes
- Images will use placeholder URLs (Lorem Picsum or similar)
- Phone validation: simple regex for demo
- Real-time updates: SSE clients auto-reconnect on disconnect
