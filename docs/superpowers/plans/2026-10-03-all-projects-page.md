# All Projects Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/projects` page listing all 22 projects (apps, then practice) and link to it from the home page.

**Architecture:** React Router v7 in declarative mode (`BrowserRouter`). A shared `Layout` owns theme, visit count and demo-played state and renders `Nav`, the routed page and `Contact`. Home stays the current single page; `/projects` is a plain list. Vercel rewrites every path to `/` so direct loads work.

**Tech Stack:** React 18, TypeScript, Vite 8, Tailwind v4, shadcn/ui, react-router v7.

**Spec:** `docs/superpowers/specs/2026-10-03-all-projects-page-design.md`

## Global Constraints

- Router: `react-router` v7, declarative mode (`BrowserRouter`, `Routes`, `Route`, `Link`, `Outlet`). No data/framework mode.
- Hosting: Vercel. `vercel.json` = `{ "rewrites": [{ "source": "/(.*)", "destination": "/" }] }`.
- Home-page nav links stay plain `#id` anchors; only off-home links use `/#id`.
- `/projects` title: `All projects · Sahil Kolge`. Home title: `Sahil Kolge · Full Stack Developer` (from `index.html`).
- No new colours or fonts; use existing tokens and utilities (`wrap`, `heading-display`, `text-muted-foreground`, `text-ink-2`, `border`).
- Urban Estate live URL is `https://urban-estate-sk28.vercel.app` on both pages.
- Stack labels are copied from the old data; no guessing.
- Commits: author only, no AI attribution or trailers.
- There is no test runner in this repo. Verification is `npm run build` (runs `tsc -b`), a link-check command, and the manual checks listed per task. Do not add a test framework.

## Review Focus

1. Opening or refreshing `/projects` directly on Vercel shows the page, not a 404 — covered by `vercel.json` (Task 1, Step 2) and the manual check in Task 3.
2. Going home and back must not bump the "welcome back · visit #N" counter — visits live in `Layout`, not `Portfolio` (Task 1; manual check in Task 1, Step 8).
3. Same-page `#section` clicks on home must behave exactly as before (no double scroll, no focus jump) — `ScrollToHash` ignores hash-only changes on the same pathname (Task 1, Step 3; manual check in Task 1, Step 8).
4. Phone menu link from `/projects` must land on the home section, not do nothing — `MobileMenu` navigates when off home (Task 4; manual check Task 4, Step 4).
5. React StrictMode runs effects twice in dev; `ScrollToHash` must still scroll on `/#about` loads — the "seen" marker is set inside the animation frame, not before it (Task 1, Step 3; manual check Task 4, Step 4).

---

### Task 1: Router, shared layout and scroll handling

**Files:**
- Modify: `package.json` (dependency)
- Create: `vercel.json`
- Create: `src/components/ScrollToHash.tsx`
- Create: `src/hooks/use-page-title.ts`
- Create: `src/Layout.tsx`
- Modify: `src/Portfolio.tsx` (becomes home body only)
- Modify: `src/main.tsx`

**Interfaces:**
- Produces: `LayoutContext` (from `src/Layout.tsx`): `{ visits: number; played: Played; markPlayed: (id: ProjectId) => () => void }`
- Produces: `usePageTitle(title: string): void` (from `src/hooks/use-page-title.ts`)
- Produces: `HOME_TITLE = "Sahil Kolge · Full Stack Developer"` (exported from `src/hooks/use-page-title.ts`)

- [ ] **Step 1: Install react-router**

Run: `npm install react-router@7`
Expected: `package.json` dependencies now include `"react-router": "^7.x.x"`.

- [ ] **Step 2: Create `vercel.json`**

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/" }] }
```

- [ ] **Step 3: Create `src/components/ScrollToHash.tsx`**

```tsx
import { useEffect, useRef } from "react";
import { useLocation } from "react-router";

