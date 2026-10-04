# Plain premium redesign — design

Date: 2026-10-04
Status: approved in chat, awaiting written-spec review

## Goal

Replace the current playful design (big display headings, purple accents, playable demos, chips,
badges, coloured contact block, floating pill nav) with a plain, premium, professional site in the
style of personal sites of engineers at OpenAI and Anthropic. The site should not look
AI-generated or template-like. The work, described concretely, is the proof.

Audience: recruiters and hiring managers. Success: a calm single column a reader can scan in
seconds; every project described professionally with live and source links; nothing flashy.

References (measured 2026-10-04): jasonwei.net (visual model), nicholas.carlini.com (how projects
are described), borischerny.com (spacing and restraint).

## Phasing

1. This spec: new visual system, new home page, restyled `/projects`, old design deleted.
2. Later, separate spec: per-project screen recordings with explanations, in the style of
   karinanguyen.com/projects. Not part of this work; no code for it now.

## Decisions (from the owner)

- Same repo and stack (React 18, Vite 8, Tailwind v4, React Router 7, Vercel). Rebuild in place on
  branch `feat/plain-redesign`; delete the old design code.
- Playable demos are removed now (they stay in git history).
- Look: option B (Source Serif 4, off-white, navy links, thin rules) with option A's intro (name
  and role line on the left, round photo on the right).
- Dark mode: light by default, plus a small text toggle.
- Certifications stay, as a small list. Photo stays.
- WorkSphere front end is Next.js. E-Commerce API uses Express + Prisma.

## 1. Structure

Single column, max 640px, centred.

Home (`/`), in order:
1. Header: one line of small text links on the right: `Projects · Resume · Dark`. No floating pill,
   no phone menu sheet.
2. Intro (`id="about"`): name (h1) and `Full stack developer in Mumbai, open to roles.` on the left,
   round photo on the right. Then the bio paragraph. Then inline links
   `GitHub · LinkedIn · Email · Resume`.
3. Selected work (`id="work"`): 5 project rows, then a link `All 22 projects →` to `/projects`
   (count derived from data).
4. Skills (`id="skills"`): 4 plain lines.
5. Certifications (`id="certs"`): plain list of 5 links.
6. Contact (`id="contact"`): one paragraph with the email and a Copy button.
7. Footer: `© <year> Sahil Kolge · Source on GitHub`.

`/projects`: header (with `Sahil Kolge` on the left linking to `/`), heading, sub line, two groups
(apps, practice) of compact rows in the same style, then Contact and footer.

### Kept
`src/main.tsx` routes, `vercel.json`, `ScrollToHash`, `use-page-title`, `use-theme` and
`lib/storage`, `lib/utils` (`cn`), `src/all-projects.ts`, `src/data.ts` (reshaped, see section 3),
`src/assets/profile.webp`, `public/sahil-kolge-resume.pdf`.

### Deleted
`src/demos/*`, `Hero`, `Playground`, `ProjectSection`, `About`, `Skills`, `Certs` (rewritten),
`Nav`, `MobileMenu`, `SectionLink`, `hooks/use-active-section.ts`, the played/visits state and its
storage keys' readers, `NAV_LINKS`/`NAV_IDS`, `Played` type, and shadcn UI components no longer
imported (`ui/*` files with no remaining importers). Dependencies with no remaining importers are
removed from `package.json` (expected: `@base-ui/react`, `class-variance-authority`, `cn`,
`lucide-react`, `tw-animate-css`, `shadcn`); each removal is confirmed by a search for imports
before uninstalling.

## 2. Visual system

Fonts (Google Fonts, `display=swap`): Source Serif 4 (400, 600; italic 400) for everything;
JetBrains Mono (400) for small meta only.

| Element | Spec |
|---|---|
| Body | 17px / 1.65, Source Serif 4 400 |
| Name (h1) | 30px / 1.2, weight 600; 24px below 480px |
| Project title | 18px, weight 600 |
| Section labels | 13px JetBrains Mono, lowercase, muted |
| Year, stack, meta | 12–13px JetBrains Mono, muted |
| Header links | 15px |

Colours (CSS variables on `:root`, overridden by `.dark` on `<html>`):

| Token | Light | Dark |
|---|---|---|
| `--bg` | `#FAFAF7` | `#111110` |
| `--text` | `#1A1A1A` | `#E6E4DF` |
| `--muted` | `#6B6B6B` | `#9A9893` |
| `--rule` | `#E5E5E0` | `#2A2A28` |
| `--link` | `#1F3A93` | `#8FA8F0` |

- Links: `--link` colour, underlined, `text-underline-offset: 3px`, underline at about 35% opacity,
  solid on hover.
- No gradients, shadows, rounded cards, badges, icons or emoji. The only rounded element is the
  photo.
