# 🌰 Baloot Backend Specification

> **Core Infrastructure for a Scalable E-Commerce Platform & Multi-Faceted Ecosystem**  
> Built with Node.js, Express 5, TypeScript (Strict Mode), Clean Architecture (DDD), PostgreSQL, and Redis.

---

## 📌 1. Project Vision & Architecture Overview

**Baloot Backend** serves as the foundational backend infrastructure for an enterprise e-commerce platform designed to seamlessly integrate into a broader product ecosystem.

The system is architected using **Clean Architecture** and **Domain-Driven Design (DDD)** principles to guarantee high testability, maintenance isolation, and scalability as new domain requirements evolve.

### Architectural Key Highlights

- **Strict Layered Isolation:** Domain business entities and application use cases remain decoupled from HTTP frameworks, database drivers, and third-party SDKs.
- **Defensive Engineering & Type Safety:** Full runtime payload validation with Zod schemas and compile-time guarantees using TypeScript strict mode.
- **Enterprise Security:** Dual-token identity architecture (JWT Access Tokens + PostgreSQL-backed Refresh Tokens) enforcing single active session rules per physical device.
- **Structured Observability:** Integrated centralized logging system using Winston for robust application monitoring and auditing.

---

## 🗺️ 2. Product Engineering Roadmap & Current Status

The backend implementation roadmap is structured into 4 cohesive milestones:

| Milestone       | Domain Module                 | Technical Scope & Core Deliverables                                              | Status                  |
| :-------------- | :---------------------------- | :------------------------------------------------------------------------------- | :---------------------- |
| **Milestone 1** | **Identity & Authentication** | Core Auth Engine, Session Management, Security Policies, Logging & Final Tooling | **In Final Wrap-Up** ⏳ |
| **Milestone 2** | **Digital Wallet & Ledger**   | User Digital Wallets, Financial Transaction Engines & Immutable Audit Ledgers    | _Planned_               |
| **Milestone 3** | **Warehouse & Stock**         | Multi-Warehouse Inventory Allocation, Stock Replenishment & Supply Logistics     | _Planned_               |
| **Milestone 4** | **Orders & Checkout**         | E-Commerce Product Catalog, Shopping Cart Operations & Purchasing Engines        | _Planned_               |

### 📍 Milestone 1 Detailed Progress Checklist

- [x] **Core Architecture Setup:** Clean Architecture / DDD folder structure, dependency container, error hierarchy.
- [x] **Identity & Auth Domain:** User/Admin registration, verification flows, password hashing (bcrypt), login, token rotation, password history tracking.
- [x] **Data Access Layer:** PostgreSQL schema migrations, raw SQL repositories, partial unique indexing for active sessions.
- [x] **Infrastructure & Caching:** Redis transient storage, token revocation/blacklisting, Mailpit/Nodemailer SMTP orchestration.
- [x] **Observability:** Centralized Winston logger integration across application layers.
- [ ] **Unit & Integration Testing:** Test suite implementation for core Use Cases and HTTP endpoints (_In Progress_).
- [ ] **API Documentation:** Interactive OpenAPI 3.0 / Swagger integration (_In Progress_).
- [ ] **Containerization & Deployment:** Dockerfile, `docker-compose.yml` for multi-service stack (_In Progress_).

---

## 📂 3. Codebase Directory Structure