// Handles scrolling when the route changes. Hash-only changes on the same page
// are left to the browser and the existing nav code.
export default function ScrollToHash() {
  const { pathname, hash } = useLocation();
  const seen = useRef<string | null>(null);

  useEffect(() => {
    if (seen.current === pathname) return;
    const first = seen.current === null;
    // Mark as seen inside the frame so StrictMode's double effect still scrolls.
    const raf = requestAnimationFrame(() => {
      seen.current = pathname;
      if (!hash) {
        if (!first) window.scrollTo(0, 0);
        return;
      }
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (!el) return;
      el.scrollIntoView();
      el.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname, hash]);

  return null;
}
```

- [ ] **Step 4: Create `src/hooks/use-page-title.ts`**

```ts
import { useEffect } from "react";

export const HOME_TITLE = "Sahil Kolge · Full Stack Developer";

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
```

- [ ] **Step 5: Create `src/Layout.tsx`** (state moved out of `Portfolio.tsx`)

```tsx
import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import Contact from "@/components/Contact";
import Nav from "@/components/Nav";
import ScrollToHash from "@/components/ScrollToHash";
import { PROJECTS, type Played, type ProjectId } from "@/data";
import { useTheme } from "@/hooks/use-theme";
import { storage } from "@/lib/storage";

export interface LayoutContext {
  visits: number;
  played: Played;
  markPlayed: (id: ProjectId) => () => void;
}

export default function Layout() {
  const { dark, toggleMode } = useTheme();
  const [visits, setVisits] = useState(1);
  const [played, setPlayed] = useState<Played>({});

  useEffect(() => {
    const n = (parseInt(storage.get("sk-visits") ?? "", 10) || 0) + 1;
    storage.set("sk-visits", String(n));
    setVisits(n);
  }, []);

  const total = PROJECTS.length;
  const playedCount = Object.keys(played).length;
  const markPlayed = (id: ProjectId) => () => setPlayed((p) => (p[id] ? p : { ...p, [id]: true }));
  const context: LayoutContext = { visits, played, markPlayed };

  return (
    <div className="min-h-screen">
      <ScrollToHash />
      <Nav dark={dark} onToggleMode={toggleMode} playedCount={playedCount} total={total} />
      <Outlet context={context} />
      <Contact playedCount={playedCount} total={total} />
    </div>
  );
}
```

- [ ] **Step 6: Replace `src/Portfolio.tsx`** with the home body only

```tsx
import { useOutletContext } from "react-router";
import { Separator } from "@/components/ui/separator";
import About from "@/components/About";
import Certs from "@/components/Certs";
import Hero from "@/components/Hero";
import Playground from "@/components/Playground";
import Skills from "@/components/Skills";
import { HOME_TITLE, usePageTitle } from "@/hooks/use-page-title";
import type { LayoutContext } from "@/Layout";

export default function Portfolio() {
  const { visits, played, markPlayed } = useOutletContext<LayoutContext>();
  usePageTitle(HOME_TITLE);

  return (
    <>
      <Hero visits={visits} played={played} />
      <About />
      <Separator />
      <Playground markPlayed={markPlayed} />
      <Skills />
      <Certs />
    </>
  );
}
```

- [ ] **Step 7: Replace `src/main.tsx`**

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import "./index.css";
import Layout from "./Layout";
import Portfolio from "./Portfolio";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Portfolio />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
```

- [ ] **Step 8: Build and check home is unchanged**

Run: `npm run build`
Expected: `✓ built`, no TypeScript errors.

Manual (`npm run dev`): home looks and behaves exactly as before; nav and phone-menu section links work; "played x/5" still updates when a demo is played; `/anything` redirects to `/`; reloading home does not jump to top.

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json vercel.json src/main.tsx src/Layout.tsx src/Portfolio.tsx src/components/ScrollToHash.tsx src/hooks/use-page-title.ts
git commit -m "feat: add router and shared layout"
```

---

### Task 2: All-projects data

**Files:**
- Create: `src/all-projects.ts`
- Modify: `src/data.ts` (Urban Estate `liveUrl`)

**Interfaces:**
- Consumes: `PROJECTS`, `ProjectId` from `src/data.ts` (`Project` has `id`, `title`, `lead`, `liveUrl`, `repoUrl`)
- Produces: `ProjectEntry` type and `ALL_PROJECTS: ProjectEntry[]` from `src/all-projects.ts`

- [ ] **Step 1: Update Urban Estate in `src/data.ts`**

Replace `liveUrl: "https://urban-estate-nine.vercel.app",` with `liveUrl: "https://urban-estate-sk28.vercel.app",`.

- [ ] **Step 2: Create `src/all-projects.ts`**

```ts
import { PROJECTS, type ProjectId } from "@/data";

export interface ProjectEntry {
  name: string;
  description: string;
  year: string;
  group: "app" | "practice";
  liveUrl: string;
  repoUrl: string;
  caseStudyUrl?: string;
  stack: string[];
  demoId?: ProjectId;
}

// Featured projects reuse the home page data so the two pages can't drift.
function featured(id: ProjectId, extra: { year: string; stack: string[]; caseStudyUrl?: string }): ProjectEntry {
  const p = PROJECTS.find((x) => x.id === id);
  if (!p) throw new Error(`Unknown project id ${id}`);
  return { name: p.title, description: p.lead, liveUrl: p.liveUrl, repoUrl: p.repoUrl, group: "app", demoId: id, ...extra };
}

const JS_CSS = ["JavaScript", "CSS"];
const GH = "https://github.com/sahil-dev28/";

function practice(name: string, description: string, liveUrl: string, repo: string): ProjectEntry {
  return { name, description, year: "2025", group: "practice", liveUrl, repoUrl: GH + repo, stack: JS_CSS };
}

export const ALL_PROJECTS: ProjectEntry[] = [
  featured("p1", {
    year: "2026",
    stack: ["Node.js", "MongoDB", "React", "Next.js", "TypeScript", "Tailwind CSS"],
    caseStudyUrl:
      "https://app.notion.com/p/Employee-Management-System-Full-Stack-Developer-Hiring-Assignment-3a431c4f75a080c99a59ccc25ef72987",
  }),
  featured("p2", {
    year: "2026",
    stack: ["Next.js", "React", "TypeScript", "Node.js", "MongoDB", "TanStack Query", "Zod", "Tailwind CSS"],
    caseStudyUrl: "https://app.notion.com/p/Philkart-Assignment-Submission-38c31c4f75a080919463cffeaf4d8933",
  }),
  featured("p4", { year: "2026", stack: ["React", "JavaScript", "TypeScript", "CSS", "Tailwind CSS"] }),
  featured("p5", { year: "2026", stack: ["React", "JavaScript", "TypeScript", "Tailwind CSS"] }),
  featured("p3", { year: "2025", stack: ["JavaScript", "CSS", "Tailwind CSS"] }),
  {
    name: "Nova AI Productivity",
    description:
      "Thirteen-section marketing site for a fictional AI productivity platform, with light and dark themes and a hand-written motion layer.",
    year: "2026",
    group: "app",
    liveUrl: "https://nova-ai-productivity-sahildev.vercel.app",
    repoUrl: GH + "nova-ai-productivity-",
    caseStudyUrl:
      "https://app.notion.com/p/Nova-AI-Productivity-Assignment-Submission-3d731c4f75a080a2b6b0f09e40fe60ae",
    stack: ["Next.js", "React", "TypeScript", "Zod", "Tailwind CSS"],
  },
  {
    name: "Elementum Figma Clone",
    description: "Pixel-perfect Figma-to-code build with a responsive UI and a clear component structure.",
    year: "2026",
    group: "app",
    liveUrl: "https://elementum-figma-clone-web-one.vercel.app",
    repoUrl: GH + "elementum-figma-clone",
    stack: ["CSS", "Tailwind CSS"],
  },
  practice("Movie Seat Booking", "Visual seat map with real-time seat selection and price calculation.", "https://movie-seat-booking-snowy.vercel.app", "Movie-Seat-Booking-"),
  practice("Meal Finder", "Search meals by name or ingredient using a public food API.", "https://meal-finder-ya95.vercel.app", "Meal_finder"),
  practice("Typing Game", "Typing speed test that tracks WPM and accuracy as you type.", "https://typing-game-jade-seven.vercel.app", "Typing_game"),
  practice("Speech Text Reader", "Converts speech to text in real time.", "https://speech-text-reader-silk.vercel.app", "Speech_text_reader"),
  practice("Lyrics Search", "Finds song lyrics by artist and title using a public lyrics API.", "https://lyrics-search-eight.vercel.app", "Lyrics_search"),
  practice("Infinite Scroll", "Loads more content as you scroll.", "https://infinite-scroll-sigma-one.vercel.app", "Infinite_scroll"),
  practice("Hangman Game", "Classic word-guessing game with win and lose states.", "https://hangman-game-rust-two.vercel.app", "Hangman_game"),
  practice("Expense Tracker", "Tracks income and expenses.", "https://expense-tracker-zeta-liard-84.vercel.app", "Expense_tracker"),
  practice("Currency Rate", "Shows live currency exchange rates.", "https://currency-rate-tau.vercel.app", "Currency-rate"),
  practice("Breakout Game", "Breakout arcade game on HTML5 Canvas with paddle physics and brick collision.", "https://breakout-game-nine-beta.vercel.app", "Breakout-game"),
  practice("Calculate Wealth", "Calculates and tracks personal wealth.", "https://calculate-wealth.vercel.app", "Calculate-wealth-"),
  practice("Redux Cart", "Shopping cart with Redux state management.", "https://redux-cart-kappa-hazel.vercel.app", "Redux-cart"),
  practice("Place Picker", "Browse places and save favourites.", "https://place-picker-ashen.vercel.app", "Place-picker"),
  practice("Tic Tac Toe Game", "Two-player game with win detection and turn tracking.", "https://tic-tac-toe-ten-eta-31.vercel.app", "Tic-tac-toe"),
  practice("Final Countdown Game", "Stop the countdown timer at the perfect moment.", "https://final-countdown-ten.vercel.app", "Final-countdown"),
  practice("React Form Validation", "Real-time input validation and error handling with controlled components.", "https://react-form-two-alpha.vercel.app", "React-form"),
];
```

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: `✓ built`, no errors. (`ALL_PROJECTS` is unused until Task 3; Vite tree-shakes it, tsc does not error on unused exports.)

- [ ] **Step 4: Check every URL**

Run (prints status for each unique live/source/case-study URL; GitHub repo URLs are built from `GH + repo`, so expand them first):

```bash
node --input-type=module -e '
import { readFileSync } from "node:fs";
const s = readFileSync("src/all-projects.ts", "utf8") + readFileSync("src/data.ts", "utf8");
const urls = new Set(s.match(/https:\/\/[^"\s]+/g).filter(u => !u.endsWith("/sahil-dev28/")));
for (const [, repo] of s.matchAll(/GH \+ "([^"]+)"/g)) urls.add("https://github.com/sahil-dev28/" + repo);
for (const [, repo] of s.matchAll(/vercel\.app", "([^"]+)"\)/g)) urls.add("https://github.com/sahil-dev28/" + repo);
for (const u of [...urls].sort()) {
  const r = await fetch(u, { redirect: "follow" }).catch(e => ({ status: "ERR " + e.message }));
  console.log(r.status, u);
}'
```

Expected: `200` for every live and GitHub URL. Notion case-study URLs may return a non-200 to scripts; open those in a browser instead. Report any failing URL to the owner; do not remove or change it.

- [ ] **Step 5: Commit**

```bash
git add src/all-projects.ts src/data.ts
git commit -m "feat: add all projects data"
```

---

### Task 3: `/projects` page

**Files:**
- Create: `src/components/AllProjects.tsx`
- Modify: `src/main.tsx` (add route)

**Interfaces:**
- Consumes: `ALL_PROJECTS`, `ProjectEntry` from `src/all-projects.ts`; `usePageTitle` from `src/hooks/use-page-title.ts`

- [ ] **Step 1: Create `src/components/AllProjects.tsx`**

Note on the spec: practice rows show name, description and stack in the middle column, wrapping as needed (the spec's data table supplies a description for each practice project).

```tsx
import { Link } from "react-router";
import { ALL_PROJECTS, type ProjectEntry } from "@/all-projects";
import { usePageTitle } from "@/hooks/use-page-title";
import { cn } from "@/lib/utils";

const linkClass = "text-primary underline-offset-4 hover:underline";

function External({ href, children }: { href: string; children: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={linkClass}>
      {children} ↗
    </a>
  );
}

function Links({ p }: { p: ProjectEntry }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold whitespace-nowrap sm:justify-end">
      {p.demoId && (
        <Link to={`/#${p.demoId}`} className={linkClass}>
          Demo
        </Link>
      )}
      <External href={p.liveUrl}>Live</External>
      <External href={p.repoUrl}>Code</External>
      {p.caseStudyUrl && <External href={p.caseStudyUrl}>Case study</External>}
    </div>
  );
}

function Row({ p }: { p: ProjectEntry }) {
  const app = p.group === "app";
  const stack = <span className="font-mono text-xs text-muted-foreground">{p.stack.join(" · ")}</span>;
  return (
    <li
      className={cn(
        "grid gap-x-6 gap-y-1.5 border-t sm:grid-cols-[56px_1fr_auto] sm:items-baseline",
        app ? "py-5" : "py-3 text-[15px]"
      )}
    >
      <span className="font-mono text-xs text-muted-foreground">{p.year}</span>
      {app ? (
        <div className="flex flex-col gap-1">
          <strong className="text-lg font-semibold">{p.name}</strong>
          <p className="m-0 text-ink-2">{p.description}</p>
          {stack}
        </div>
      ) : (
        <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
          <strong className="font-medium">{p.name}</strong>
          <span className="text-muted-foreground">{p.description}</span>
          {stack}
        </div>
      )}
      <Links p={p} />
    </li>
  );
}

function Group({ label, items }: { label: string; items: ProjectEntry[] }) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="m-0 font-mono text-[13px] font-normal text-muted-foreground">{label}</h2>
      <ul className="m-0 list-none border-b p-0">
        {items.map((p) => (
          <Row key={p.name} p={p} />
        ))}
      </ul>
    </section>
  );
}

export default function AllProjects() {
  usePageTitle("All projects · Sahil Kolge");
  const apps = ALL_PROJECTS.filter((p) => p.group === "app");
  const practice = ALL_PROJECTS.filter((p) => p.group === "practice");
  const years = ALL_PROJECTS.map((p) => p.year).sort();
  const span = years[0] === years[years.length - 1] ? years[0] : `${years[0]}–${years[years.length - 1]}`;

  return (
    <main className="wrap flex flex-col gap-12 pt-10 pb-24 lg:pt-36">
      <div className="flex flex-col gap-3">
        <h1 className="heading-display text-[clamp(40px,5vw,64px)]">
          All <span className="text-primary italic">projects</span>
        </h1>
        <p className="m-0 text-lg text-ink-2">
          {apps.length} apps and {practice.length} practice builds, {span}.
        </p>
      </div>
      <Group label="apps" items={apps} />
      <Group label="practice" items={practice} />
    </main>
  );
}
```

- [ ] **Step 2: Add the route in `src/main.tsx`**

Add the import `import AllProjects from "./components/AllProjects";` and, between the index route and the `*` route:

```tsx
          <Route path="projects" element={<AllProjects />} />
```

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: `✓ built`, no errors.

- [ ] **Step 4: Manual check**

`npm run dev`, open `http://localhost:5173/projects` directly:
- Title tab reads `All projects · Sahil Kolge`; heading `All projects`; sub line `7 apps and 15 practice builds, 2025–2026.`
- Apps in order: WorkSphere, Philkart, Urban Estate, E-Commerce, Hacker News Clone, Nova AI Productivity, Elementum Figma Clone. 15 practice rows after.
- `Demo` on Philkart goes to home and lands on the Philkart demo.
- Browser back returns to `/projects` at the top.
- Phone width (375px): rows stack year, name, description, stack, links with no horizontal scroll.
- Dark mode looks right.

- [ ] **Step 5: Commit**

```bash
git add src/components/AllProjects.tsx src/main.tsx
git commit -m "feat: add all projects page"
```

---

### Task 4: Route-aware nav and phone menu

**Files:**
- Create: `src/components/SectionLink.tsx`
- Modify: `src/components/Nav.tsx` (logo and desktop links)
- Modify: `src/components/MobileMenu.tsx` (link hrefs and post-close navigation)

**Interfaces:**
- Produces: `SectionLink` default export, props `Omit<ComponentProps<"a">, "href"> & { id: string }`

- [ ] **Step 1: Create `src/components/SectionLink.tsx`**

```tsx
import type { ComponentProps } from "react";
import { Link, useLocation } from "react-router";

type SectionLinkProps = Omit<ComponentProps<"a">, "href"> & { id: string };

// Plain anchor on the home page (keeps native jump behaviour); router link elsewhere.
export default function SectionLink({ id, ...rest }: SectionLinkProps) {
  const { pathname } = useLocation();
  return pathname === "/" ? <a href={`#${id}`} {...rest} /> : <Link to={`/#${id}`} {...rest} />;
}
```

- [ ] **Step 2: Use it in `src/components/Nav.tsx`**

Add `import SectionLink from "@/components/SectionLink";`.

In `Logo`, replace `<a href="#top" className=...>` … `</a>` with `<SectionLink id="top" className=...>` … `</SectionLink>` (same className and children).

In the desktop links map, replace

```tsx
            <a key={id} href={`#${id}`} className="px-1 py-1.5 text-foreground hover:opacity-70">
              {label}
            </a>
```

with

```tsx
            <SectionLink key={id} id={id} className="px-1 py-1.5 text-foreground hover:opacity-70">
              {label}
            </SectionLink>
```

- [ ] **Step 3: Update `src/components/MobileMenu.tsx`**

Add `import { useLocation, useNavigate } from "react-router";`. Inside the component, after `const active = ...`:

```tsx
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const home = pathname === "/";
```

In `handleClosed`, after `pending.current = null;` insert:

```tsx
    if (!home) {
      navigate(`/#${id}`);
      return;
    }
```

On the menu link, change `href={`#${id}`}` to `href={home ? `#${id}` : `/#${id}`}`.

- [ ] **Step 4: Build and manual check**

Run: `npm run build` — expected `✓ built`.

Manual (`npm run dev`):
- On `/projects` at desktop width, click `About` in the pill: lands on About on home, focus on the section.
- On `/projects` at phone width, open menu, tap `Skills`: menu closes, home loads at Skills.
- On home, all nav and menu links behave exactly as before (no extra jump).
- Logo on `/projects` goes to the top of home.
- Load `http://localhost:5173/#about` directly: lands on About.

- [ ] **Step 5: Commit**

```bash
git add src/components/SectionLink.tsx src/components/Nav.tsx src/components/MobileMenu.tsx
git commit -m "feat: route-aware nav links"
```

---

### Task 5: Entry points on home

**Files:**
- Modify: `src/components/Playground.tsx` (button under demos)
- Modify: `src/components/Contact.tsx` (link in link row)

**Interfaces:**
- Consumes: `ALL_PROJECTS` from `src/all-projects.ts`

- [ ] **Step 1: Button in `src/components/Playground.tsx`**

Add imports:

```tsx
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { ALL_PROJECTS } from "@/all-projects";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
```

After the closing `})}` of `PROJECTS.map`, before `</main>`:

```tsx
      <Link
        to="/projects"
        className={cn(
          buttonVariants({ variant: "outline" }),
          "h-12 self-center rounded-full border-line-2 bg-card px-6 text-base font-semibold dark:border-line-2 dark:bg-card dark:hover:bg-muted"
        )}
      >
        See all {ALL_PROJECTS.length} projects <ArrowRight aria-hidden />
      </Link>
```

- [ ] **Step 2: Link in `src/components/Contact.tsx`**

Add imports `ArrowRight` (to the existing `lucide-react` import) and `import { Link } from "react-router";`.

Immediately before `{LINKS.map(...)}` in the button row:

```tsx
          <Link to="/projects" className={cn(buttonVariants({ variant: "outline", size: "lg" }), outlineButton)}>
            All projects <ArrowRight aria-hidden />
          </Link>
```

- [ ] **Step 3: Build and manual check**

Run: `npm run build` — expected `✓ built`.

Manual: home shows `See all 22 projects →` centred under the last demo; it opens `/projects` at the top. Contact shows `All projects →` before Resume; it opens `/projects` in the same tab, on both pages.

- [ ] **Step 4: Commit**

```bash
git add src/components/Playground.tsx src/components/Contact.tsx
git commit -m "feat: link to all projects from home"
```

---

### Final: whole-branch check

- [ ] `npm run build` passes.
- [ ] Owner runs the manual checks from Tasks 1, 3, 4 and 5 with `npm run dev`.
- [ ] After merge, on Vercel: open `/projects` directly and refresh it; both show the page.
