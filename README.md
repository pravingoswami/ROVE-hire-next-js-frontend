# ROVE Hire - Internal Recruitment Platform

A full-stack HR recruitment portal for managing job openings, candidate pipelines, magic-link applications, interviews, and automated offer document generation. Built as the ROVE Full-Stack Developer take-home exercise.

| | |
|---|---|
| **Live frontend** | https://glittering-tartufo-9783cb.netlify.app |
| **Live API** | https://rove-hire-node-js-backend.onrender.com |

---

## Requirements Document

This section captures the product intent **before** implementation - the goal, scope, in-scope features, and deliberate exclusions.

### Goal

Build an internal recruitment platform that lets HR staff manage the full hiring lifecycle - from posting jobs and collecting resumes, through candidate self-service applications, interviews, and offer document generation - without requiring candidates to create accounts.

### Scope

**In scope**

- HR authentication (email + password, JWT session)
- Job opening CRUD with open/closed status and a public job board
- Candidate pipeline with enforced status transitions and audit timeline
- PDF resume upload (HR-initiated, max 10 MB)
- Magic-link candidate application flow (14-day expiry, one-time use)
- Interview scheduling with optional Google Meet link generation
- Interview feedback capture (required before offer generation)
- Programmatic PDF generation for offer letters and NDAs
- Document storage and download (Cloudflare R2 in production, local fallback for dev)
- Email notifications for key pipeline events (when SMTP is configured)
- HR dashboard with pipeline analytics and searchable candidate tables
- Seed data: 3 jobs and 5 candidates across all pipeline stages

**Deliberately out of scope (and why)**

| Excluded | Reason |
|----------|--------|
| Multi-role RBAC (recruiter, hiring manager, admin) | Single `hr_admin` role is sufficient for a take-home demo; RBAC adds schema and UI complexity without demonstrating core pipeline logic |
| Candidate login / portal | Assignment specifies magic-link-only access for candidates; a full candidate account system is unnecessary |
| E-signature on offer/NDA | Legal e-sign integrations (DocuSign, etc.) are out of scope for a time-boxed exercise |
| ATS integrations (Greenhouse, Lever) | External HRIS sync is enterprise scope, not the assignment focus |
| Real-time notifications (WebSockets) | Email + dashboard refresh covers the use case; WebSockets add infra complexity |
| Resume parsing / AI screening | PDF storage only; parsing requires ML pipelines beyond assignment scope |
| Automated test suite | Prioritized end-to-end feature delivery; tests are listed as a next step |
| Public job detail API endpoint | Frontend fetches the public job list and filters client-side to save a dedicated endpoint |
| Pagination UI | API supports pagination params; UI shows full filtered lists for demo simplicity |

### Candidate Pipeline

```
applied → form_submitted → interview_scheduled → offer_sent → hired
                                                          ↘ rejected (from most stages)
```

**Business rules**

- `hired` requires at least one generated offer document
- `rejected` requires a reason (minimum 10 characters)
- Offer generation requires a completed interview with feedback
- Closed jobs cannot accept new candidates
- Magic links expire after 14 days and are single-use

## Hosting

The **frontend** is deployed on **Netlify** as a standard Next.js static/SSR application (`next build` → Netlify adapter). The **backend** runs on **Render** as a Node.js web service (`npm run build && npm start`). **MongoDB Atlas** hosts the database, and **Cloudflare R2** stores uploaded resumes and generated PDFs in production.

---

## Tech Stack and Why

### Frontend (`rove-hire-web`)

| Choice | Why |
|--------|-----|
| **Next.js 15 (App Router)** | File-based routing maps cleanly to public (`/jobs`, `/apply/[token]`) and protected (`/dashboard/*`) areas; SSR for the public job board improves first paint |
| **React 19 + TypeScript** | Type safety across API contracts; React 19 is the current stable baseline for Next 15 |
| **Material UI v9** | Rapid, consistent HR dashboard UI without custom design system work; charts via `@mui/x-charts` for pipeline analytics |
| **TanStack React Query v5** | Server-state caching, background refetch, and localStorage persistence for snappy dashboard navigation |
| **react-markdown + remark-gfm** | Job descriptions and previews support markdown without a heavy WYSIWYG editor |

