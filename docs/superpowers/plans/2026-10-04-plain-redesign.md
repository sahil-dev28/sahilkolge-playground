# Plain Premium Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the playful design with a plain, premium single-column site (home + `/projects`) and delete the old design code.

**Architecture:** Keep the router, `Layout`, `ScrollToHash`, theme hook and project data. Rewrite `index.css` as a small token set (CSS variables + Tailwind v4 `@theme` colours and three utilities). New small components: `Header`, `Intro`, `Section`, `ProjectRow`, `LinkRow`, `Contact`, `Footer`. Delete demos, old sections, shadcn UI kit and unused dependencies.

**Tech Stack:** React 18, TypeScript, Vite 8, Tailwind CSS v4, React Router 7, Vercel.

**Spec:** `docs/superpowers/specs/2026-10-04-plain-redesign-design.md`

## Global Constraints

- Fonts: Source Serif 4 (400, 600, italic 400) for everything; JetBrains Mono 400 for small meta only. Google Fonts, `display=swap`.
- Body 17px / 1.65. Name 30px weight 600 (24px below 480px). Project title 18px weight 600. Section labels 13px mono lowercase muted. Meta 12–13px mono muted. Header links 15px.
- Colours light / dark: `--bg` #FAFAF7 / #111110, `--text` #1A1A1A / #E6E4DF, `--muted` #6B6B6B / #9A9893, `--rule` #E5E5E0 / #2A2A28, `--link` #1F3A93 / #8FA8F0.
- Links underlined, offset 3px, underline ~35% opacity, solid on hover. No gradients, shadows, rounded cards, badges, icons or emoji. Only the photo is rounded.
- Column max 640px, side padding 24px, 72px between sections, project rows separated by 1px `--rule` with 24px padding.
- No motion except link hover. Focus: 2px `--link` outline, 2px offset. No horizontal scroll at 375px.
- Light by default; saved `sk-mode` choice wins; no system-preference fallback.
- External links: `target="_blank" rel="noreferrer"`.
- Copy is exactly as written in the spec, section 3. No invented content.
- Commits: author only, no AI attribution or trailers.
- No test runner exists; do not add one. Verification per task: `npm run build` (runs `tsc -b`), the grep/link checks given, and listed manual checks for the owner.
- Ruling carried from planning: the spec asks for `aria-pressed` on the theme button whose visible text changes between `Dark` and `Light`. A toggle whose label changes must not also use `aria-pressed` (the state would be announced twice and contradict the label). The button uses visible text `Dark`/`Light` and `aria-label` `Switch to dark mode`/`Switch to light mode` instead. Cost if wrong: one attribute.
- Ruling carried from planning: the spec lists `/projects` rows as three columns (year | text | links). In a 640px column that squeezes the text to ~350px. `/projects` rows use the same anatomy as home rows (title with year on the right, description, stack, links). Cost if wrong: a layout tweak.

## Review Focus

1. Narrow phones (375px): the intro row (name + role line + 72px photo) must not overflow or squash the photo — manual check in Task 1, Step 9.
2. First paint: a visitor with saved `dark` sees dark immediately (no light flash); a first-time visitor whose OS is dark still gets light — manual check in Task 1, Step 9.
3. Old shared links such as `/#p2` or `/#work` must not error; `/#p2` lands at top, `/#work` lands on Selected work, `/#contact` on Contact — manual check in Task 1, Step 9.
4. Copy button when the clipboard API is blocked (http, permissions): no error, label stays `Copy` — code path in Task 1, Step 6; manual check Step 9.
5. Removing dependencies must not break the build on Vercel's clean `npm install` — `npm ci` in a clean folder in Task 3, Step 5.

---

### Task 1: New visual system and home page; delete old home components

**Files:**
- Rewrite: `src/index.css`
- Modify: `index.html` (theme script, meta description)
- Modify: `src/lib/storage.ts` (`initialMode`)
- Rewrite: `src/data.ts`
- Modify: `src/all-projects.ts` (`featured` reads new `Project` shape)
- Create: `src/components/LinkRow.tsx`, `src/components/Section.tsx`, `src/components/Header.tsx`, `src/components/Intro.tsx`, `src/components/ProjectRow.tsx`, `src/components/Footer.tsx`
- Rewrite: `src/components/Contact.tsx`, `src/Layout.tsx`, `src/Portfolio.tsx`
- Delete: `src/demos/`, `src/components/Hero.tsx`, `Playground.tsx`, `ProjectSection.tsx`, `About.tsx`, `Skills.tsx`, `Certs.tsx`, `Nav.tsx`, `MobileMenu.tsx`, `SectionLink.tsx`, `src/hooks/use-active-section.ts`

