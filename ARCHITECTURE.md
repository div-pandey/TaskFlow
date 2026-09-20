# TaskFlow Architecture

This document outlines the architectural decisions, patterns, and technologies used in **TaskFlow**, a premium task management application built entirely in under 10 minutes using AI.

---

## 1. High-Level Architecture

TaskFlow uses the **Next.js App Router** paradigm, enforcing a strict separation between server-side computation and client-side interactivity.

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser (Client)                     │
│  React Components · Framer Motion · SWR · NextAuth Session  │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP / RSC Payload
┌────────────────────────▼────────────────────────────────────┐
│                   Next.js (App Router)                      │
│     Server Components · Server Actions · API Routes         │
└────────────────────────┬────────────────────────────────────┘
                         │ Prisma Client (LibSQL adapter)
┌────────────────────────▼────────────────────────────────────┐
│             Turso (LibSQL / SQLite at the Edge)              │
│       Globally distributed · Low-latency · HTTP API          │
└─────────────────────────────────────────────────────────────┘
```

- **Server Components (RSC)**: Used for layout rendering, static pages (`/about`, `/terms`, `/privacy`), and initial data hydration.
- **Client Components**: Used exclusively where interactivity is required (e.g., `Dashboard` for SWR polling, `HeroSection` for Framer Motion animations).
- **Server Actions**: All database mutations (Create, Update, Delete) are handled via Next.js Server Actions, eliminating traditional REST API routes and reducing client bundle sizes.

---

## 2. Database Layer (Turso + Prisma)

### Why Turso?
TaskFlow uses **Turso** — a cloud-native, globally distributed database built on LibSQL (a fork of SQLite). Turso provides:
- **Edge-ready**: Queries are served from the nearest edge node, reducing latency globally.
- **SQLite syntax**: No migration from SQLite schema needed; queries are 100% compatible.
- **HTTP API**: Works serverlessly in Next.js without persistent database connections.

### Prisma Integration
Prisma 5's `driverAdapters` preview feature enables using LibSQL as the underlying query driver:

```typescript
// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client"
import { createClient } from "@libsql/client"
import { PrismaLibSQL } from "@prisma/adapter-libsql"

const libsql = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
})

const adapter = new PrismaLibSQL(libsql)
export const prisma = new PrismaClient({ adapter })
```

> **Note**: `@prisma/adapter-libsql@5.22.0` and `@libsql/client@0.8.0` are pinned to maintain Prisma 5 compatibility. The newer versions use a factory pattern only available in Prisma 6+.

### Schema Overview
```prisma
model User {
  id       String  @id @default(cuid())
  email    String? @unique
  password String?
  tasks    Task[]
  // ... NextAuth relations (Account, Session)
}

