# Baloot Backend

## 1. Project Overview
Baloot is a scalable backend system designed for retail businesses of any size — from a single local shop to multi-branch chain stores and online shops.

The system focuses on **inventory management**, **order processing**, **secure authentication**, and **transaction-safe stock reservation**, making it suitable for real-world production use.

---

## 2. Core Features
- User authentication with **JWT (Access + Refresh Token)**
- Role-based authorization (Admin, User)
- Product and inventory management
- Cart with inventory reservation logic
- Order creation with transactional safety
- Wallet and transaction tracking
- Delivery methods management
- Admin panel capabilities
- Notification system

---

## 3. Authentication & Security
- Access Token (short-lived, e.g. 15 minutes)
- Refresh Token (long-lived, e.g. 7 days)
- Refresh tokens stored in database
- Token revocation on logout and user block
- Password hashing using bcrypt
- Role-based route protection

---

## 4. Order & Inventory Flow
1. User adds product to cart
2. Product availability is checked:
  available = quantity - reserve
3. Reserved quantity increases when added to cart
4. On order confirmation:
- Wallet is charged
- Inventory quantity decreases
- Reserved stock is released
- Cart is cleared
5. All steps run inside a **database transaction**

---

## 5. API Modules
- Auth (Register, Login, Refresh, Logout)
- Products
- Cart
- Orders
- Wallet & Transactions
- Delivery Methods
- Admin Operations
- Notifications

---

## 6. Technology Stack
- Node.js
- Express.js
- PostgreSQL
- JWT (Access & Refresh Tokens)
- bcrypt
- Database Transactions

---

## 7. Project Structure
src/
├─ controllers/
├─ services/
├─ repositories/
├─ routes/
├─ middlewares/
├─ utils/
└─ app.js

---

## 8. Key Design Concepts
- Transaction-safe operations
- Inventory reservation strategy
- Clean separation of concerns
- Scalable and extensible architecture
- Designed with real production scenarios in mind