**Interfaces:**
- Produces (from `src/data.ts`): `ProjectId`, `Project { id; title; year; oneLine; hardPart; stack: string[]; liveUrl; repoUrl; caseStudyUrl? }`, `PROJECTS: Project[]`, `Skill { label: string; items: string[] }`, `SKILLS: Skill[]`, `Cert { name; url }`, `CERTS`, `CONTACT`, `RESUME_URL`, `SOURCE_URL`, `BIO: string`
- Produces (from `src/components/LinkRow.tsx`): `RowLink { label: string; href: string; external?: boolean }`, default `LinkRow({ links, className? })`, `projectLinks(liveUrl: string, repoUrl: string, caseStudyUrl?: string): RowLink[]`
- Produces: `Section({ id, label, className?, children })`
- `ProjectEntry` in `src/all-projects.ts` keeps its existing fields this task (including the unused optional `demoId`) so `AllProjects.tsx` still compiles; Task 2 removes `demoId`.

- [ ] **Step 1: Rewrite `src/index.css`**

```css
@import url("https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&family=JetBrains+Mono:wght@400&display=swap");
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

:root {
  --bg: #fafaf7;
  --text: #1a1a1a;
  --muted: #6b6b6b;
  --rule: #e5e5e0;
  --link: #1f3a93;
  color-scheme: light;
}

.dark {
  --bg: #111110;
  --text: #e6e4df;
  --muted: #9a9893;
  --rule: #2a2a28;
  --link: #8fa8f0;
  color-scheme: dark;
}

@theme inline {
  --font-serif: "Source Serif 4", Georgia, serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
  --color-bg: var(--bg);
  --color-text: var(--text);
  --color-muted: var(--muted);
  --color-rule: var(--rule);
  --color-link: var(--link);
}

@layer base {
  body {
    @apply bg-bg font-serif text-[17px] leading-[1.65] text-text antialiased;
  }
  :focus-visible {
    outline: 2px solid var(--link);
    outline-offset: 2px;
  }
  button {
    cursor: pointer;
  }
}

@utility page {
  max-width: 640px;
  margin-inline: auto;
  padding-inline: 24px;
}

@utility link {
  color: var(--link);
  text-decoration-line: underline;
  text-underline-offset: 3px;
  text-decoration-color: color-mix(in srgb, var(--link) 35%, transparent);
  &:hover {
    text-decoration-color: currentColor;
  }
}

@utility section-label {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 400;
  color: var(--muted);
  text-transform: lowercase;
}
```

- [ ] **Step 2: Light-by-default theme**

In `index.html`, replace the inline script body and the description:

```html
    <meta name="description" content="Sahil Kolge, full stack developer in Mumbai. React, Next.js and Node.js projects live in production." />
    <script>
      (function () {
        try {
          if (localStorage.getItem("sk-mode") === "dark") document.documentElement.classList.add("dark");
        } catch (e) {}
      })();
    </script>
```

In `src/lib/storage.ts`, replace `initialMode` with:

```ts
export function initialMode(): Mode {
  return storage.get("sk-mode") === "dark" ? "dark" : "light";
}
```

- [ ] **Step 3: Rewrite `src/data.ts`**

