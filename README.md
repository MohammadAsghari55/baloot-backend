# 🌰 Baloot Backend Specification

> **Core Infrastructure for a Scalable E-Commerce Platform & Multi-Faceted Ecosystem**
> Built with Node.js, Express 5, TypeScript (Strict Mode), Clean Architecture (DDD), PostgreSQL, and Redis.

---

## 📌 1. Project Vision & Architecture Overview

**Baloot Backend** serves as the foundational backend infrastructure for an e-commerce platform designed to seamlessly integrate into a broader, multi-faceted product ecosystem.

The system is architected using **Clean Architecture** and **Domain-Driven Design (DDD)** principles to guarantee high testability, maintenance isolation, and scalability as new domain requirements evolve.

### Architectural Key Highlights

- **Strict Layered Isolation:** Domain business entities and application use cases remain decoupled from HTTP frameworks, database drivers, and third-party SDKs.
- **Defensive Engineering & Type Safety:** Full runtime payload validation with Zod schemas and compile-time guarantees using TypeScript strict mode.
- **Enterprise Security:** Dual-token identity architecture (JWT Access Tokens + PostgreSQL-backed Refresh Tokens) enforcing single active session rules per physical device.

---

## 🗺️ 2. Product Engineering Roadmap (4 Core Milestones)

The backend implementation roadmap is structured into 4 cohesive milestones:

| Milestone       | Domain Module                 | Responsibilities & Technical Scope                                                    | Status          |
| :-------------- | :---------------------------- | :------------------------------------------------------------------------------------ | :-------------- |
| **Milestone 1** | **Identity & Authentication** | Core User/Admin Auth, Session Management Guards, Security Policies & Clean Arch Setup | **In Progress** |
| **Milestone 2** | **Digital Wallet & Ledger**   | User Digital Wallets, Financial Transaction Engines & Immutable Audit Ledgers         | _Planned_       |
| **Milestone 3** | **Warehouse & Stock**         | Multi-Warehouse Inventory Allocation, Stock Replenishment & Supply Logistics          | _Planned_       |
| **Milestone 4** | **Orders & Checkout**         | E-Commerce Product Catalog, Shopping Cart Operations & Purchasing Engines             | _Planned_       |

---

## 📂 3. Codebase Directory Structure

The repository enforces modular separation of concerns across standard Clean Architecture layers:

```text
src/
├── application/         # Core Use Cases, Orchestration & Interfaces
│   ├── dto/             # Data Transfer Objects & Schema Validations
│   ├── usecases/        # Business Logic & Workflow Orchestration
│   └── interfaces/      # Service Contracts & Repository Interfaces
├── domain/              # Pure Domain Entities & Business Rules
│   ├── entities/        # Core Models (User, RefreshToken, Session)
│   └── errors/          # Enterprise Domain Error Hierarchy
├── infrastructure/      # Technical Frameworks & Driver Implementations
│   ├── database/        # PostgreSQL Connection Pool, Migrations & Seeds
│   ├── redis/           # Distributed Cache & Transient Stores
│   ├── mail/            # SMTP Dispatcher & Email Verification Logic
│   └── repositories/    # Concrete Repository Implementations (pg)
└── presentation/        # HTTP Adapters, Controllers & Routes
    ├── controllers/     # HTTP Request Encoders & Response Decoders
    ├── middlewares/     # Authentication Guards, Zod Validation, Error Handlers
    └── routes/          # Express API Route Declarations
```

---

## 🔐 4. Core Features & Security Specifications (Milestone 1)

### Identity & Authentication

- Dual-role registration and authentication pipeline (**Customer** / **Super Admin**).
- Statetul JWT Access Tokens paired with database-persisted Refresh Tokens.
- Automated brute-force lockout: Accounts temporarily locked upon reaching maximum failed login threshold.

### Session & Security Policies

- **Device-Aware Session Guards:** Enforces unique active refresh tokens per physical device using PostgreSQL Partial Unique Indexes (`WHERE revoked_at IS NULL`).
- **Historical Password Protection:** Stores password hash history to prevent reuse during password updates.
- **Email Verification Lifecycle:** Asynchronous token generation and expiration policies backed by background mail dispatchers.

---

## 🛠️ 5. Technology Stack & Key Dependencies

| Layer / Role              | Technology / Tool    | Version / Purpose                                    |
| :------------------------ | :------------------- | :--------------------------------------------------- |
| **Runtime & Language**    | Node.js / TypeScript | Node v20+, TS v5.9 (`"strict": true`, ES2020 Target) |
| **HTTP Framework**        | Express              | v5.2 (Native Promise rejection handling)             |
| **Relational Database**   | PostgreSQL           | `pg` v8.16 (Raw SQL queries with connection pooling) |
| **Distributed Cache**     | Redis                | v6.1 (Transient token store & caching)               |
| **Validation & Security** | Zod / Bcrypt / JWT   | Zod v4.4, Bcrypt v6.0, JsonWebToken                  |
| **Process Management**    | Node-Cron / PNPM     | Node-Cron v4.6 for scheduled DB cleanup tasks        |

---

## 🚀 6. Getting Started & Execution Commands

### Prerequisites

- Node.js (v20 or higher)
- PostgreSQL & Redis instances running locally or via Docker

```bash
# 1. Install dependencies
$ pnpm install

# 2. Run SQL database migrations & seed initial Super Admin account
$ pnpm setup:db

# 3. Start development server with live watch mode
$ pnpm dev
```

---

## 📡 7. Milestone 1 API Endpoint Reference

| Method | Endpoint                       | Description                                                | Access Level  |
| :----- | :----------------------------- | :--------------------------------------------------------- | :------------ |
| `POST` | `/api/v1/auth/register`        | Register a new user account                                | Public        |
| `POST` | `/api/v1/auth/login`           | Authenticate identity and return JWT access/refresh tokens | Public        |
| `POST` | `/api/v1/auth/refresh`         | Rotate refresh token & issue new JWT access token          | Refresh Token |
| `POST` | `/api/v1/auth/logout`          | Revoke active session for the requesting device            | Authenticated |
| `POST` | `/api/v1/auth/change-password` | Update password with historical check validation           | Authenticated |
| `GET`  | `/api/v1/users/me`             | Retrieve authenticated identity profile details            | Authenticated |
| `GET`  | `/health`                      | Check API, PostgreSQL, and Redis status                    | Public        |
