# DesignCode

An AI-powered platform for learning, evaluating, and mastering UML-based Low-Level Design — like LeetCode, but for system design.

Students draw UML class diagrams, submit them, and receive AI-generated scores and actionable feedback on pattern compliance, SOLID principles, coupling/cohesion, and structural completeness.

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS v4, shadcn/ui
- **UML Editor**: React Flow (`@xyflow/react`)
- **Auth**: NextAuth.js (Google OAuth)
- **Database**: PostgreSQL (Prisma Postgres) with Prisma ORM
- **AI Module**: Separate Python FastAPI service (CrewAI/LangGraph) — not in this repo

## Prerequisites

- [Node.js](https://nodejs.org/) v20+
- [pnpm](https://pnpm.io/) v10+
- A [Prisma Postgres](https://www.prisma.io/postgres) database (or any PostgreSQL instance)
- Google OAuth credentials (for authentication)

## Getting Started

### 1. Clone the repo

```bash
git clone <repo-url>
cd design-code
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"

# NextAuth
AUTH_SECRET="your-random-secret-here"  # Generate with: npx auth secret
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"

# AI Service (optional — needed for evaluation pipeline)
AI_SERVICE_URL="http://localhost:8000"
```

**Getting Google OAuth credentials:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new OAuth 2.0 Client ID
3. Set Authorized redirect URI to `http://localhost:3000/api/auth/callback/google`

### 4. Set up the database

```bash
# Run migrations to create all tables
npx prisma migrate dev

# Generate the Prisma client
npx prisma generate

# Seed the database with LLD problems
pnpm seed
```

### 5. Run the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to sign in with Google.

## Project Structure

```
app/
  (main)/              # Authenticated routes (sidebar layout)
    dashboard/         # Dashboard with stats
    problems/          # Problem listing + detail + editor
    submissions/       # Submission history + results
  api/                 # API routes (auth, submissions)
  sign-in/             # Sign-in page
  generated/prisma/    # Auto-generated Prisma client
components/
  editor/              # UML diagram editor components
  providers/           # Context providers (session)
  ui/                  # shadcn/ui components
lib/
  prisma.ts            # Prisma client singleton
  utils.ts             # Utility functions
  xml-generator.ts     # React Flow → XML export
  ai-service.ts        # HTTP client for AI module
prisma/
  schema.prisma        # Database schema
  seed.ts              # Problem seed data
  migrations/          # SQL migrations
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Create production build |
| `pnpm start` | Start production server |
| `pnpm seed` | Seed database with LLD problems |
| `npx prisma migrate dev` | Run database migrations |
| `npx prisma generate` | Regenerate Prisma client |
| `npx prisma studio` | Open Prisma Studio (DB GUI) |

## Architecture

```
User → Next.js Frontend (UML Editor) → XML Export
                                          ↓
                              Next.js API Routes
                                          ↓
                              Python AI Service (FastAPI)
                              ├─ Agent 1: Pattern Detection
                              ├─ Agent 2: Structural Validator
                              └─ Agent 3: Design Metrics Analyzer
                                          ↓
                              Scores + Feedback → Results Page
```