```ts
export type ProjectId = "p1" | "p2" | "p3" | "p4" | "p5";

export interface Project {
  id: ProjectId;
  title: string;
  year: string;
  oneLine: string;
  hardPart: string;
  stack: string[];
  liveUrl: string;
  repoUrl: string;
  caseStudyUrl?: string;
}

export interface Skill {
  label: string;
  items: string[];
}

export interface Cert {
  name: string;
  url: string;
}

export interface Contact {
  email: string;
  github: string;
  linkedin: string;
}

export const BIO =
  "I build web apps end to end: React and Next.js on the front, Node, Express and MongoDB behind them. Five of my projects are live in production. I care most about the parts users never see: pagination that stays fast, auth that can't be bypassed, and errors handled in one place.";

export const PROJECTS: Project[] = [
  {
    id: "p1",
    title: "WorkSphere",
    year: "2026",
    oneLine: "An employee management system where the org chart can't be broken, because the server won't let it.",
    hardPart:
      "A hierarchy engine checks each record's final state, not just the fields sent: one manager per department, no cycles. Employee IDs come from an atomic counter.",
    stack: ["Next.js", "Express", "MongoDB", "Turborepo"],
    liveUrl: "https://work-sphere-web.vercel.app",
    repoUrl: "https://github.com/sahil-dev28/WorkSphere",
    caseStudyUrl:
      "https://app.notion.com/p/Employee-Management-System-Full-Stack-Developer-Hiring-Assignment-3a431c4f75a080c99a59ccc25ef72987",
  },
  {
    id: "p2",
    title: "Philkart",
    year: "2026",
    oneLine: "A store built like it expects to get big. Type safe from database to button.",
    hardPart:
      "Keyset pagination on a compound index per sort order, so page 900 costs what page 1 does. A worker_threads job seeds a catalog big enough to prove it without blocking the API.",
    stack: ["Next.js", "Express", "MongoDB", "Zod", "Turborepo"],
    liveUrl: "https://philkart-web.vercel.app",
    repoUrl: "https://github.com/sahil-dev28/Philkart",
    caseStudyUrl: "https://app.notion.com/p/Philkart-Assignment-Submission-38c31c4f75a080919463cffeaf4d8933",
  },
  {
    id: "p4",
    title: "Urban Estate",
    year: "2026",
    oneLine: "Property search where every filter lives in the URL, so any search can be shared or bookmarked.",
    hardPart:
      "Map markers follow filters stored in the URL, so a search stays shareable and back-button safe, and the list never flashes empty while paging.",
    stack: ["React", "TanStack Query", "Zustand", "Leaflet"],
    liveUrl: "https://urban-estate-sk28.vercel.app",
    repoUrl: "https://github.com/sahil-dev28/Urban_Estate",
  },
  {
    id: "p5",
    title: "E-Commerce",
    year: "2026",
    oneLine: "Cart to checkout, with every API error handled in exactly one place.",
    hardPart:
      "Axios interceptors handle every failure centrally, and 30+ data hooks let the storefront and admin share endpoints. Razorpay checkout across cart, wishlist and orders.",
    stack: ["React", "Express", "Prisma", "Razorpay"],
    liveUrl: "https://e-commerce-smk-user-frontend.vercel.app",
    repoUrl: "https://github.com/sahil-dev28/E-commerce-smk-user-frontend",
  },
  {
    id: "p3",
    title: "Hacker News Clone",
    year: "2025",
    oneLine: "Search, sort, filter and paginate Hacker News, with zero flicker between pages.",
    hardPart:
      "Composite query keys and kept previous data stop the flicker, and changing a filter resets the page so you never land on an empty one.",
    stack: ["React", "TanStack Query", "Zustand"],
    liveUrl: "https://hacker-news-clone-sahil.vercel.app",
    repoUrl: "https://github.com/sahil-dev28/Hacker-news-clone",
  },
];

export const SKILLS: Skill[] = [
  { label: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui"] },
  { label: "State and data", items: ["Redux Toolkit", "Zustand", "TanStack Query", "SWR", "React Hook Form", "Zod"] },
  { label: "Backend", items: ["Node.js", "Express", "MongoDB", "Mongoose"] },
  { label: "Tools", items: ["Git", "GitHub", "Figma", "Claude Code"] },
];

export const CERTS: Cert[] = [
  { name: "React, The Complete Guide", url: "https://bit.ly/4ucSG57" },
  { name: "JavaScript", url: "https://bit.ly/4fvftWk" },
  { name: "JavaScript Projects", url: "https://bit.ly/4xdScyv" },
  { name: "Next.js", url: "https://bit.ly/4e8QxBJ" },
  { name: "Claude Code", url: "https://bit.ly/4e4xmc6" },
];

export const CONTACT: Contact = {
  email: "sahilkolge28@gmail.com",
  github: "https://github.com/sahil-dev28",
  linkedin: "https://linkedin.com/in/sahilkolge-dev",
};

export const RESUME_URL = "/sahil-kolge-resume.pdf";
export const SOURCE_URL = "https://github.com/sahil-dev28/sahilkolge-playground";
```