### Backend (`rove-hire-api`)

| Choice | Why |
|--------|-----|
| **Express 5 + TypeScript** | Minimal, well-understood HTTP layer; fast to scaffold routes/controllers/services for a REST API of this size |
| **MongoDB + Mongoose** | Document model fits nested candidate profiles, timeline events, and flexible metadata (offer fields, interview feedback) without heavy joins |
| **JWT + bcrypt** | Stateless HR auth that works across Netlify (frontend) and Render (API) origins; bcrypt for password hashing |
| **Zod** | Runtime request validation with TypeScript inference - lighter than Joi, co-located with route schemas |
| **Cloudflare R2 (S3-compatible)** | Cheap object storage with presigned download URLs; Render's ephemeral filesystem makes local disk unsuitable for production file storage |
| **Multer (in-memory)** | Simple multipart handling for PDF resume uploads with MIME and magic-byte validation |
| **Nodemailer** | SMTP email for magic links and pipeline notifications; console fallback when unconfigured |
| **googleapis** | Optional Google Calendar / Meet integration for interview scheduling |
| **Helmet + express-rate-limit + CORS allowlist** | Basic security hardening on auth and public apply routes |

### Why not alternatives?

- **PostgreSQL** - relational modeling is viable, but MongoDB's document shape matches the nested candidate/timeline data with less migration overhead for a demo
- **Next.js API routes as backend** - separates concerns, allows independent scaling of API on Render, and keeps the assignment's two-repo structure
- **Puppeteer/HTML-to-PDF** - heavier runtime (headless Chrome); programmatic PDFKit is sufficient for boilerplate offer/NDA text at this scale

---

## PDF Generation

### Approach