```text
src/
├── api/
│   ├── health/
│   │   ├── health.controller.ts
│   │   └── health.routes.ts
│   └── v1/
│       ├── admin/
│       ├── common/auth/
│       └── user/
├── application/
│   └── auth/
│       ├── dtos/
│       ├── services/
│       ├── usecases/
│       ├── auth.index.ts
│       └── auth.module.ts
├── domains/
│   ├── health/
│   ├── shared/interfaces/
│   └── user/
│       ├── entities/
│       ├── interfaces/
│       ├── repositories/
│       └── services/
├── infrastructure/
│   ├── config/
│   ├── database/
│   │   ├── migrations/
│   │   ├── seeds/
│   │   ├── migrate.ts
│   │   ├── pg.client.ts
│   │   ├── pg.database.client.ts
│   │   └── pg.transaction.manager.ts
│   ├── logger/
│   ├── redis/
│   ├── repositories/
│   └── services/
├── middlewares/
└── shared/
    ├── errors/
    │   └── error-codes/
    ├── interfaces/
    ├── utils/
    ├── validators/auth/
    └── type/

🔐 4. Core Features & Security Specifications (Milestone 1)

Identity & Authentication
○ Dual-role registration and authentication pipeline (Customer / Super Admin).

○ Email verification lifecycle with resend code capability.

○ Stateful JWT Access Tokens paired with database-persisted Refresh Tokens.

○ Automated brute-force lockout: Accounts temporarily locked upon reaching maximum failed login threshold.

Session & Security Policies
○ Device-Aware Session Guards: Enforces unique active refresh tokens per physical device using PostgreSQL Partial Unique Indexes (WHERE revoked_at IS NULL).

○ Historical Password Protection: Stores password hash history to prevent reuse during password updates.

○ Password Reset Pipeline: Secure email-based password reset and profile completion execution.

🛠️ 5. Technology Stack & Key Dependencies

Layer / Role                Technology / Tool           Version / Purpose
----------------------      ----------------------      ------------------------------------------------------
Runtime & Language          Node.js / TypeScript        Node v20+, TS v5.9 (""strict"": true, ES2020 Target)
----------------------      ----------------------      ------------------------------------------------------
HTTP Framework              Express                     v5.2 (Native Promise rejection handling)
----------------------      ----------------------      ------------------------------------------------------
Relational Database         PostgreSQL                  pg v8.16 (Raw SQL queries with connection pooling)
----------------------      ----------------------      ------------------------------------------------------
Distributed Cache           Redis                       v6.1 (Transient token store & caching)
----------------------      ----------------------      ------------------------------------------------------
Validation & Security       Zod / Bcrypt / JWT          Zod v4.4, Bcrypt v6.0, JsonWebToken
----------------------      ----------------------      ------------------------------------------------------
Logging & Scheduler         Winston / Node-Cron         Winston v3.19 for logs, Node-Cron for DB cleanup
----------------------      ----------------------      ------------------------------------------------------

📡 6. Milestone 1 API Endpoint Reference
🔐 Public Auth Routes (/api/v1/auth)

Method      Endpoint                Description                                                 Access / Middleware
------      -----------------       -------------------------------------------------------     -------------------
POST        /login                  Authenticate identity & issue JWT access/refresh tokens     extractorMiddleware
POST        /resendCode             Resend verification code using user identifier              Body Validation
POST        /refresh                Rotate refresh token & issue new JWT access token           extractorMiddleware
POST        /forgetPassword         Request password reset verification code                    Body Validation
POST        /resetPassword          Reset password using valid verification code                Body Validation
POST        /completeProfile        Complete identity profile during initial onboarding         extractorMiddleware

🛡️ Protected Auth Routes (/api/v1/auth)
○ Router-Level Guards: router.use(extractorMiddleware), router.use(AccessCheckerMiddleware)

Method      Endpoint                Description                                                 Access / Middleware
------      -----------------       -------------------------------------------------------     -------------------
POST        /logout                 Revoke active session for the requesting device             Authenticated
POST        /changePassword         Change user password with historical check validation       fullAccessGuardMiddleware

👑 Admin Protected Routes (/api/v1/admin)
○ Router-Level Guards: router.use(extractorMiddleware), router.use(AccessCheckerMiddleware)

Method      Endpoint                Description                                                 Access / Middleware
------      -----------------       -------------------------------------------------------     -------------------
POST        /register               Initiate new administrator registration                     Body Validation
POST        /verifyRegister         Verify admin registration via verification code             Body Validation
POST        /resendCode             Resend admin registration verification code                 Admin Protected

👤 User Routes (/api/v1/user)

Method      Endpoint                Description                                                 Access / Middleware
------      -----------------       -------------------------------------------------------     -------------------
POST        /register               Register a new customer user account                        Body Validation

🛠️ System Health Routes (/api/health)

Method      Endpoint                Description                                                 Access / Middleware
------      -----------------       -------------------------------------------------------     -------------------
GET         /                       Check API, PostgreSQL, and Redis connections status         Public

🚀 7. Getting Started & Execution Commands

Prerequisites
○ Node.js (v20 or higher)

○ PostgreSQL & Redis instances running locally or via Docker

# 1. Install dependencies
$ pnpm install

# 2. Run SQL database migrations & seed initial Super Admin account
$ pnpm setup:db

# 3. Start development server with live watch mode
$ pnpm dev
```