- Layout: column max 640px; side padding 24px; header 24px from top; 72px between sections; project
  rows separated by a 1px `--rule` line with 24px padding; 16px between paragraphs.
- Photo: 88px circle beside the name, 72px below 480px; always on the right.
- No motion except link hover colour/underline. No fade-ins.
- Focus: visible 2px `--link` outline with 2px offset on all interactive elements.
- No horizontal scroll at 375px.
- Theme toggle: a text button reading `Dark` in light mode and `Light` in dark mode, with
  `aria-pressed` reflecting dark mode. Choice persists via existing `use-theme` storage
  (`sk-mode`). With no saved choice the site is light: the system-preference fallback in
  `lib/storage.ts` `initialMode()` and in the no-flash script in `index.html` is removed; the
  script itself is kept so a saved `dark` choice applies before first paint.

## 3. Content

### Data shape (`src/data.ts`)

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
```

`src/all-projects.ts` `featured()` reads `title`, `oneLine` (as description), `year`, `stack`,
`liveUrl`, `repoUrl`, `caseStudyUrl` from `PROJECTS`, so the two pages cannot drift. Its `demoId`
field and the `Demo` link are removed (no demos). Featured order on both pages: WorkSphere,
Philkart, Urban Estate, E-Commerce, Hacker News Clone.

### Copy

Bio:
> I build web apps end to end: React and Next.js on the front, Node, Express and MongoDB behind
> them. Five of my projects are live in production. I care most about the parts users never see:
> pagination that stays fast, auth that can't be bypassed, and errors handled in one place.

Projects (title · year — one line — hard part — stack):

1. WorkSphere · 2026 — An employee management system where the org chart can't be broken, because
   the server won't let it. — A hierarchy engine checks each record's final state, not just the
   fields sent: one manager per department, no cycles. Employee IDs come from an atomic counter. —
   Next.js · Express · MongoDB · Turborepo. Case study: existing Notion link.
2. Philkart · 2026 — A store built like it expects to get big. Type safe from database to button. —
   Keyset pagination on a compound index per sort order, so page 900 costs what page 1 does. A
   worker_threads job seeds a catalog big enough to prove it without blocking the API. — Next.js ·
   Express · MongoDB · Zod · Turborepo. Case study: existing Notion link.
3. Urban Estate · 2026 — Property search where every filter lives in the URL, so any search can be
   shared or bookmarked. — Map markers follow filters stored in the URL, so a search stays
   shareable and back-button safe, and the list never flashes empty while paging. — React ·
   TanStack Query · Zustand · Leaflet.
4. E-Commerce · 2026 — Cart to checkout, with every API error handled in exactly one place. —
   Axios interceptors handle every failure centrally, and 30+ data hooks let the storefront and
   admin share endpoints. Razorpay checkout across cart, wishlist and orders. — React · Express ·
   Prisma · Razorpay.
5. Hacker News Clone · 2025 — Search, sort, filter and paginate Hacker News, with zero flicker
   between pages. — Composite query keys and kept previous data stop the flicker, and changing a
   filter resets the page so you never land on an empty one. — React · TanStack Query · Zustand.

Links per row, plain text separated by ` · `: `Live`, `Code`, `Case study` (when present). External
links open in a new tab with `rel="noreferrer"`.

Skills:
- Frontend: React, Next.js, TypeScript, Tailwind CSS, shadcn/ui
- State and data: Redux Toolkit, Zustand, TanStack Query, SWR, React Hook Form, Zod
- Backend: Node.js, Express, MongoDB, Mongoose
- Tools: Git, GitHub, Figma, Claude Code

Certifications: the existing 5 entries in `CERTS`, as a list of links.

Contact:
> Email is the best way to reach me: sahilkolge28@gmail.com [Copy]. I'm open to full stack roles.

Copy button: copies the address, shows `Copied` for 2 seconds, announces via `aria-live`; on
clipboard failure nothing changes (the address is visible and is a `mailto:` link).

Page titles: home `Sahil Kolge · Full Stack Developer`; `/projects` `All projects · Sahil Kolge`.

`/projects` sub line: `<n> apps and <m> practice builds, <first year>–<last year>.` Rows: year |
title, description, stack | links. Practice rows smaller and tighter.

## Out of scope

Project recordings (phase 2), project detail pages, meta/OG tags, 404 page, analytics,
blog/writing section, any new content beyond what is listed above.

## Testing

- `npm run build` passes (type check + bundle).
- Search confirms no imports of deleted files and no references to removed dependencies.
- Link check over all URLs in `src/data.ts` and `src/all-projects.ts` returns 200.
- Owner checks with `npm run dev`: home and `/projects` at 1440px and 375px, light and dark;
  header links; Copy button; `Projects` → `/projects` and back; keyboard focus visible; no
  horizontal scroll.