PDFs are generated **server-side** using [**PDFKit**](https://pdfkit.org/) (`pdfkit` ^0.19.1) in `api/src/services/pdf.service.ts`.

1. Create an in-memory `PDFDocument` with 50px margins
2. Stream chunks into a `Buffer` via a Promise wrapper
3. Two generators:
   - **`generateOfferLetterPdf`** - role, salary, start date, manager, location, boilerplate acceptance text
   - **`generateNdaPdf`** - four-clause NDA boilerplate
4. Upload the resulting buffers to R2 (or local `uploads/` in dev)
5. Create `Document` records and link them to the candidate

**Resume uploads** are separate - HR uploads an existing PDF via Multer; the API validates `%PDF` magic bytes and `application/pdf` MIME type (max 10 MB). No client-side PDF library is used on the frontend; documents are download-only.

### Why PDFKit?

- Pure Node.js - no headless browser or system dependencies
- Fast for simple text layouts (offer letter + NDA are mostly paragraphs)
- Generates directly to a `Buffer` for immediate upload to R2
- Fits a take-home timeline better than setting up Puppeteer, LaTeX, or a template engine

### What would change at scale?

| Current | At scale |
|---------|----------|
| Programmatic text layout | HTML/CSS templates rendered via Puppeteer or a dedicated PDF service (e.g. DocRaptor, Adobe PDF Services) for branded layouts, logos, and signatures |
| Default PDFKit fonts | Embedded custom fonts and letterhead assets |
| Synchronous in-request generation | Background job queue (BullMQ, SQS) so offer generation doesn't block the HTTP response |
| Duplicate offers on re-generate | Versioning, idempotency keys, and "latest offer" semantics |
| No PDF preview | In-browser preview via pdf.js before download |

---

## Package Dependencies

### Frontend (`web/package.json`)

**Runtime**

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | ^15.3.3 | React framework, App Router, SSR |
| `react` / `react-dom` | ^19.1.0 | UI library |
| `@mui/material` | ^9.1.2 | Component library |
| `@mui/icons-material` | ^9.1.1 | Icons |
| `@mui/x-charts` | ^9.7.0 | Dashboard bar/pie charts |
| `@emotion/react` / `@emotion/styled` | ^11.14.x | MUI styling engine |
| `@fontsource/roboto` | ^5.2.10 | Typography |
| `@tanstack/react-query` | ^5.101.2 | Server-state management |
| `@tanstack/react-query-persist-client` | ^5.101.2 | Query cache persistence |
| `@tanstack/query-sync-storage-persister` | ^5.101.2 | localStorage persister |
| `react-markdown` | ^10.1.0 | Render markdown job descriptions |
| `remark-gfm` | ^4.0.1 | GitHub-flavored markdown (tables, strikethrough) |

**Dev**

| Package | Version | Purpose |
|---------|---------|---------|
| `typescript` | ^5.8.3 | Type checking |
| `eslint` / `eslint-config-next` | ^9.27 / ^15.3.3 | Linting |
| `@types/node`, `@types/react`, `@types/react-dom` | - | Type definitions |

**Scripts:** `dev`, `dev:clean` (Windows cache reset), `build`, `start`, `lint`

### Backend (`api/package.json`)

**Runtime**

| Package | Version | Purpose |
|---------|---------|---------|
| `express` | ^5.1.0 | HTTP server |
| `mongoose` | ^9.7.3 | MongoDB ODM |
| `mongodb` | ^7.4.0 | MongoDB driver |
| `bcrypt` | ^6.0.0 | Password hashing |
| `jsonwebtoken` | ^9.0.3 | JWT auth |
| `cookie-parser` | ^1.4.7 | httpOnly session cookie |
| `cors` | ^2.8.5 | Cross-origin requests |
| `dotenv` | ^16.5.0 | Environment variables |
| `zod` | ^4.4.3 | Request validation |
| `multer` | ^2.2.0 | Multipart file upload |
| `pdfkit` | ^0.19.1 | PDF generation |
| `@aws-sdk/client-s3` | ^3.1075.0 | Cloudflare R2 (S3 API) |
| `@aws-sdk/s3-request-presigner` | ^3.1075.0 | Presigned download URLs |
| `nodemailer` | ^9.0.1 | Email notifications |
| `googleapis` | ^173.0.0 | Google Calendar / Meet |
| `helmet` | ^8.2.0 | Security headers |
| `express-rate-limit` | ^8.5.2 | Rate limiting |
| `swagger-jsdoc` / `swagger-ui-express` | ^6.3 / ^5.0 | API documentation at `/api/docs` |

**Dev**

| Package | Version | Purpose |
|---------|---------|---------|
| `typescript` | ^5.8.3 | Compilation |
| `tsx` | ^4.19.4 | TypeScript execution |
| `nodemon` | ^3.1.14 | Dev hot reload |
| `@types/*` | - | Type definitions for all runtime packages |

**Scripts:** `dev`, `build`, `start`, `seed`, `test:r2`, `google:diagnose`, `google:oauth-setup`

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)
- (Optional) Cloudflare R2 bucket for file storage
- (Optional) SMTP credentials for email

### Frontend

```bash
cd web
npm install
cp .env.local.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:4000 for local API
npm run dev
# → http://localhost:3000
```

On Windows, if Next.js cache issues occur: `npm run dev:clean`

### Backend

```bash
cd api
npm install
# Create .env with at least MONGODB_URI, JWT_SECRET
npm run dev
# → http://localhost:4000
npm run seed   # Load demo jobs and candidates
```

**Default HR login:** `hr@rovehire.demo` / `RoveHire2026!`

**API docs:** http://localhost:4000/api/docs

### Environment Variables

**Frontend (`.env.local`)**

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |

**Backend (`.env`)**

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Prod | JWT signing secret (has weak dev default) |
| `FRONTEND_URL` | No | CORS origin (default `http://localhost:3000`) |
| `R2_*` | Prod | Cloudflare R2 credentials for file storage |
| `SMTP_*` | No | Email delivery (logs to console if unset) |
| `GOOGLE_*` | No | Google Calendar / Meet integration |

---

## Project Structure

```
ROVE Hire/
├── web/                          # Next.js frontend (this repo)
│   ├── src/
│   │   ├── app/                  # App Router pages
│   │   │   ├── jobs/             # Public job board
│   │   │   ├── apply/[token]/    # Magic-link application
│   │   │   ├── login/            # HR login
│   │   │   └── dashboard/        # Protected HR area
│   │   ├── components/           # UI components (MUI, charts, tables)
│   │   ├── hooks/                # useAuth, useQueries
│   │   └── lib/                  # API client, types, theme
│   └── scripts/clean-next.mjs    # Windows dev cache cleaner
│
└── api/                          # Express backend
    └── src/
        ├── routes/               # Route definitions
        ├── controllers/          # Request handlers
        ├── services/             # PDF, storage, email, Google, tokens
        ├── models/               # Mongoose schemas (7 collections)
        ├── middleware/           # Auth, validation, upload, errors
        ├── validators/           # Zod schemas
        └── seed/                 # Demo data seeder
```

