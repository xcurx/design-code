# DesignCode — Frontend & Backend Build Plan

> **"LeetCode for Low-Level Design"** — An AI-powered platform where students practice UML class diagram design, submit solutions, and receive instant AI-generated evaluation with scores and actionable feedback.

**Stack**: Next.js 16, React 19, Prisma/PostgreSQL, shadcn/ui, React Flow  
**AI Module**: Separate Python FastAPI service (CrewAI/LangGraph) — built by other team members  
**Scope**: This plan covers the full frontend + backend. The multi-agent AI module is out of scope.

---

## Phase 1: Foundation (Database + UI Shell)

### Step 1 — Extend Prisma Schema

Expand `prisma/schema.prisma` with all required models:

- **User** (extend existing): add `role` field (STUDENT/INSTRUCTOR enum), add relations to submissions
- **Problem**: title, description (markdown), difficulty (EASY/MEDIUM/HARD enum), tags[], requirements (JSON — expected classes, relationships, patterns), sampleDiagramXml, createdAt, updatedAt
- **Submission**: userId, problemId, diagramXml (the XML payload), status (PENDING/EVALUATING/COMPLETED/FAILED enum), createdAt
- **Evaluation**: submissionId (1-to-1), overallScore (0-100), structuralScore, patternScore, principlesScore, couplingCohesionScore, strengths/violations/suggestions (JSON arrays), rawAgentOutput (JSON), createdAt

**Relations**: User 1→N Submission, Problem 1→N Submission, Submission 1→1 Evaluation

**Bug fix**: `auth.ts` is missing `await` on `prisma.user.upsert()` — fix this.

### Step 2 — Install shadcn/ui + React Flow

- Initialize shadcn/ui: `npx shadcn@latest init`
- Install core shadcn components: button, card, badge, dialog, tabs, separator, skeleton, toast, dropdown-menu, avatar, scroll-area
- Install React Flow: `@xyflow/react`
- Install markdown rendering: `react-markdown`

### Step 3 — App Shell & Navigation

- Create `app/(main)/layout.tsx` — authenticated layout with sidebar navigation
  - **Sidebar**: Dashboard, Problems, Submissions, Profile
  - **Top bar**: user avatar, sign-out button
- Wrap in `SessionProvider` for client-side auth access
- Update `proxy.ts` matcher to protect all `/(main)/*` routes
- Redirect `/` to `/dashboard`
- Update root layout metadata (title: "DesignCode", proper description)

### Step 4 — Dashboard Page

**Route**: `app/(main)/dashboard/page.tsx`

- Stats cards: total submissions, average score, problems attempted
- Recent submissions list (last 5) with score and status
- Quick links to browse problems

---

## Phase 2: Problem Listing & Detail

### Step 5 — Seed Script for Problems

_Depends on: Step 1_

- Create `prisma/seed.ts` with 5–8 classic LLD problems:
  - Parking Lot System
  - Library Management System
  - Elevator System
  - Snake & Ladder Game
  - Online Bookstore
  - Hotel Reservation System
  - ATM Machine
  - Chess Game
- Each problem includes: title, description (markdown), difficulty, tags, and **requirements JSON** (expected classes, relationships, design patterns)
- Add seed command to `package.json`

### Step 6 — Problems List Page

**Route**: `app/(main)/problems/page.tsx` — _Depends on: Step 5_

- Server component fetching all problems from DB
- Card grid layout: title, difficulty badge (color-coded: green/yellow/red), tags, short description
- Filter by difficulty, search by name
- Click navigates to problem detail

### Step 7 — Problem Detail Page

**Route**: `app/(main)/problems/[id]/page.tsx` — _Depends on: Step 6_

- **Left panel**: problem description (rendered markdown), requirements section listing expected classes/relationships/patterns
- **Right panel / tab**: "Start Solving" button → navigates to editor
- Show user's past submissions for this problem (if any) with scores

---

## Phase 3: UML Class Diagram Editor (Core Feature)

### Step 8 — UML Class Node Component

**File**: `components/editor/ClassNode.tsx` — _Can be built in parallel with Steps 5–7_