- [ ] **Step 4: Update `featured` in `src/all-projects.ts`**

Replace the `featured` function and the five `featured("pX", {...})` calls at the top of `ALL_PROJECTS` with:

```ts
// Featured projects reuse the home page data so the two pages can't drift.
function featured(p: Project): ProjectEntry {
  return {
    name: p.title,
    description: p.oneLine,
    year: p.year,
    group: "app",
    liveUrl: p.liveUrl,
    repoUrl: p.repoUrl,
    caseStudyUrl: p.caseStudyUrl,
    stack: p.stack,
  };
}
```

and make the array start with `...PROJECTS.map(featured),` followed by the existing Nova, Elementum and practice entries unchanged. Change the import to `import { PROJECTS, type Project, type ProjectId } from "@/data";`.

- [ ] **Step 5: Create the small building blocks**

`src/components/LinkRow.tsx`:

```tsx
export interface RowLink {
  label: string;
  href: string;
  external?: boolean;
}

export function projectLinks(liveUrl: string, repoUrl: string, caseStudyUrl?: string): RowLink[] {
  const links: RowLink[] = [
    { label: "Live", href: liveUrl, external: true },
    { label: "Code", href: repoUrl, external: true },
  ];
  if (caseStudyUrl) links.push({ label: "Case study", href: caseStudyUrl, external: true });
  return links;
}

export default function LinkRow({ links, className = "" }: { links: RowLink[]; className?: string }) {
  return (
    <p className={`m-0 ${className}`}>
      {links.map((l, i) => (
        <span key={l.label}>
          {i > 0 && <span className="text-muted"> · </span>}
          <a href={l.href} className="link" {...(l.external ? { target: "_blank", rel: "noreferrer" } : {})}>
            {l.label}
          </a>
        </span>
      ))}
    </p>
  );
}
```

`src/components/Section.tsx`:

```tsx
import type { ReactNode } from "react";

interface SectionProps {
  id: string;
  label: string;
  className?: string;
  children: ReactNode;
}

export default function Section({ id, label, className = "", children }: SectionProps) {
  return (
    <section id={id} tabIndex={-1} className={`flex scroll-mt-6 flex-col gap-4 outline-none ${className}`}>
      <h2 className="section-label">{label}</h2>
      {children}
    </section>
  );
}
```

`src/components/Header.tsx`:

```tsx
import { Link, useLocation } from "react-router";
import { RESUME_URL } from "@/data";

interface HeaderProps {
  dark: boolean;
  onToggleMode: () => void;
}

export default function Header({ dark, onToggleMode }: HeaderProps) {
  const { pathname } = useLocation();
  return (
    <header className="page flex items-baseline justify-between gap-4 pt-6 text-[15px]">
      {pathname === "/" ? <span /> : <Link to="/" className="font-semibold">Sahil Kolge</Link>}
      <nav className="flex gap-4">
        <Link to="/projects" className="link">
          Projects
        </Link>
        <a href={RESUME_URL} target="_blank" rel="noreferrer" className="link">
          Resume
        </a>
        <button
          type="button"
          onClick={onToggleMode}
          aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          className="link"
        >
          {dark ? "Light" : "Dark"}
        </button>
      </nav>
    </header>
  );
}
```

`src/components/Intro.tsx`:

```tsx
import profileImg from "@/assets/profile.webp";
import LinkRow from "@/components/LinkRow";
import { BIO, CONTACT, RESUME_URL } from "@/data";

export default function Intro() {
  return (
    <section id="about" tabIndex={-1} className="flex scroll-mt-6 flex-col gap-4 outline-none">
      <div className="flex items-center justify-between gap-6">
        <div className="min-w-0">
          <h1 className="m-0 text-2xl leading-tight font-semibold min-[480px]:text-[30px]">Sahil Kolge</h1>
          <p className="m-0 text-muted">Full stack developer in Mumbai, open to roles.</p>
        </div>
        <img
          src={profileImg}
          alt="Sahil Kolge"
          width={88}
          height={88}
          className="size-[72px] shrink-0 rounded-full object-cover min-[480px]:size-[88px]"
        />
      </div>
      <p className="m-0">{BIO}</p>
      <LinkRow
        links={[
          { label: "GitHub", href: CONTACT.github, external: true },
          { label: "LinkedIn", href: CONTACT.linkedin, external: true },
          { label: "Email", href: `mailto:${CONTACT.email}` },
          { label: "Resume", href: RESUME_URL, external: true },
        ]}
      />
    </section>
  );
}
```

