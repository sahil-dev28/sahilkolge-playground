# All projects page — design

Date: 2026-10-03
Status: approved in chat, awaiting written-spec review

## Goal

The home page shows 5 featured projects with live demos. The owner has 22 projects in total
(listed in the old portfolio, `sahil-dev28/sahilkolge-design.com`, `src/util/constant.tsx`).
Add a separate `/projects` page that lists all of them, and a way to reach it from the home page.

Audience: recruiters and hiring managers. Success: every project is reachable in one scan,
with working live and source links, without cluttering the home page.

## Decisions (from the owner)

- Separate page at `/projects`, built with React Router (declarative mode), not an in-page section.
- Show all 22 projects in two groups: apps, then practice.
- Hosting is Vercel.
- Layout A: plain list, one row per project.
- Urban Estate live URL is `https://urban-estate-sk28.vercel.app` everywhere (home page too).
- E-commerce source link is the user frontend repo.
- Stack labels are kept as the old data lists them; no guessing.

## 1. Routing

- Add dependency `react-router` (v7). Use `BrowserRouter` + `Routes` in `src/main.tsx`.
- Routes:
  - `/` renders the current home page content.
  - `/projects` renders the new `AllProjects` page.
  - `*` redirects to `/` with `<Navigate to="/" replace />`.
- Add `vercel.json` at the repo root:
  `{ "rewrites": [{ "source": "/(.*)", "destination": "/" }] }`
  Vercel serves real files (assets, resume PDF) before applying rewrites, so they are unaffected.
- Shared layout component (`src/Layout.tsx`) renders `Nav`, the routed page (`<Outlet />`) and `Contact`.
  It owns the theme hook and the `played` demo state that `Portfolio.tsx` owns today, so the
  "played x/5" count survives page switches. `Portfolio.tsx` becomes the home page body only
  (Hero, About, Playground, Skills, Certs) and receives `played`/`markPlayed` from the layout via
  `useOutletContext`.
- `ScrollToHash` component inside the router: on every location change, if `location.hash` is set,
  scroll the matching element into view and focus it (`preventScroll`) after paint
  (`requestAnimationFrame`); otherwise `window.scrollTo(0, 0)`.
- Home-page nav links stay plain `#id` anchors (no change to the scroll/focus fixes in
  `MobileMenu`). When the current route is not `/`, nav links point to `/#id` via `Link`.
  Nav reads the route with `useLocation`. This applies to every nav link, including Contact,
  even though Contact also renders on `/projects`; one rule keeps the nav simple.
- Page titles: each page sets `document.title` in an effect.
  - `/`: the existing title from `index.html`.
  - `/projects`: `All projects · Sahil Kolge`.

## 2. Data

New file `src/all-projects.ts`:

```ts
export interface ProjectEntry {
  name: string;
  description: string;      // one line
  year: string;
  group: "app" | "practice";
  liveUrl: string;
  repoUrl: string;
  caseStudyUrl?: string;
  stack: string[];
  demoId?: ProjectId;       // set for the 5 featured projects
}
export const ALL_PROJECTS: ProjectEntry[];
```

- The 5 featured entries reuse `liveUrl`, `repoUrl` and `lead` (as `description`) from `PROJECTS` in
  `data.ts` by id, so the two pages cannot drift.
