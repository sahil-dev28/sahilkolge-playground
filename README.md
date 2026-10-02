# Sahil Kolge · Playable Portfolio (Option G)

A React portfolio where every project has a small live demo of the hardest problem solved in it.
It uses a single grape colour theme with dark and light mode, and the mode choice is saved in localStorage.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Files

```
src/main.jsx              React entry
src/Portfolio.jsx         root: mode, visits and played state, composes the sections
src/data.js               projects, skills, certificates, contact, "care" items
src/lib/storage.js        safe localStorage helper and initial dark/light mode
src/components/           Nav, Hero, Playground, ProjectSection, Care, Skills, Certs, Contact, icons
src/demos/                one file per live demo (OrgDemo, PaginationDemo, HnDemo, UrbanDemo, AxiosDemo)
src/portfolio.css         all styles, theme tokens are CSS variables at the top
```

## Common edits

- Projects, skills, certificates, contact: `src/data.js`
- Add a project: add an entry to `PROJECTS` in `data.js`, create its demo in `src/demos/`,
  and register it in the `DEMOS` map in `components/Playground.jsx`
- Accent colours: `--al`, `--ad` and `--mark` at the top of `portfolio.css`
- Default mode for first time visitors: `initialMode()` in `lib/storage.js`

## Using it in Next.js

Copy `src/` into your app, add `"use client";` as the first line of `Portfolio.jsx` (everything
it imports becomes client code too), and import the CSS from `app/layout.jsx` (or keep the import,
Next allows global CSS imported from client components in the app router).

## Deploy

```bash
npm run build
```

Push to GitHub and import the repo on Vercel. Framework preset: Vite.