`src/components/ProjectRow.tsx`:

```tsx
import LinkRow, { projectLinks } from "@/components/LinkRow";
import type { Project } from "@/data";

export default function ProjectRow({ p }: { p: Project }) {
  return (
    <article className="flex flex-col gap-1.5 border-t border-rule py-6">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="m-0 text-lg font-semibold">{p.title}</h3>
        <span className="font-mono text-xs text-muted">{p.year}</span>
      </div>
      <p className="m-0">{p.oneLine}</p>
      <p className="m-0">{p.hardPart}</p>
      <p className="m-0 font-mono text-xs text-muted">{p.stack.join(" · ")}</p>
      <LinkRow links={projectLinks(p.liveUrl, p.repoUrl, p.caseStudyUrl)} className="text-[15px]" />
    </article>
  );
}
```

`src/components/Footer.tsx`:

```tsx
import { SOURCE_URL } from "@/data";

export default function Footer() {
  return (
    <footer className="page">
      <p className="m-0 border-t border-rule py-8 font-mono text-xs text-muted">
        © {new Date().getFullYear()} Sahil Kolge ·{" "}
        <a href={SOURCE_URL} target="_blank" rel="noreferrer" className="link">
          Source on GitHub
        </a>
      </p>
    </footer>
  );
}
```

- [ ] **Step 6: Rewrite `src/components/Contact.tsx`**

```tsx
import { useState } from "react";
import Section from "@/components/Section";
import { CONTACT } from "@/data";

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked; the address stays visible as a mailto link.
    }
  };

  return (
    <Section id="contact" label="contact" className="page pb-[72px]">
      <p className="m-0">
        Email is the best way to reach me:{" "}
        <a href={`mailto:${CONTACT.email}`} className="link">
          {CONTACT.email}
        </a>{" "}
        <button
          type="button"
          onClick={copyEmail}
          className="font-mono text-xs text-muted underline-offset-4 hover:underline"
        >
          <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
        </button>
        . I'm open to full stack roles.
      </p>
    </Section>
  );
}
```

- [ ] **Step 7: Rewrite `src/Layout.tsx` and `src/Portfolio.tsx`**

`src/Layout.tsx`:

```tsx
import { Outlet } from "react-router";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToHash from "@/components/ScrollToHash";
import { useTheme } from "@/hooks/use-theme";

export default function Layout() {
  const { dark, toggleMode } = useTheme();

  return (
    <div className="min-h-screen">
      <ScrollToHash />
      <Header dark={dark} onToggleMode={toggleMode} />
      <Outlet />
      <Contact />
      <Footer />
    </div>
  );
}
```

`src/Portfolio.tsx`:

```tsx
import { Link } from "react-router";
import { ALL_PROJECTS } from "@/all-projects";
import Intro from "@/components/Intro";
import ProjectRow from "@/components/ProjectRow";
import Section from "@/components/Section";
import { CERTS, PROJECTS, SKILLS } from "@/data";
import { HOME_TITLE, usePageTitle } from "@/hooks/use-page-title";

export default function Portfolio() {
  usePageTitle(HOME_TITLE);

  return (
    <main className="page flex flex-col gap-[72px] pt-14 pb-[72px]">
      <Intro />
      <Section id="work" label="selected work">
        <div className="border-b border-rule">
          {PROJECTS.map((p) => (
            <ProjectRow key={p.id} p={p} />
          ))}
        </div>
        <Link to="/projects" className="link self-start">
          All {ALL_PROJECTS.length} projects →
        </Link>
      </Section>
      <Section id="skills" label="skills">
        <ul className="m-0 flex list-none flex-col gap-1 p-0">
          {SKILLS.map((s) => (
            <li key={s.label}>
              <span className="text-muted">{s.label}:</span> {s.items.join(", ")}
            </li>
          ))}
        </ul>
      </Section>
      <Section id="certs" label="certifications">
        <ul className="m-0 flex list-disc flex-col gap-1 pl-5">
          {CERTS.map((c) => (
            <li key={c.name}>
              <a href={c.url} target="_blank" rel="noreferrer" className="link">
                {c.name}
              </a>
            </li>
          ))}
        </ul>
      </Section>
    </main>
  );
}
```