- `stack` uses the old data's names in normal case (e.g. `Next.js`, `MongoDB`, `Tailwind CSS`).
- Descriptions keep the old wording with filler removed ("modern", "clean UI and smooth user
  experience"). No new claims.

### Order and content

Apps (group `app`), in this order:

| Name | Year | Live | Source | Case study | Demo |
|---|---|---|---|---|---|
| WorkSphere | 2026 | work-sphere-web.vercel.app | WorkSphere | Notion (WorkSphere) | p1 |
| Philkart | 2026 | philkart-web.vercel.app | Philkart | Notion (Philkart) | p2 |
| Urban Estate | 2026 | urban-estate-sk28.vercel.app | Urban_Estate | — | p4 |
| E-Commerce | 2026 | e-commerce-smk-user-frontend.vercel.app | E-commerce-smk-user-frontend | — | p5 |
| Hacker News Clone | 2025 | hacker-news-clone-sahil.vercel.app | Hacker-news-clone | — | p3 |
| Nova AI Productivity | 2026 | nova-ai-productivity-sahildev.vercel.app | nova-ai-productivity- | Notion (Nova) | — |
| Elementum Figma Clone | 2026 | elementum-figma-clone-web-one.vercel.app | elementum-figma-clone | — | — |

Practice (group `practice`), all 2025, in the old site's order, stack `JavaScript · CSS`:

| Name | One-line description |
|---|---|
| Movie Seat Booking | Visual seat map with real-time seat selection and price calculation. |
| Meal Finder | Search meals by name or ingredient using a public food API. |
| Typing Game | Typing speed test that tracks WPM and accuracy as you type. |
| Speech Text Reader | Converts speech to text in real time. |
| Lyrics Search | Finds song lyrics by artist and title using a public lyrics API. |
| Infinite Scroll | Loads more content as you scroll. |
| Hangman Game | Classic word-guessing game with win and lose states. |
| Expense Tracker | Tracks income and expenses. |
| Currency Rate | Shows live currency exchange rates. |
| Breakout Game | Breakout arcade game on HTML5 Canvas with paddle physics and brick collision. |
| Calculate Wealth | Calculates and tracks personal wealth. |
| Redux Cart | Shopping cart with Redux state management. |
| Place Picker | Browse places and save favourites. |
| Tic Tac Toe Game | Two-player game with win detection and turn tracking. |
| Final Countdown Game | Stop the countdown timer at the perfect moment. |
| React Form Validation | Real-time input validation and error handling with controlled components. |

Live and source URLs for practice projects are taken verbatim from the old `constant.tsx`.

All 47 URLs (22 live, 22 source, 3 case study) are checked with an HTTP request before commit. Any that fail are
reported to the owner and left in place, not silently dropped or swapped.

Also update `data.ts`: Urban Estate `liveUrl` becomes `https://urban-estate-sk28.vercel.app`.

## 3. Page layout (option A, plain list)

`src/components/AllProjects.tsx`:

- Heading (serif, `heading-display`, same size as section headings): `All <em>projects</em>`,
  accent italic in `text-primary`.
- Sub line: `7 apps and 15 practice builds, 2025–2026.` (counts derived from data).
- Group label in mono lowercase: `apps`, then `practice`.
- App row (desktop): three columns — year (mono, muted) | name (semibold), one-line description,
  stack joined with ` · ` (mono, muted) | links. Rows separated by a top border.
- Practice row: year | name, muted one-line description and stack, wrapping as needed | links.
  Smaller text, tighter padding.
- Links, in order, only when present: `Demo` (router `Link` to `/#p1` etc.), `Live ↗`, `Code ↗`,
  `Case study ↗`. External links open in a new tab with `rel="noreferrer"`.
- Phone (< sm): row stacks — year and name, then description, then stack, then links.
- Uses existing tokens and utilities (`wrap`, `heading-display`, `border`, `text-muted-foreground`);
  no new colours or fonts.

## 4. Entry points

- Home, under the 5 demos (end of `Playground`): outline button `See all 22 projects →`
  (count derived from data), a router `Link` to `/projects`.
- Contact link row: add `All projects` as a router `Link` (internal, so no new tab, no ↗ icon).
- Not added to the top nav.

## Out of scope

- 404 page, project filters or search, screenshots, project detail pages, fixing stack labels,
  meta/OG tags (still pending the deployment URL).

## Testing

- `npm run build` passes (type check + bundle).
- Link check script over all URLs in `all-projects.ts` and `data.ts`.
- Manual (owner, `npm run dev`): load `/projects` directly; refresh on `/projects`; click
  `About` in the nav from `/projects` lands on About; `Demo` link lands on that demo;
  browser back returns to the list; phone menu works on both pages; played count persists
  across pages; dark mode on both pages.