model Task {
  id        String   @id @default(cuid())
  title     String
  status    String   @default("TODO") // TODO | IN_PROGRESS | DONE
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### Schema Migration to Turso
Since Turso doesn't support `prisma migrate deploy` directly, we use a helper script that generates SQL and executes each statement individually via the LibSQL HTTP client:

```bash
# 1. Generate SQL diff
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script | Out-File -Encoding utf8 schema.sql

# 2. Push SQL to Turso
node --env-file=.env push-turso.mjs
```

---

## 3. Authentication Flow

We use **NextAuth.js** with the **Credentials Provider**.

```
Register → Hash password (bcryptjs) → Store User in Turso
Login    → Fetch User from Turso → Compare hash → Issue JWT Session Cookie
Dashboard → useSession() client guard + getServerSession() server guard
```

1. **Registration**: Server Action hashes the password with `bcryptjs` and writes to Turso via Prisma.
2. **Login**: `signIn("credentials")` validates the bcrypt hash and generates an encrypted session JWT.
3. **Session Management**: The Navbar displays an interactive user avatar dropdown displaying the user's initials, name, email, and a secure sign-out button using NextAuth's `signOut()`.
4. **Route Protection**: Client routes use `useSession()`. Server Actions use `getServerSession()` to prevent unauthorized mutations.

---

## 4. Real-Time Sync Strategy (SWR Polling)

Rather than adding WebSocket infrastructure (Socket.io, Ably, etc.), TaskFlow uses **SWR polling** for a clean "real-time" feel:

```typescript
// Every 3 seconds, silently re-fetches tasks from the database
const { data: tasks, mutate } = useSWR("/api/tasks", fetcher, {
  refreshInterval: 3000,
})
```

- **Optimistic UI**: When a user creates or updates a task, `mutate()` fires instantly to update the local UI before the server confirms.
- **Background Revalidation**: SWR continuously revalidates in the background, keeping multiple browser tabs in sync.

---

## 5. UI/UX & Design System

The app uses a **zero-dependency bespoke design system** in Vanilla CSS Modules — no Tailwind, no component library.

### Color Palette (Earthy Editorial Theme)
| Token | Value | Usage |
|---|---|---|
| `--bg-base` | `#F9F8F6` | Page background (Alabaster) |
| `--bg-surface` | `#FFFFFF` | Cards, panels |
| `--accent-primary` | `#D35400` | CTAs, highlights (Terracotta) |
| `--text-primary` | `#1A1917` | Main text |
| `--text-secondary` | `#57534E` | Supporting text |
| `--border-subtle` | `#E8E3DC` | Borders |

### Motion System
**Framer Motion** handles all physics-based animations:
- **Hero Section**: Staggered `spring` reveals on mount.
- **Bento Grid**: Hover `scale` + `y` transforms with custom easing.
- **Navbar & Avatar**: Slide-in on initial render with cubic bezier `[0.22, 1, 0.36, 1]`. The user profile dropdown uses a smooth scale and fade transition via `AnimatePresence`.
- **Task Cards**: Layout-animated transitions when tasks change status.

### Glassmorphism
Premium frosted glass panels use:
```css
backdrop-filter: blur(16px) saturate(180%);
background: rgba(255, 255, 255, 0.72);
border: 1px solid rgba(255, 255, 255, 0.5);
```

---

## 6. Directory Structure

```
D:\task-management-app\
├── prisma/
│   └── schema.prisma          # Prisma schema (SQLite/LibSQL)
├── schema.sql                 # Generated SQL for Turso migrations
├── push-turso.mjs             # Helper script to push schema to Turso
├── src/
│   ├── app/
│   │   ├── about/             # Static About page
│   │   ├── terms/             # Static Terms & Conditions page
│   │   ├── privacy/           # Static Privacy Policy page
│   │   ├── actions/
│   │   │   ├── auth.ts        # Register / login Server Actions
│   │   │   └── tasks.ts       # CRUD task Server Actions
│   │   ├── dashboard/         # Protected task board (Client Component)
│   │   ├── login/             # Auth UI
│   │   ├── register/          # Registration UI
│   │   ├── globals.css        # Design tokens & global styles
│   │   ├── icon.png           # App favicon (auto-served by Next.js)
│   │   ├── layout.tsx         # Root layout with Navbar, Footer, AuthProvider
│   │   └── page.tsx           # Animated landing page
│   ├── components/
│   │   ├── Landing/
│   │   │   ├── HeroSection.tsx        # Animated hero with Framer Motion
│   │   │   ├── FeatureBentoGrid.tsx   # Premium bento feature grid
│   │   │   ├── InteractiveDemo.tsx    # Animated mock task board
│   │   │   └── Landing.module.css     # Landing page styles
│   │   ├── Footer.tsx          # Global footer with social links
│   │   ├── Footer.module.css
│   │   ├── Navbar.tsx          # Glassmorphism sticky navbar
│   │   └── Navbar.module.css
│   ├── context/
│   │   └── AuthContext.tsx     # NextAuth SessionProvider wrapper
│   └── lib/
│       └── prisma.ts           # Turso-backed singleton Prisma client
└── README.md
```

---

## 7. Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | Local SQLite fallback (for Prisma schema introspection) |
| `AUTH_SECRET` | NextAuth JWT signing secret |
| `TURSO_DATABASE_URL` | Turso database URL (`libsql://...`) |
| `TURSO_AUTH_TOKEN` | Turso authentication token |