- [ ] **Step 8: Delete the old home code and build**

Run:

```bash
git rm -rq src/demos src/components/Hero.tsx src/components/Playground.tsx src/components/ProjectSection.tsx src/components/About.tsx src/components/Skills.tsx src/components/Certs.tsx src/components/Nav.tsx src/components/MobileMenu.tsx src/components/SectionLink.tsx src/hooks/use-active-section.ts
npm run build
```

Expected: `✓ built`, no TypeScript errors. (`AllProjects.tsx` still compiles; it looks unstyled until Task 2.)

Then confirm nothing references deleted code:

```bash
grep -rnE "demos/|Hero|Playground|ProjectSection|MobileMenu|SectionLink|use-active-section|NAV_LINKS|NAV_IDS|ABOUT\b|Played|LayoutContext" src
```

Expected: no output.

- [ ] **Step 9: Manual check (owner, `npm run dev`)**

- Home at 1440px and 375px, light and dark: matches the spec (single 640px column, off-white, navy links, round photo right of the name, thin rules between 5 projects). No horizontal scroll at 375px; photo not squashed.
- `Dark` toggles to dark and the button then reads `Light`; reload keeps the choice with no flash. Clear `sk-mode` in DevTools → Application → Local Storage with OS in dark mode: site loads light.
- `Copy` changes to `Copied` for 2 seconds.
- `/#work` lands on Selected work, `/#contact` on Contact, `/#p2` loads at top with no console error.
- Tab through the page: every link and button shows a navy focus outline.

- [ ] **Step 10: Commit**

```bash
git add -A src index.html
git commit -m "feat: plain redesign of home page"
```

---

### Task 2: Restyle `/projects`

**Files:**
- Rewrite: `src/components/AllProjects.tsx`
- Modify: `src/all-projects.ts` (remove `demoId`)

**Interfaces:**
- Consumes: `ALL_PROJECTS`, `ProjectEntry` from `src/all-projects.ts`; `LinkRow`, `projectLinks` from `src/components/LinkRow.tsx`; `usePageTitle` from `src/hooks/use-page-title.ts`

- [ ] **Step 1: Remove `demoId`**

In `src/all-projects.ts`, delete the line `  demoId?: ProjectId;` from `ProjectEntry`, and change the import to `import { PROJECTS, type Project } from "@/data";`.

- [ ] **Step 2: Rewrite `src/components/AllProjects.tsx`**

```tsx
import { ALL_PROJECTS, type ProjectEntry } from "@/all-projects";
import LinkRow, { projectLinks } from "@/components/LinkRow";
import Section from "@/components/Section";
import { usePageTitle } from "@/hooks/use-page-title";

function Row({ p }: { p: ProjectEntry }) {
  const app = p.group === "app";
  return (
    <li className={`flex flex-col gap-1 border-t border-rule ${app ? "py-5" : "py-3 text-[15px]"}`}>
      <div className="flex items-baseline justify-between gap-4">
        <span className="font-semibold">{p.name}</span>
        <span className="font-mono text-xs text-muted">{p.year}</span>
      </div>
      <p className={`m-0 ${app ? "" : "text-muted"}`}>{p.description}</p>
      <p className="m-0 font-mono text-xs text-muted">{p.stack.join(" · ")}</p>
      <LinkRow links={projectLinks(p.liveUrl, p.repoUrl, p.caseStudyUrl)} className="text-[15px]" />
    </li>
  );
}

function Group({ id, label, items }: { id: string; label: string; items: ProjectEntry[] }) {
  return (
    <Section id={id} label={label}>
      <ul className="m-0 list-none border-b border-rule p-0">
        {items.map((p) => (
          <Row key={p.name} p={p} />
        ))}
      </ul>
    </Section>
  );
}

export default function AllProjects() {
  usePageTitle("All projects · Sahil Kolge");
  const apps = ALL_PROJECTS.filter((p) => p.group === "app");
  const practice = ALL_PROJECTS.filter((p) => p.group === "practice");
  const years = ALL_PROJECTS.map((p) => p.year).sort();
  const span = years[0] === years[years.length - 1] ? years[0] : `${years[0]}–${years[years.length - 1]}`;

  return (
    <main className="page flex flex-col gap-[72px] pt-14 pb-[72px]">
      <div className="flex flex-col gap-2">
        <h1 className="m-0 text-2xl leading-tight font-semibold min-[480px]:text-[30px]">All projects</h1>
        <p className="m-0 text-muted">
          {apps.length} apps and {practice.length} practice builds, {span}.
        </p>
      </div>
      <Group id="apps" label="apps" items={apps} />
      <Group id="practice" label="practice" items={practice} />
    </main>
  );
}
```

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: `✓ built`, no errors. Then `grep -rn "demoId\|heading-display\|wrap \|text-primary\|text-ink-2" src` → no output.

