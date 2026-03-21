# 🚀 SOD Monorepo Template

Welcome to the SOD Monorepo Template. This repository is set up to support multiple apps in a single workspace while keeping development simple and consistent.

## 🌟 What's Inside?

The monorepo currently contains two applications:

- **`apps/studio`** – A **Sanity Studio** instance used to create and manage content.
- **`apps/web`** – A **Next.js** application that fetches and displays content from Sanity.

In short: **Studio manages the content, Web shows it to users.**

## 🛠️ Getting Started

### 📦 Using pnpm with Corepack

This project uses **pnpm** managed through **Corepack**.

1. Enable Corepack (if it isn’t already enabled):

```bash
corepack enable
```

2. Install dependencies:

```bash
pnpm install
```

### ⚡ Start the Development Server

To start both applications in development mode:

```bash
pnpm dev
```

This runs both the **Sanity Studio** and the **Next.js app** concurrently using **Turbo**.

## 🔑 Environment Variables

Both apps use environment variables for configuration.

Example files are available at:

- `apps/studio/.env.example`
- `apps/web/.env.example`

Copy them to `.env` in their respective directories and fill in the required values.

Additional notes:

- All environment variables must also be added to **`turbo.json`**.
- `apps/studio` variables must use the prefix **`SANITY_STUDIO_`**.
- Client-side variables in `apps/web` must use **`NEXT_PUBLIC_`**.
- Variables without this prefix are **server-only**.

Each app includes an `env.ts` file (using **zod**) to validate environment variables and provide type-safe access via `process.env`.

### 🌍 Where to Get Your Environment Variables

Most environment variables required for this project are related to Sanity.io.

- **Sanity Project ID, Organization ID, Dataset, API Version**:
  These can be found in your Sanity.io project dashboard. After logging in to [Sanity.io](https://www.sanity.io/), navigate to your project settings to retrieve these details.
  - `SANITY_STUDIO_PROJECT_ID` (for `apps/studio`) and `NEXT_PUBLIC_SANITY_PROJECT_ID` (for `apps/web`)
  - `SANITY_STUDIO_ORGANIZATION_ID` (for `apps/studio`) and `NEXT_PUBLIC_SANITY_ORGANIZATION_ID` (for `apps/web`)
  - `SANITY_STUDIO_DATASET` (for `apps/studio`) and `NEXT_PUBLIC_SANITY_DATASET` (for `apps/web`) - typically `production`
  - `SANITY_STUDIO_API_VERSION` (for `apps/studio`) and `NEXT_PUBLIC_SANITY_API_VERSION` (for `apps/web`)

- **`SANITY_STUDIO_APP_ID`**:
  This value is typically generated after deploying your Sanity Studio - you will see a prompt in the console. You can also find it in your [project dashboard](https://www.sanity.io/manage) (Studios section).

- **`NEXT_PUBLIC_SANITY_USE_CDN`**:
  Set to `true` for production environments to use Sanity's CDN for faster content delivery. For development, `false` is often preferred.

- **`NEXT_PUBLIC_SANITY_IMAGE_QUALITY`**:
  A percentage (`0` to `100`) to control the quality of images served from Sanity.

- **`NEXT_PUBLIC_ORIGIN`**:
  The base URL of your web application (e.g., `http://localhost:3000` for local development, or your deployed domain).

- **`DEFAULT_REVALIDATE`**:
  A numeric value representing the default revalidation time in seconds for data fetched by the Next.js app (e.g., `21600` for 6 hours).

- **`SANITY_REVALIDATE_SECRET`**:
  A shared secret key used to secure revalidation requests from Sanity Webhooks to your Next.js application. Generate a strong, random string for this. This should be added to your Sanity project's webhook configuration and as an environment variable in your Next.js deployment.

- **`SANITY_API_READ_TOKEN`**:
  An optional token which allows for live draft preview. To set this, generate a viewer token in your [project dashboard](https://www.sanity.io/manage) (API section).

## 📝 Content Management (Sanity Studio)

Content schemas live in:

```
apps/studio/schemaTypes
```

Examples include:

- `post.ts`
- `author.ts`

These files define the structure and validation rules for your content.

The Studio dashboard structure is configured in:

```
apps/studio/lib/structure.ts
```

## 🔎 Querying Data (GROQ & GROQD)

Content can be fetched from Sanity using:

- **GROQ** – Sanity’s query language for selecting and shaping content.
- **GROQD** – A TypeScript-friendly query builder that helps create type-safe GROQ queries.

## 🧭 Monorepo Navigation & Commands

This monorepo uses [pnpm](https://pnpm.io/) and [TurboRepo](https://turbo.build/) to manage multiple packages efficiently.

### Executing Commands with PNPM

- **`pnpm run <command>`**: Used for running scripts defined in the `package.json` files at the root or within individual apps.
- **`pnpm --filter <package> <command>`**: Runs a command only for the specified workspace package (e.g web or studio).
- **`pnpm exec <command>`**: Executes a command from the `node_modules/.bin` directory.
- **`pnpm dlx <package> [args...]`**: Temporarily downloads and runs a package without installing it as a dependency (like npx).

The commands and packages defined at the root of the monorepo are accessible anywhere within the project.

### TurboRepo for Build Optimization

The `turbo.json` file at the root configures [TurboRepo](https://turbo.build/). This tool optimizes builds by:

- **Caching**: Caching build outputs to avoid re-running tasks on unchanged code.
- **Parallel Execution**: Running tasks in parallel across different packages when dependencies allow.
- **Remote Caching**: Sharing cache artifacts across CI/CD environments.

### Important Commands

Please review `package.json` files for available scripts for testing, linting, formatting, typechecking, building and deploying your app.

To reduce the chance of CI failures after pushing, run `pnpm run ci` locally before creating a commit.

The CI flow also checks dependency licenses against the allowlist in `license-allowlist.json`, so run `pnpm run ci` after adding or updating packages.

Enjoy building. 🚀

## Common issues

### Weird behavior of strings

This might be caused by sanity encoding extra information as invisible whitespace in draft mode, to enable visual editing.

This can be disabled page-wide by removing `stega` in `apps/web/sanity/client.ts` (this will disable visual editing), or locally by running the string through a `stegaClean` function

```ts
import { stegaClean } from "next-sanity";

const cleanTitle = stegaClean(post.title);
if (cleanTitle == "Something") {
  /*code*/
}
```

Only use this feature if you need to compare strings in code, not for display.
