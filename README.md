# TaskFlow

> Orchestrate your work with unmatched precision. TaskFlow is an ultra-premium, full-stack Next.js application that brings real-time collaboration and distraction-free design to your daily workflow—**built entirely from scratch in under 10 minutes using AI.**

## ✨ Features

- **Real-Time Sync Engine**: Utilizes SWR for seamless, background data synchronization. Every status change is reflected instantly without the overhead of WebSockets.
- **Premium Editorial Design**: A custom, human-centric light theme featuring an Alabaster off-white background, Terracotta accents, and Apple-like frosted glassmorphism.
- **Fluid Animations**: Powered by Framer Motion, featuring staggered reveals, interactive bento grids, and spring-physics-based task state transitions.
- **Secure Authentication**: Built-in credential-based authentication using NextAuth.js and bcrypt password hashing, complete with a glassmorphic user profile dropdown and sign-out functionality.
- **Full-Stack CRUD**: End-to-end task management using Next.js Server Actions and Prisma ORM.
- **Cloud-Native Database**: Powered by [Turso](https://turso.tech/) (LibSQL/SQLite at the edge) for globally distributed, low-latency data access.

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 14+](https://nextjs.org/) (App Router) |
| **Database** | [Turso](https://turso.tech/) (LibSQL / SQLite at the Edge) |
| **ORM** | [Prisma 5](https://www.prisma.io/) with `@prisma/adapter-libsql` |
| **Authentication** | [NextAuth.js](https://next-auth.js.org/) (Credentials Provider) |
| **State & Data Fetching** | [SWR](https://swr.vercel.app/) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Styling** | Vanilla CSS Modules (Zero-dependency bespoke design system) |

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites
- Node.js 18+ installed
- A [Turso](https://turso.tech/) account and database (free tier is sufficient)

### 1. Clone the repository
```bash
git clone https://github.com/kumar-div/TaskFlow.git
cd TaskFlow
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up Turso
If you don't have the Turso CLI, install it and create a database:
```bash
# Install Turso CLI (Linux/macOS)
curl -sSfL https://get.tur.so/install.sh | bash

# Create a new database
turso db create taskflow

# Get your database URL
turso db show taskflow --url

# Generate an auth token
turso db tokens create taskflow
```

### 4. Environment Variables
Create a `.env` file in the root of your project:
```env
# Prisma local fallback (can keep as-is for local dev)
DATABASE_URL="file:./dev.db"

# NextAuth
AUTH_SECRET="your-super-secret-auth-key"

# Turso (replace with your actual values)
TURSO_DATABASE_URL="libsql://your-database-name.turso.io"
TURSO_AUTH_TOKEN="your-turso-auth-token"
```
*(Generate an `AUTH_SECRET` using `openssl rand -base64 32`)*

### 5. Push the schema to Turso
```bash
# Generate the SQL schema
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script | Out-File -Encoding utf8 schema.sql

# Push to Turso (use the helper script)
node --env-file=.env push-turso.mjs
```

### 6. Generate Prisma client
```bash
npx prisma generate
```

### 7. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Architecture

For a deep dive into the data flow, server actions, real-time polling strategy, and design system, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## 🔗 Links

- **Developer**: [Div Kumar](https://github.com/kumar-div/)
- **LinkedIn**: [div-kumar-cse](https://www.linkedin.com/in/div-kumar-cse/)

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