- [ ] **Step 4: Manual check (owner)**

`/projects` at 1440px and 375px, light and dark: header shows `Sahil Kolge` on the left linking home; heading `All projects`; sub line `7 apps and 15 practice builds, 2025–2026.`; apps in order WorkSphere, Philkart, Urban Estate, E-Commerce, Hacker News Clone, Nova AI Productivity, Elementum Figma Clone; 15 practice rows; no horizontal scroll.

- [ ] **Step 5: Commit**

```bash
git add src/components/AllProjects.tsx src/all-projects.ts
git commit -m "feat: plain redesign of projects page"
```

---

### Task 3: Remove unused UI kit and dependencies

**Files:**
- Delete: `src/components/ui/`, `components.json`, `src/lib/utils.ts` (only if unused, see Step 1)
- Modify: `package.json`, `package-lock.json`

- [ ] **Step 1: Confirm nothing imports what is about to go**

```bash
grep -rnE "components/ui|@/lib/utils|from \"cn\"|lucide-react|@base-ui|class-variance-authority|tw-animate|from \"shadcn|shadcn/tailwind" src index.html vite.config.ts
```

Expected: no output. If any line appears, rewrite that usage with plain classes before continuing.

- [ ] **Step 2: Delete files**

```bash
git rm -rq src/components/ui components.json src/lib/utils.ts
```

- [ ] **Step 3: Uninstall dependencies**

```bash
npm uninstall @base-ui/react class-variance-authority cn lucide-react tw-animate-css shadcn
```

Expected: `package.json` dependencies are `@tailwindcss/vite`, `react`, `react-dom`, `react-router`, `tailwindcss`; devDependencies `@types/*`, `@vitejs/plugin-react`, `typescript`, `vite`.

- [ ] **Step 4: Build and link check**

Run: `npm run build` → expected `✓ built`.

Run:

```bash
node --input-type=module -e '
import { readFileSync } from "node:fs";
const s = readFileSync("src/all-projects.ts", "utf8") + readFileSync("src/data.ts", "utf8");
const urls = new Set(s.match(/https:\/\/[^"\s]+/g).filter(u => !u.endsWith("/sahil-dev28/")));
for (const [, repo] of s.matchAll(/GH \+ "([^"]+)"/g)) urls.add("https://github.com/sahil-dev28/" + repo);
for (const [, repo] of s.matchAll(/vercel\.app", "([^"]+)"\)/g)) urls.add("https://github.com/sahil-dev28/" + repo);
const res = await Promise.all([...urls].map(u => fetch(u, { redirect: "follow" }).then(r => r.status).catch(e => "ERR " + e.message).then(st => [st, u])));
const bad = res.filter(([st]) => st !== 200);
console.log("checked", res.length, "non-200:", bad.length); bad.forEach(b => console.log(b.join(" ")));'
```

Expected: `non-200: 0`. Report any failure to the owner; do not change URLs.

- [ ] **Step 5: Clean install, as Vercel does**

```bash
D=$(mktemp -d) && cp package.json package-lock.json "$D" && (cd "$D" && npm ci --ignore-scripts 2>&1 | grep -E "ERESOLVE|error|added")
```

Expected: an `added N packages` line and no `ERESOLVE` or `error`.

- [ ] **Step 6: Commit**

```bash
git add -A package.json package-lock.json src components.json
git commit -m "chore: remove unused ui kit and dependencies"
```

---

### Final: whole-branch check

- [ ] `npm run build` passes.
- [ ] Owner runs the manual checks in Task 1 Step 9 and Task 2 Step 4.
- [ ] After merge and Vercel deploy: home, `/projects`, refresh on `/projects`, dark toggle.