---

## API Overview

| Area | Key Endpoints |
|------|---------------|
| Public | `GET /health`, `GET /jobs/public`, `GET\|POST /apply/:token` |
| Auth | `POST /auth/login`, `POST /auth/logout`, `GET /auth/me` |
| Jobs | `GET\|POST /jobs`, `GET\|PATCH\|DELETE /jobs/:id` |
| Candidates | `GET\|POST /candidates`, `GET /candidates/:id`, `PATCH /candidates/:id/status`, `GET /candidates/:id/magic-link` |
| Interviews | `GET /interviews`, `POST /candidates/:id/interviews`, `PATCH /interviews/:id/complete` |
| Documents | `POST /candidates/:id/documents/generate`, `GET /documents/:id/download` |
| Dashboard | `GET /dashboard` |
| Integrations | `GET /integrations/google-meet` |

All responses use `{ success: true, data }` or `{ success: false, error: { message, code? } }`.

---

## What I Would Do Next (Two More Days)

**Day 1 - Quality and polish**

- Add Playwright E2E tests for the critical path: login → add candidate → magic link apply → schedule interview → generate offer → mark hired
- Unify the UI - migrate remaining legacy CSS pages (candidate detail, job edit, apply form) to MUI components
- Add pagination controls on candidate/job tables
- Copy-to-clipboard UX for magic links instead of inline alerts
- Complete Swagger coverage for all endpoints

**Day 2 - Production hardening**

- Email queue with retry (BullMQ + Redis) instead of fire-and-forget Nodemailer
- Offer document versioning and prevent duplicate generation
- PDF templates with company branding (HTML → Puppeteer or a template service)
- Multi-HR user support with proper RBAC
- CI/CD pipeline (GitHub Actions: lint, build, deploy)
- Remove hardcoded demo credentials from the login form
- Add `.env.example` to the API repo

**Cut for time**

- Automated tests (unit and E2E)
- Consistent MUI styling across all pages
- Pagination UI
- Email delivery reliability (queue/retry)
- Public single-job API endpoint
- In-browser PDF preview
- Google Meet calendar event cancellation on interview reschedule

---

## Known Issues - Not Production Ready

| Area | Issue | Why it's not production-ready |
|------|-------|-------------------------------|
| **Security** | Default JWT secret (`rove-hire-dev-secret`) and auto-seeded HR credentials logged to console | Must use strong secrets and provisioned users in production |
| **PDF quality** | Plain text boilerplate with default fonts, no legal review | Real offers need branded templates, legal sign-off, and e-signature |
| **File storage** | Local `uploads/` fallback on ephemeral Render disk | Files are lost on redeploy without R2 configured |
| **Email** | Silently logs to console when SMTP is missing; no retry queue | Candidates won't receive magic links or offer notifications |
| **Auth token** | JWT stored in `localStorage` on frontend | Vulnerable to XSS; httpOnly cookie-only auth is safer |
| **Google Meet** | Complex dual auth paths; Meet API fallback doesn't tie to scheduled calendar time; cancel on reschedule not implemented | Interview links may be inconsistent |
| **Document download** | R2 returns JSON with presigned URL; local returns raw file stream | Inconsistent API response shape for the frontend |
| **Offer re-generation** | Can generate duplicate offer/NDA pairs when status is already `offer_sent` | Needs versioning or idempotency |
| **Rejection UX** | Browser `prompt()` for rejection reason | Poor UX; should be a proper modal with validation |
| **Swagger** | Partial endpoint coverage | Incomplete API documentation for consumers |
| **Tests** | Zero automated tests | No regression safety net |
| **TLS flag** | `MONGODB_TLS_ALLOW_INVALID` also disables TLS verification for R2 S3 client | Misconfiguration risk in production |

---

## License

Private - ROVE Hire take-home exercise submission.
