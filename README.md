# FoundryVTT Module Template

A modern FoundryVTT module template with Svelte, TypeScript, and Vite.

## Quick Start

1. **Clone (or use "Use this template" on GitHub)**

2. **Run the init script with your module ID**
   ```bash
   chmod +x init.sh && ./init.sh foundryvtt-my-module "Short description"
   ```
   Use your desired module id (e.g. `foundryvtt-my-module`) and an optional description. The script replaces all placeholders and updates the README. If you omit arguments, it infers the module id from the repository name and optionally fetches the description from the GitHub API.

3. **Install and run**
   ```bash
   bun install
   bun run dev
   ```

**One-liner (after cloning):**
```bash
git clone <template-repo-url> foundryvtt-my-module && cd foundryvtt-my-module && ./init.sh foundryvtt-my-module "My description" && bun install && bun run dev
```

## Alternative: setup.sh

If you prefer the legacy setup that infers everything from the repo name and GitHub:

```bash
chmod +x setup.sh && ./setup.sh
```

`setup.sh` removes itself after running. `init.sh` is kept so you can re-run or use it in automation.

## Manual Setup

Replace placeholders manually: `<MODULE_ID>`, `<MODULE_TITLE>`, `<MODULE_DESCRIPTION>`, `<MODULE_LOG_PREFIX>`, `<MODULE_CODE>` in `*.json`, `*.mjs`, `*.ts`, `*.js`, `*.svelte` (see `init.sh` for the exact list). Update author and GitHub URLs in `module.json` and `package.json`.

## Features

- Vite for fast development and building
- Svelte for reactive UI components
- TypeScript for type safety
- ESLint and Prettier for code quality
- Hot Module Replacement (HMR) for CSS and JS
- Optional `src/hooks/init.js` pattern to keep `index.js` thin and add more hooks in one place
- Generic `release.js` for version bump, build, tag, and GitHub release (draft/pre supported)

## Development

- `bun run dev` – Start dev server with HMR (blanks `dist/style.css` for CSS HMR)
- `bun run build` – Production build
- `bun run eslint` – Lint
- `bun run release` / `release:patch` / `release:minor` / `release:major` – Bump and release (requires `gh` CLI)
- `bun run release:draft` / `release:pre` – Draft or pre-release

## Module cleanup

If your module registers event listeners or global state, clean them up in `disableModule` or `unloadModule` so the world can be reloaded or the module disabled without leaving handlers attached. See the commented hooks in `src/index.js`.

## Template Variables

Replaced by `init.sh` or `setup.sh`:

- `MODULE_ID` – Module identifier (e.g. `foundryvtt-my-module`)
- `MODULE_TITLE` – Human-readable title
- `MODULE_DESCRIPTION` – Short description
- `MODULE_LOG_PREFIX` – Short log prefix (e.g. from title initials)
- `MODULE_CODE` – Short code (e.g. first 3 alphanumeric chars of `MODULE_ID`)
