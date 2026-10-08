# Sahil Kolge · Portfolio

Personal portfolio of Sahil Kolge, full stack developer. A React + TypeScript site with a case study
for each featured project, a list of every project, and a plain markdown view for agents. Every page
is rendered to static HTML at build time.

Live: https://sahilkolge-dev.vercel.app

## Tech

React · TypeScript · Vite · React Router · Tailwind CSS v4 · Fontsource (Source Serif 4, JetBrains Mono)

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:5173

```bash
npm run build   # type check, client + SSR build, prerender every page
```

## Pages

```
/              home: intro, featured projects, contact
/projects      every app and practice build
/work/:slug    case study for a featured project
/agent         the whole site as plain markdown (also served as /llms.txt)
```

## Files

```
src/data.ts                bio, featured projects, skills, certificates, contact, site URLs
src/case-studies/          one file per case study, registered in index.ts
src/all-projects.ts        full project list for /projects
src/agent-markdown.ts      builds the markdown for /agent and /llms.txt
src/pages.ts               prerendered routes and their head tags
src/components/            Header, Intro, ProjectRow, CaseStudy, AllProjects, AgentView, Contact, Footer
src/lib/                   inline code rendering, text and link helpers, storage
src/hooks/                 theme (saved in localStorage), page title
scripts/prerender.ts       renders every page in PAGES to static HTML after the build
public/work/<slug>/        case study screenshots (webp)
```

## Common edits

- Resume: replace `public/sahil-kolge-resume.pdf` (same file name)
- Bio, projects, skills, certificates, contact: `src/data.ts`
- Wrap code terms in backticks in copy to render them in mono
- Add a case study: create `src/case-studies/<slug>.ts`, add it to `CASE_STUDIES` in
  `src/case-studies/index.ts`, and put its screenshots in `public/work/<slug>/`
- Colours: CSS variables in `:root` (light) and `.dark` (dark) in `src/index.css`

## Deploy

Hosted on Vercel (framework preset: Vite). Pushing to `main` deploys.
