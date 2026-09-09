# Invoicer — AI Invoicing & Financial Billing Management Platform

A modern, production-ready Full-Stack AI Billing and Financial Analytics Platform engineered with **NestJS**, **TypeORM**, **PostgreSQL**, **Redis**, **Next.js 15 (App Router)**, **React 19**, and **Google Gemini AI**.

---

## Key Highlights

- **Enterprise Backend (NestJS + TypeORM + PostgreSQL)**: Clean modular architecture with dependency injection, JWT authentication, cookie sessions, validation pipes, and transactional repository patterns.
- **High-Performance Caching (Redis)**: Redis caching for dashboard metrics, analytics aggregations, and session management.
- **Autonomous Financial AI Copilot (ReAct Agent)**: Interactive financial assistant capable of querying invoices, analyzing client debts, checking cash flows, and generating draft notes via function-calling tool loops (`Cmd+J` / `Ctrl+J`).
- **AI-Powered Workflows**:
  - Receipt OCR parsing (`POST /api/ai/scan-receipt`) using Gemini multimodal vision.
  - Plain-English financial summaries (`POST /api/ai/summary`).
  - Adaptive payment reminder email drafts with tone selection (Friendly, Firm, Final Notice).
- **Next.js 15 App Router Frontend**:
  - Modern typography and bespoke design tokens with Dark and Light mode.
  - shadcn/ui and Radix primitives (Dialog, Sheet, Tabs, Dropdown, Table, Toaster).
  - High-resolution data visualizations powered by Recharts.
  - Zero external bloat: fast, fluid client transitions and native print layouts.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 15 (App Router), React 19, Tailwind CSS, shadcn/ui, Radix UI Primitives, Lucide Icons, Recharts |
| **Backend** | NestJS 11, TypeORM 0.3, Express 5, Passport JWT, bcryptjs, Class Validator |
| **Database** | PostgreSQL 16+ |
| **Cache / Queue** | Redis (ioredis 5.6) |
| **Artificial Intelligence** | Google Gemini AI (`@google/genai` 0.2) |

---

## Architecture Overview

```
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/          # JWT authentication, guards, cookies
│   │   │   ├── clients/       # Client management & relations
│   │   │   ├── invoices/      # Sequential numbering, items, tax calculations
│   │   │   ├── payments/      # Payment ledger & invoice reconciliation
│   │   │   ├── expenses/      # Expense tracking & categories
│   │   │   ├── analytics/     # SQL aggregations & cached dashboard metrics
│   │   │   └── ai/            # Gemini OCR, Copilot Agent & prompts
│   │   ├── database/
│   │   │   ├── entities/      # TypeORM relational models
│   │   │   └── seeds/         # Production seed script
│   │   └── common/            # Redis service, filters, middleware
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/               # Next.js 15 App Router (Dashboard, Invoices, Clients, etc.)
│   │   ├── components/        # shadcn/ui, Layout (Sidebar, Topbar, CopilotSheet)
│   │   ├── hooks/             # TanStack Query data-fetching hooks
│   │   └── lib/               # Utility functions & formatting
│   └── package.json
```

---

## Quick Start

### 1. Prerequisites
- Node.js 20+
- PostgreSQL running locally or on cloud (Neon, Supabase, etc.)
- Redis running on `127.0.0.1:6379` (or Memurai / Docker Redis)

### 2. Backend Setup
```bash
cd backend
npm install
npm run seed     # Seeds demo user & 5 clients/invoices
npm run start:dev
```
API runs on `http://localhost:8000/api`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Web app runs on `http://localhost:3000`.

### 4. Demo Login
- Click **"1-Click Demo Fill"** on `/login` or enter:
  - **Email**: `alex@invoicer.ai`
  - **Password**: `password123`

---

## License
MIT License. Built for portfolio demonstration.