- Custom React Flow node shaped as a UML class box with 3 compartments:
  1. **Class Name** (supports `<<interface>>` / `<<abstract>>` stereotypes)
  2. **Attributes** — each with visibility (+/-/#/~), name, type
  3. **Methods** — each with visibility, name, return type, parameters
- Editable inline: click to add/edit/delete attributes and methods
- Resize handles, configurable colors

### Step 9 — UML Relationship Edges

**File**: `components/editor/RelationshipEdge.tsx`

5 custom edge types matching UML notation:

| Type        | Line Style | Arrow/Marker    |
| ----------- | ---------- | --------------- |
| Inheritance | Solid      | Hollow triangle |
| Association | Solid      | Open arrow      |
| Aggregation | Solid      | Hollow diamond  |
| Composition | Solid      | Filled diamond  |
| Dependency  | Dashed     | Open arrow      |

- Each edge supports **multiplicity labels** (1, _, 0..1, 1.._)
- User selects relationship type from toolbar, then draws from source to target node

### Step 10 — Editor Page & Toolbar

**Route**: `app/(main)/problems/[id]/solve/page.tsx`

- **Toolbar** (`components/editor/EditorToolbar.tsx`):
  - Add Class, Add Interface buttons
  - Relationship type selector (dropdown with visual icons)
  - Undo / Redo
  - Zoom controls
  - Preview XML button
  - Submit button
- **Canvas** (`components/editor/EditorCanvas.tsx`):
  - React Flow canvas with custom nodes + edges
  - Minimap in corner
  - Snap to grid
- **Left sidebar**: list of classes in diagram (clickable to focus)

### Step 11 — XML Generation (Deterministic Export)

**File**: `lib/xml-generator.ts`

Converts React Flow nodes + edges state into deterministic XML:

```xml
<diagram>
  <classes>
    <class name="OrderService" type="class">
      <attributes>
        <attribute visibility="+" name="orders" type="List&lt;Order&gt;" />
      </attributes>
      <methods>
        <method visibility="+" name="placeOrder" returnType="void" params="order: Order" />
      </methods>
    </class>
  </classes>
  <relationships>
    <relationship type="composition" source="OrderService" target="Order"
                  sourceMultiplicity="1" targetMultiplicity="*" />
  </relationships>
</diagram>
```

- "Preview XML" button shows generated XML in a dialog
- This XML is the **contract payload** sent to the AI module

---

## Phase 4: Submission Pipeline & AI Integration

### Step 12 — Submission API Routes

_Depends on: Steps 1, 11_

| Route                                        | Method | Description                                                                                       |
| -------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------- |
| `app/api/submissions/route.ts`               | POST   | Create submission (accept `{ problemId, diagramXml }`, validate auth, create with status PENDING) |
| `app/api/submissions/route.ts`               | GET    | List user's submissions (paginated)                                                               |
| `app/api/submissions/[id]/route.ts`          | GET    | Get single submission + evaluation                                                                |
| `app/api/submissions/[id]/evaluate/route.ts` | POST   | Trigger AI evaluation                                                                             |

### Step 13 — AI Service Client

**File**: `lib/ai-service.ts` — _Depends on: Step 12_

HTTP client calling the Python FastAPI backend:

```
AI_SERVICE_URL=http://localhost:8000  (env var)
```

**Contract for AI team** (the integration interface):

**Request** — `POST /evaluate`:

```json
{
  "problemId": "clxyz...",
  "diagramXml": "<diagram>...</diagram>",
  "requirements": {
    "expectedClasses": ["Order", "OrderService", "Payment"],
    "expectedRelationships": [
      { "type": "composition", "source": "OrderService", "target": "Order" }
    ],
    "expectedPatterns": ["Factory", "Observer"]
  }
}
```

**Response**:

```json
{
  "overallScore": 82,
  "structuralScore": 90,
  "patternScore": 75,
  "principlesScore": 80,
  "couplingCohesionScore": 85,
  "strengths": [
    "Correct use of Factory pattern for Order creation",
    "Clean separation between Service and Repository layers"
  ],
  "violations": [
    "Missing Observer pattern for notification system",
    "OrderService has too many responsibilities (God class risk)"
  ],
  "suggestions": [
    "Extract notification logic into a separate NotificationService",
    "Add an interface for the Payment strategy to follow OCP"
  ]
}
```

### Step 14 — Async Evaluation with Polling

_Depends on: Steps 12, 13_

Flow:

1. User clicks "Submit" → `POST /api/submissions` → returns submission ID (status: PENDING)
2. Frontend calls `POST /api/submissions/[id]/evaluate` → triggers AI call (status: EVALUATING)
3. Frontend **polls** `GET /api/submissions/[id]` every 2–3 seconds
4. When AI responds: store Evaluation record, update status to COMPLETED (or FAILED on error)
5. Frontend detects COMPLETED → redirect to results page

> **Why polling over WebSocket?** Simpler for MVP. AI evaluation takes ~10–30s. If it consistently exceeds 30s, upgrade to Server-Sent Events (SSE) later.

---

## Phase 5: Results & Feedback Display

### Step 15 — Results Page

**Route**: `app/(main)/submissions/[id]/page.tsx` — _Depends on: Step 14_

- **Score Gauge**: Large circular radial gauge showing overall score (0–100)
  - Color: red (<40), yellow (40–70), green (>70)
- **Score Breakdown**: 4 sub-score cards with progress bars:
  - Structural Completeness
  - Pattern Compliance
  - SOLID Principles Adherence
  - Coupling & Cohesion

### Step 16 — Feedback Panels

_Parallel with: Step 15_

Three categorized sections:

- **Strengths** (green cards with 👍): Correct pattern usage, clean architecture decisions
- **Violations** (red cards with 🚫): Structural errors, coupling issues, missing components
- **Suggestions** (blue cards with 🔧): Actionable refactoring recommendations

### Step 17 — Submission History Page

**Route**: `app/(main)/submissions/page.tsx`

- Table with columns: Problem name, Score (color-coded), Status badge, Submitted date
- Click row → navigate to results page
- Filter by problem, sort by date/score

---

## Phase 6: Polish & Testing

### Step 18 — Loading States & Error Handling

- Skeleton loaders for all data-fetching pages
- Toast notifications for submission success/failure
- Error boundaries for the editor page
- Empty states ("No submissions yet", "No problems found")

### Step 19 — Mock AI Service

**File**: `lib/ai-service.mock.ts`

- Returns realistic hardcoded evaluation responses
- Simulates 3–5 second delay
- Allows full end-to-end development/testing without the Python AI backend running
- Toggle via env var: `USE_MOCK_AI=true`

### Step 20 — Responsive Design & Final Polish

- Desktop-first, tablet-friendly for all pages
- Editor page: **desktop only** (show "Use desktop for the editor" message on mobile)
- Dark mode support via shadcn/ui theme toggle

---

## File Reference

### Existing Files to Modify

| File                   | Changes                                              |
| ---------------------- | ---------------------------------------------------- |
| `prisma/schema.prisma` | Add Problem, Submission, Evaluation models + enums   |
| `auth.ts`              | Fix missing `await` on upsert, add DB user ID to JWT |
| `proxy.ts`             | Extend matcher for `/(main)/*` routes                |
| `app/layout.tsx`       | Update metadata, add SessionProvider                 |
| `app/page.tsx`         | Redirect to /dashboard                               |
| `package.json`         | Add shadcn/ui, @xyflow/react, react-markdown deps    |

### New Files to Create

| File                                         | Purpose                                                  |
| -------------------------------------------- | -------------------------------------------------------- |
| `app/(main)/layout.tsx`                      | Authenticated shell with sidebar navigation              |
| `app/(main)/dashboard/page.tsx`              | Dashboard with stats and recent activity                 |
| `app/(main)/problems/page.tsx`               | Problem listing with filters                             |
| `app/(main)/problems/[id]/page.tsx`          | Problem detail with description + requirements           |
| `app/(main)/problems/[id]/solve/page.tsx`    | UML editor page                                          |
| `app/(main)/submissions/page.tsx`            | Submission history table                                 |
| `app/(main)/submissions/[id]/page.tsx`       | Results page with scores + feedback                      |
| `components/editor/ClassNode.tsx`            | Custom UML class React Flow node                         |
| `components/editor/RelationshipEdge.tsx`     | Custom UML relationship edges (5 types)                  |
| `components/editor/EditorToolbar.tsx`        | Editor toolbar component                                 |
| `components/editor/EditorCanvas.tsx`         | React Flow canvas wrapper                                |
| `components/ui/score-gauge.tsx`              | Circular score visualization                             |
| `lib/xml-generator.ts`                       | React Flow state → XML export                            |
| `lib/ai-service.ts`                          | HTTP client for AI module                                |
| `lib/ai-service.mock.ts`                     | Mock AI responses for dev/testing                        |
| `app/api/submissions/route.ts`               | Submission list + create API                             |
| `app/api/submissions/[id]/route.ts`          | Single submission API                                    |
| `app/api/submissions/[id]/evaluate/route.ts` | Trigger evaluation API                                   |
| `app/api/problems/route.ts`                  | Problems listing API (optional, using server components) |
| `prisma/seed.ts`                             | Seed data for LLD problems                               |

---

## Verification Checklist

- [ ] `npx prisma migrate dev` succeeds — all models created
- [ ] Sign in with Google → redirected to dashboard → user in DB with role
- [ ] `/problems` shows seeded problems with difficulty badges
- [ ] Editor loads React Flow canvas, can add class nodes, draw relationship edges
- [ ] "Preview XML" produces valid XML matching the contract schema
- [ ] Submit → DB record created → status transitions PENDING → EVALUATING → COMPLETED
- [ ] With mock AI, results page shows score gauge + feedback panels
- [ ] `/submissions` shows history table with correct data
- [ ] AI team can independently build FastAPI using the documented request/response contract

---

## Notes

- **Editor auto-save**: Save diagram drafts to `localStorage` so users don't lose work on accidental navigation. DB draft persistence is a future enhancement.
- **XML schema versioning**: The XML format is the critical contract between frontend and AI module. Version it (`v1`) and share with the AI team.
- **Deferred features**: Admin panel, discussion forums, Redis caching, real-time collaboration — all deferred to later phases.
