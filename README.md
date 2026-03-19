# MRT prototypes

Responsive **Material React Table (MRT)** UI experiments: app shell, sidebar, breakpoints, and related docs. Built with **React**, **Vite**, and **MUI**.

---

## Personal Git remote (not work)

This project is meant to live on **your personal GitHub** only.

| Item | Value |
|------|--------|
| **Remote** | `git@github-personal:creecher/mrt-prototypes.git` |
| **HTTPS** | [github.com/creecher/mrt-prototypes](https://github.com/creecher/mrt-prototypes) |

Check before you push:

```bash
git remote -v
# origin  git@github-personal:creecher/mrt-prototypes.git (fetch)
# origin  git@github-personal:creecher/mrt-prototypes.git (push)
```

### See the push target every time

This repo includes a **pre-push hook** that prints the URL Git will push to (so you can cancel if it’s wrong).

One-time setup in this clone:

```bash
git config core.hooksPath .githooks
chmod +x .githooks/pre-push
```

After that, `git push` shows the destination before anything is sent.

### Commits: no signing in this repo

Commit signing is **turned off** for this repository (`commit.gpgsign=false` locally) so company 1Password / SSH signing is not involved. Your global Git settings elsewhere are unchanged.

---

## Requirements

- **Node.js** 18+ (20+ recommended)

---

## Install

```bash
npm install
```

---

## Development

Start the Vite dev server (hot reload):

```bash
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

---

## Other commands

| Command | What it does |
|--------|----------------|
| `npm run dev` | Dev server with HMR |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Serve `dist/` locally (run after `build`) |
| `npm run lint` | ESLint on the project |
| `npm run deploy` | Build + publish `dist/` to GitHub Pages (`gh-pages` branch) |

### Design tokens → MUI palette

After editing `Light-tokens.json`:

```bash
node scripts/convertTokens.cjs
```

Writes `src/theme/palette.js`.

---

## Environment

Copy the example env file if you use features that need an Anthropic key (see app / proxy setup):

```bash
cp .env.example .env
# Edit .env — do not commit real keys
```

`.env` is gitignored.

---

## Docs in the repo

- `MRT_RESPONSIVE_PROTOTYPE_GUIDE.md` — responsive prototype guide  
- `BUILD_PLAN.md` — build plan  
- `mobile-bulk-patterns.md` — mobile bulk patterns  

---

## License

Private project (`private: true` in `package.json`). Adjust as needed.
