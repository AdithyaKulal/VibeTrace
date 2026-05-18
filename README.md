# VibeTrace — Fast playgrounds & dev workflows

VibeTrace is a developer playground and collaboration platform built with Next.js, Prisma (MongoDB), and NextAuth. Create, save, and share code playgrounds, use built-in auth (GitHub/Google), and interact with chat/code-completion AIs for an enhanced developer experience.

## Features

- **Playground management**: create and save project playgrounds and template files.
- **Authentication**: GitHub & Google login via `next-auth` with Prisma adapter.
* **🤖 Integrated AI Assistant:** Leverage a powerful, local **AI assistant** built to handle complex developer queries. 
  * **Interactive Chat:** Ask engineering questions directly from the workspace sidebar.
  * **Code Completion:** Get inline smart code completions and predictive context blocks as you write.
  * **💻 Immersive Editor & Terminal:** High-performance Monaco Editor engine coupled with `xterm.js` integrations for live sandboxed code editing and terminal output previews.
- **AI endpoints**: server endpoints for chat and code completion (pluggable to external AI providers).
- **Editor & terminal**: Monaco editor and xterm integrations for live editing and previews.
- **Prisma + MongoDB**: schema-driven data models for users, playgrounds, and chat messages.
- **Component library**: shadcn-style UI components and Tailwind CSS for rapid UI development.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19, Tailwind CSS, shadcn components
- **Auth:** next-auth (GitHub, Google) + @auth/prisma-adapter
- **Database / ORM:** MongoDB with Prisma (prisma + @prisma/client)
- **Language:** TypeScript
- **Editor / Tools:** Monaco editor, xterm, Zustand

### Key package scripts (from `package.json`)

- `dev` — Runs local development server: `cross-env TURBOPACK=0 next dev`
- `build` — `next build`
- `start` — `next start`
- `lint` — `eslint`

## Getting Started (local development)

Follow these steps to run the project locally.

### Prerequisites

- Node.js 18+ (Node 20 recommended)
- npm, yarn or pnpm
- A MongoDB instance (Atlas or local) and a connection string

### 1) Clone the repository

```bash
git clone https://github.com/AdithyaKulal/VibeTrace.git
cd VibeTrace
```

### 2) Install dependencies

Install project dependencies (choose your package manager). Run this from the project root.

Using npm:

```bash
npm install
```

Using yarn:

```bash
yarn install
```

Using pnpm:

```bash
pnpm install
```

Optional / helpful global tools (recommended for developer workflows):

- Install `pnpm` (optional but recommended):

```bash
npm install -g pnpm
```

- Ensure Node version management (nvm) or `nvm-windows` is available for switching Node versions:

Linux / macOS (nvm):

```bash
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash
nvm install 20
nvm use 20
```

Windows (nvm-windows): follow https://github.com/coreybutler/nvm-windows

- (Optional) Install Prisma CLI globally if you prefer:

```bash
npm install -g prisma
```

Common post-install steps (run once):

```bash
# generate Prisma client
npx prisma generate

# (MongoDB) push schema to your database
npx prisma db push --preview-feature
```

Troubleshooting:

- If you see Node version errors, confirm `node -v` is >= 18.
- If `pnpm` commands fail, try `npm install` instead.
- For Windows devs, run commands in an elevated terminal when global installs fail.

### 3) Environment variables

Create a `.env` at the project root (this repo contains an example `.env` — do NOT commit secrets). Example required keys:

```env
# Database
DATABASE_URL=

# Authentication / next-auth
AUTH_SECRET=
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=

# Optional: NEXTAUTH_URL (if running behind a proxy or deployed)
NEXTAUTH_URL=http://localhost:3000
```

Notes:
- The project uses `AUTH_SECRET` in server code for NextAuth (see `auth.ts`). Some deployments or libraries expect `NEXTAUTH_SECRET`; if needed, set both.
- Do NOT commit real secret values to the repository.

### 4) Prisma / Database setup

This project uses Prisma with a MongoDB datasource (see `prisma/schema.prisma`). For MongoDB use Prisma's `db push` to sync schema.

Run:

```bash
# install prisma CLI if not present
npx prisma generate

# push the schema to your MongoDB (no SQL migrations for MongoDB)
npx prisma db push --preview-feature
```

If you need to inspect the schema or generate the client later:

```bash
npx prisma studio
```

### 5) Start any required local services

- This project expects a running MongoDB (Atlas connection or local). No additional local AI or service daemons are required by default.
- If you wire external AI providers, ensure you set provider API keys in environment variables and run their local services as directed.

### 6) Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open http://localhost:3000 in your browser.

## Project structure (high level)

Top-level layout (trimmed):

```
app/                     # Next.js App Router pages + api routes
	(auth)/                # Auth-related app routes
	api/                   # Route handlers (auth, chat, code-completion, template)
components/              # UI building blocks and shadcn components
hooks/                   # React hooks (e.g., use-mobile)
lib/                     # Utilities: db.ts, template.ts, utils.ts
modules/                 # Feature modules (auth, playground, dashboard, ai-chat, etc.)
prisma/                  # Prisma schema (MongoDB datasource)
public/                  # Static assets
vibecode-starters/       # Starter templates and examples
package.json             # Project metadata & scripts
README.md                # This file
```

Short descriptions:

- `app/` — Next.js routes, layouts and API route handlers (App Router).
- `components/` — Reusable UI components (shadcn/Tailwind based).
- `modules/` — Domain features: `auth`, `playground`, `dashboard`, `playground` actions and UI.
- `lib/` — Shared utilities and database client (`lib/db.ts` uses Prisma).
- `prisma/schema.prisma` — Prisma models and MongoDB datasource.

## Contributing

Thanks for considering contributing! Quick steps:

1. Fork the repository and create a feature branch.
2. Run the app and add tests where appropriate.
3. Open a pull request describing your change and why it helps.

- Follow the existing code style (TypeScript + shadcn patterns).
- Keep changes focused and well-documented.

## License

This project is released under the MIT License. See [LICENSE](LICENSE) for details.

---

If you'd like, I can also:

- add a `CONTRIBUTING.md` template
- create a `.env.example` file with the keys above
- add GitHub Actions for CI (lint/build)

Let me know which of these you'd like next.

##🤝 Contributing-
   We value open-source contributions. To streamline the collaboration pipeline:

Fork the VibeTrace repository.

Branch your updates cleanly (git checkout -b feature/MyEpicFeature).

Maintain styling consistency (TypeScript structure + explicit Tailwind tokens).

Commit changes concisely (git commit -m 'feat: introduce dynamic workspace terminal context').

Push changes and submit a formal Pull Request.