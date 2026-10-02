# Sahil Kolge · Playground

A React + TypeScript portfolio built with Tailwind CSS and shadcn/ui, where every project has a small
live demo of the hardest problem solved in it. It uses a grape colour theme with dark and light mode,
and the mode choice is saved in localStorage.

## Tech

React · TypeScript · Vite · Tailwind CSS v4 · shadcn/ui (Base UI) · lucide-react

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Files

```
src/main.tsx               React entry, imports index.css
src/index.css              Tailwind + shadcn imports, grape theme tokens (light and dark), fonts, keyframes
src/Portfolio.tsx          root: visits and played state, composes the sections
src/data.ts                typed projects, skills, certificates, contact, "care" items
src/hooks/use-theme.ts     dark/light mode, saved in localStorage
src/lib/                   storage helper, cn() class helper
src/components/ui/         shadcn/ui components (generated with the shadcn CLI)
src/components/            Nav, Hero, Playground, ProjectSection, Care, Skills, Certs, Contact
src/demos/                 one file per live demo, plus DemoCard and CodeBlock
```

## Common edits

- Resume: replace `public/sahil-kolge-resume.pdf` (same file name)
- Projects, skills, certificates, contact: `src/data.ts`
- Add a project: add an entry to `PROJECTS` in `data.ts` (and its id to `ProjectId`), create its demo
  in `src/demos/`, and register it in the `DEMOS` map in `components/Playground.tsx`
- Colours: CSS variables in `:root` (light) and `.dark` (dark) in `src/index.css`
- Add a shadcn component: `npx shadcn@latest add <name>`

## Deploy

```bash
npm run build
```

Push to GitHub and import the repo on Vercel. Framework preset: Vite.
