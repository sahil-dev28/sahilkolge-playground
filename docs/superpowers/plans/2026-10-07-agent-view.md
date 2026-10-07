# Agent View Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "view as agent" option: a build-generated `/llms.txt` markdown profile and an `/agent` page that shows it with a copy button.

**Architecture:** A pure function, `buildAgentMarkdown()`, in `src/agent-markdown.ts` turns the existing data modules into markdown. An inline Vite plugin emits it as `dist/llms.txt` and serves it in dev. A new React route, `/agent`, imports the same function, so the page and the file are always identical.

**Tech Stack:** Vite 8, React 18, React Router 7, Tailwind 4, TypeScript, and Node 26 `node:test` with native type stripping. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-10-07-agent-view-design.md`

## Global Constraints

- No new npm dependencies.
- `SITE_URL` is exactly `"https://sahilkolge-dev.vercel.app"`.
- `TAGLINE` is exactly `"Full stack developer in Mumbai, open to roles."`.
- `src/agent-markdown.ts`, and everything it imports, uses relative imports with a `.ts` extension. Never `@/`.
- Nav order: `Projects · Resume · Agent · Dark`.
- Page title: `Agent view · Sahil Kolge`.
- `vercel.json` stays unchanged.
- Commits: author only, with no AI attribution or co-author trailers. Conventional prefixes (`feat:`, `fix:`, `test:`, `docs:`).
- Branch: `feat/agent-view`.

## Review Focus

1. **Clipboard blocked** (insecure context or permission denied): the copy button must not throw or show "Copied", and the text stays selectable in the `<pre>`. Covered in Task 3, Step 6.
2. **Long unbroken URLs at 320–375px:** the `<pre>` must wrap them with no horizontal page scroll. Covered in Task 3, Step 6, which checks `scrollWidth` at 320px.
3. **Non-featured "app" projects** (Nova AI, Elementum) must appear once, and featured projects must not appear twice, because `ALL_PROJECTS` also contains them. Covered in Task 1 tests.
4. **Clicking `/llms.txt` on the page** must fetch the real file, not route inside the SPA back to `/`. Covered in Task 3, Step 6.
5. **Direct load or refresh of `/agent` in production:** it must render, with the catch-all rewrite serving the SPA, while `/llms.txt` still serves the file. Covered in Task 2, Step 5 (preview) and Task 3, Step 7 (post-deploy).

---

## File Structure

| File | Responsibility |
|---|---|
| `src/data.ts` (modify) | Add `SITE_URL` and `TAGLINE` constants |
| `src/all-projects.ts` (modify) | Import from `./data.ts` instead of `@/data` |
| `src/agent-markdown.ts` (create) | `buildAgentMarkdown(): string`, a pure function |
| `tests/agent-markdown.test.ts` (create) | Unit tests for the builder |
| `package.json` (modify) | `test` script |
| `src/components/Intro.tsx` (modify) | Use `TAGLINE` |
| `vite.config.ts` (modify) | `llms-txt` plugin |
| `index.html` (modify) | `<link rel="alternate">` |
| `src/components/AgentView.tsx` (create) | `/agent` page |
| `src/main.tsx` (modify) | Route |
| `src/Layout.tsx` (modify) | Hide `<Contact />` on `/agent` |
| `src/components/Header.tsx` (modify) | "Agent" nav link |

---

### Task 1: Markdown builder

**Files:**
- Modify: `src/data.ts`, the end of the file plus a new const after `BIO`
- Modify: `src/all-projects.ts:1`
- Modify: `src/components/Intro.tsx`
- Modify: `package.json`, the `scripts` block
- Create: `src/agent-markdown.ts`
- Test: `tests/agent-markdown.test.ts`

**Interfaces:**
- Consumes: `BIO`, `PROJECTS`, `SKILLS`, `CERTS`, `CONTACT`, `RESUME_URL`, `type Project` from `src/data.ts`; `ALL_PROJECTS`, `type ProjectEntry` from `src/all-projects.ts`.
- Produces: `export const SITE_URL: string`, `export const TAGLINE: string` (in `src/data.ts`); `export function buildAgentMarkdown(): string` (in `src/agent-markdown.ts`).

- [ ] **Step 1: Add constants to `src/data.ts`**

After the `BIO` declaration, add:

```ts
export const TAGLINE = "Full stack developer in Mumbai, open to roles.";
```

At the end of the file, after `SOURCE_URL`, add:

```ts
export const SITE_URL = "https://sahilkolge-dev.vercel.app";
```

- [ ] **Step 2: Make `all-projects.ts` loadable outside Vite**

Change line 1 of `src/all-projects.ts` from:

```ts
import { PROJECTS, type Project } from "@/data";
```

to:

```ts
import { PROJECTS, type Project } from "./data.ts";
```

- [ ] **Step 3: Use `TAGLINE` in `Intro.tsx`**

In `src/components/Intro.tsx`, change the import to:

```ts
import { BIO, CONTACT, RESUME_URL, TAGLINE } from "@/data";
```

and the tagline paragraph to:

```tsx
          <p className="m-0 text-muted">{TAGLINE}</p>
```

- [ ] **Step 4: Add the test script**

In `package.json`, add the following to `scripts`, after `"preview"`:

```json
    "test": "node --test tests/*.test.ts"
```

Remember the comma after the `"preview"` line.

- [ ] **Step 5: Write the failing tests**

Create `tests/agent-markdown.test.ts`:

```ts
import assert from "node:assert/strict";
import { test } from "node:test";
import { buildAgentMarkdown } from "../src/agent-markdown.ts";
import { ALL_PROJECTS } from "../src/all-projects.ts";
import { BIO, CERTS, CONTACT, PROJECTS, SITE_URL, SKILLS, TAGLINE } from "../src/data.ts";

const md = buildAgentMarkdown();
const count = (needle: string) => md.split(needle).length - 1;

test("opens with name and tagline", () => {
  assert.ok(md.startsWith(`# Sahil Kolge\n\n> ${TAGLINE}\n`));
});

test("is deterministic and ends with exactly one newline", () => {
  assert.equal(buildAgentMarkdown(), md);
  assert.ok(md.endsWith("\n"));
  assert.ok(!md.endsWith("\n\n"));
});

test("carries site, resume and contact", () => {
  assert.ok(md.includes(`(${SITE_URL})`));
  assert.ok(md.includes(`Resume: ${SITE_URL}/sahil-kolge-resume.pdf`));
  assert.ok(md.includes(`**Contact:** ${CONTACT.email} · github.com/sahil-dev28 · linkedin.com/in/sahilkolge-dev`));
  assert.ok(md.includes(BIO));
});

test("every featured project gets one full block", () => {
  for (const p of PROJECTS) {
    assert.equal(count(`### ${p.title} (${p.year})`), 1, p.title);
    assert.ok(md.includes(`- Hard part: ${p.hardPart}`), p.title);
    assert.ok(md.includes(`- Stack: ${p.stack.join(", ")}`), p.title);
    assert.equal(count(`](${p.liveUrl})`), 0, `${p.title} must not repeat as a list line`);
  }
});

test("case study link only when the project has one", () => {
  const worksphere = md.slice(md.indexOf("### WorkSphere"), md.indexOf("### Philkart"));
  assert.ok(worksphere.includes("Case study: https://app.notion.com/"));
  const urban = md.slice(md.indexOf("### Urban Estate"), md.indexOf("### E-Commerce"));
  assert.ok(!urban.includes("Case study"));
});

test("every non-featured project appears exactly once, in the right section", () => {
  const featured = new Set(PROJECTS.map((p) => p.title));
  const more = md.slice(md.indexOf("## More projects"), md.indexOf("## Practice builds"));
  const practice = md.slice(md.indexOf("## Practice builds"), md.indexOf("## Skills"));
  for (const p of ALL_PROJECTS.filter((e) => !featured.has(e.name))) {
    assert.equal(count(`- [${p.name}](${p.liveUrl})`), 1, p.name);
    const section = p.group === "app" ? more : practice;
    assert.ok(section.includes(`- [${p.name}](`), `${p.name} in wrong section`);
  }
  assert.ok(more.includes("[Nova AI Productivity]"));
  assert.ok(more.includes("[Elementum Figma Clone]"));
});

test("skills and certifications", () => {
  for (const s of SKILLS) assert.ok(md.includes(`- ${s.label}: ${s.items.join(", ")}`), s.label);
  for (const c of CERTS) assert.ok(md.includes(`- [${c.name}](${c.url})`), c.name);
});

test("no missing values leak through", () => {
  assert.ok(!md.includes("undefined"));
  assert.ok(!md.includes("null"));
  assert.ok(!/\n{3,}/.test(md), "no triple blank lines");
});
```

- [ ] **Step 6: Run the tests to verify they fail**

Run: `npm test`
Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `src/agent-markdown.ts`.

- [ ] **Step 7: Write `src/agent-markdown.ts`**

```ts
// Plain markdown version of the site for agents. Served as /llms.txt and shown on /agent.
// Relative .ts imports so vite.config.ts and node --test can load it without the @/ alias.
import { ALL_PROJECTS, type ProjectEntry } from "./all-projects.ts";
import { BIO, CERTS, CONTACT, PROJECTS, RESUME_URL, SITE_URL, SKILLS, TAGLINE, type Project } from "./data.ts";

const bare = (url: string) => url.replace(/^https?:\/\//, "");

function projectBlock(p: Project): string {
  const links = [`Live: ${p.liveUrl}`, `Code: ${p.repoUrl}`];
  if (p.caseStudyUrl) links.push(`Case study: ${p.caseStudyUrl}`);
  return [
    `### ${p.title} (${p.year})`,
    "",
    p.oneLine,
    "",
    `- Hard part: ${p.hardPart}`,
    `- Stack: ${p.stack.join(", ")}`,
    `- ${links.join(" · ")}`,
  ].join("\n");
}

function entryLine(p: ProjectEntry): string {
  const caseStudy = p.caseStudyUrl ? ` · Case study: ${p.caseStudyUrl}` : "";
  return `- [${p.name}](${p.liveUrl}) (${p.year}): ${p.description} Stack: ${p.stack.join(", ")}. Code: ${p.repoUrl}${caseStudy}`;
}

export function buildAgentMarkdown(): string {
  const featured = new Set(PROJECTS.map((p) => p.title));
  const others = ALL_PROJECTS.filter((p) => !featured.has(p.name));
  const more = others.filter((p) => p.group === "app");
  const practice = others.filter((p) => p.group === "practice");

  return (
    [
      "# Sahil Kolge",
      `> ${TAGLINE}`,
      `Personal site of Sahil Kolge (${SITE_URL}). Everything below is also on the site. Resume: ${SITE_URL}${RESUME_URL}`,
      `**Contact:** ${CONTACT.email} · ${bare(CONTACT.github)} · ${bare(CONTACT.linkedin)}`,
      `**About**\n\n${BIO}`,
      "## Projects",
      ...PROJECTS.map(projectBlock),
      `## More projects\n\n${more.map(entryLine).join("\n")}`,
      `## Practice builds\n\n${practice.map(entryLine).join("\n")}`,
      `## Skills\n\n${SKILLS.map((s) => `- ${s.label}: ${s.items.join(", ")}`).join("\n")}`,
      `## Certifications\n\n${CERTS.map((c) => `- [${c.name}](${c.url})`).join("\n")}`,
    ].join("\n\n") + "\n"
  );
}
```

- [ ] **Step 8: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS, `ℹ pass 8`, `ℹ fail 0`.

- [ ] **Step 9: Type-check and build**

Run: `npm run build`
Expected: exits 0. This proves the `.ts`-extension imports and the `@/data` change type-check under `tsconfig.app.json`.

- [ ] **Step 10: Eyeball the output**

Run: `node -e 'import("./src/agent-markdown.ts").then(m => process.stdout.write(m.buildAgentMarkdown()))' | head -40`
Expected: readable markdown matching the spec's layout.

- [ ] **Step 11: Commit**

```bash
git add src/data.ts src/all-projects.ts src/components/Intro.tsx src/agent-markdown.ts tests/agent-markdown.test.ts package.json
git commit -m "feat: build markdown profile for agents from site data"
```

---

### Task 2: Serve `/llms.txt`

**Files:**
- Modify: `vite.config.ts`
- Modify: `index.html`, in `<head>` after the description meta

**Interfaces:**
- Consumes: `buildAgentMarkdown(): string` from `src/agent-markdown.ts` (Task 1).
- Produces: `dist/llms.txt` at build; `GET /llms.txt` returns `text/plain; charset=utf-8` in dev.

- [ ] **Step 1: Verify it fails today**

Run: `npm run build && test -f dist/llms.txt && echo FOUND || echo MISSING`
Expected: `MISSING`.

- [ ] **Step 2: Add the plugin**

Replace `vite.config.ts` with:

```ts
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { buildAgentMarkdown } from "./src/agent-markdown.ts";

// Emits /llms.txt at build and serves it in dev. Dev reads data at server start; restart after editing data.ts.
function llmsTxt(): Plugin {
  return {
    name: "llms-txt",
    configureServer(server) {
      server.middlewares.use("/llms.txt", (_req, res) => {
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.end(buildAgentMarkdown());
      });
    },
    generateBundle() {
      this.emitFile({ type: "asset", fileName: "llms.txt", source: buildAgentMarkdown() });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), llmsTxt()],
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, "./src") },
  },
});
```

- [ ] **Step 3: Add the discovery link**

In `index.html`, after the `<meta name="description" ... />` line, add:

```html
    <link rel="alternate" type="text/markdown" href="/llms.txt" title="Markdown version for agents" />
```

- [ ] **Step 4: Verify the build output**

Run: `npm run build && head -3 dist/llms.txt && grep -c 'rel="alternate"' dist/index.html`
Expected: build exits 0; first line `# Sahil Kolge`; third line `> Full stack developer in Mumbai, open to roles.`; grep prints `1`.

Run: `node -e 'import("./src/agent-markdown.ts").then(m => process.exit(require("fs").readFileSync("dist/llms.txt","utf8") === m.buildAgentMarkdown() ? 0 : 1))' && echo IDENTICAL`
Expected: `IDENTICAL`.

- [ ] **Step 5: Verify preview and dev serving**

Run `npx vite preview --port 4173` in the background, then:
`curl -si localhost:4173/llms.txt | head -8` should show `Content-Type: text/plain` and the body starting `# Sahil Kolge`.
`curl -s localhost:4173/agent | grep -c 'id="root"'` should print `1`, showing the SPA fallback still works for a direct load.
Stop preview.

Run `npx vite --port 5173` in the background, then:
`curl -si localhost:5173/llms.txt | head -8` should show `text/plain; charset=utf-8` and `# Sahil Kolge`.
Stop dev.

- [ ] **Step 6: Commit**

```bash
git add vite.config.ts index.html
git commit -m "feat: serve markdown profile at /llms.txt"
```

---

### Task 3: `/agent` page, nav link, layout

**Files:**
- Create: `src/components/AgentView.tsx`
- Modify: `src/main.tsx`, the routes
- Modify: `src/Layout.tsx`
- Modify: `src/components/Header.tsx`, the nav

**Interfaces:**
- Consumes: `buildAgentMarkdown(): string` (Task 1); `Section` (`{ id, label, className?, children }`); `usePageTitle(title: string)`.
- Produces: the `/agent` route and the `AgentView` default export.

- [ ] **Step 1: Verify it fails today**

Run `npx vite --port 5173` in the background. With Playwright, navigate to `http://localhost:5173/agent`.
Expected: redirected to `/` by the `*` catch-all. No "agent view" label exists.

- [ ] **Step 2: Create `src/components/AgentView.tsx`**

```tsx
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { buildAgentMarkdown } from "@/agent-markdown";
import Section from "@/components/Section";
import { usePageTitle } from "@/hooks/use-page-title";

const MARKDOWN = buildAgentMarkdown();

export default function AgentView() {
  usePageTitle("Agent view · Sahil Kolge");
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(MARKDOWN);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked; the markdown stays selectable below.
    }
  };

  return (
    <main className="page flex flex-col gap-10 pt-14 pb-[72px]">
      <Link to="/" className="link self-start text-[15px]">
        ← Human view
      </Link>
      <Section id="agent" label="agent view">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 font-mono text-xs text-muted">
          <span>
            GET{" "}
            <a href="/llms.txt" target="_blank" rel="noreferrer" className="link">
              /llms.txt
            </a>{" "}
            · text/markdown
          </span>
          <button type="button" onClick={copy} className="underline-offset-4 hover:underline">
            <span aria-live="polite">{copied ? "Copied" : "Copy for your LLM"}</span>
          </button>
        </div>
        <pre className="m-0 border border-rule p-4 font-mono text-[13px] leading-relaxed whitespace-pre-wrap [overflow-wrap:anywhere]">
          {MARKDOWN}
        </pre>
      </Section>
    </main>
  );
}
```

- [ ] **Step 3: Add the route**

In `src/main.tsx`, add the import after the `AllProjects` import:

```tsx
import AgentView from "./components/AgentView";
```

and add the route after the `projects` route:

```tsx
          <Route path="agent" element={<AgentView />} />
```

- [ ] **Step 4: Hide Contact on `/agent`**

Replace `src/Layout.tsx` with:

```tsx
import { Outlet, useLocation } from "react-router";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToHash from "@/components/ScrollToHash";
import { useTheme } from "@/hooks/use-theme";

export default function Layout() {
  const { dark, toggleMode } = useTheme();
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen">
      <ScrollToHash />
      <Header dark={dark} onToggleMode={toggleMode} />
      <Outlet />
      {/* The agent view's markdown already carries the email. */}
      {pathname !== "/agent" && <Contact />}
      <Footer />
    </div>
  );
}
```

- [ ] **Step 5: Add the nav link**

In `src/components/Header.tsx`, between the Resume `<a>` and the `<button>`, add:

```tsx
        <span className="text-muted" aria-hidden>·</span>
        <Link to="/agent" className="link">
          Agent
        </Link>
```

so the nav reads `Projects · Resume · Agent · Dark`.

- [ ] **Step 6: Verify in the browser (dev server still running)**

Run `npm run build` first. Expected: exits 0 (type-check passes).

Then use Playwright against `http://localhost:5173`:

1. On `/`, click "Agent". The URL becomes `/agent`, the title is `Agent view · Sahil Kolge`, and `#contact` is absent.
2. The `<pre>` `textContent` equals the response of `fetch("/llms.txt").then(r => r.text())`, run via `browser_evaluate`.
3. Grant clipboard permissions via `browser_run_code_unsafe`: `await page.context().grantPermissions(["clipboard-read","clipboard-write"])`. Click "Copy for your LLM". The label shows "Copied", and `navigator.clipboard.readText()` equals the `<pre>` text.
4. Clipboard blocked: in `browser_evaluate`, run `navigator.clipboard.writeText = () => Promise.reject(new Error("blocked"))`. Wait 2.5s, then click again. The label stays "Copy for your LLM", and the console shows no uncaught errors.
5. `/llms.txt` link: its `href` attribute is `/llms.txt` and `target` is `_blank`. Run `browser_navigate` to `http://localhost:5173/llms.txt`; the body starts with `# Sahil Kolge`, not the SPA.
6. Resize to 320×800. On `/agent`, `document.documentElement.scrollWidth <= document.documentElement.clientWidth` is `true`. Take a screenshot.
7. Click "Dark". Take a screenshot and confirm the `<pre>` border and text are legible.
8. Click "← Human view". The URL becomes `/`, and `#contact` is present.

Stop the dev server.

- [ ] **Step 7: Commit**

```bash
git add src/components/AgentView.tsx src/main.tsx src/Layout.tsx src/components/Header.tsx
git commit -m "feat: add agent view page and nav link"
```

After the owner merges and pushes (not part of this task):

- `curl -sI https://sahilkolge-dev.vercel.app/llms.txt | grep -i content-type` shows `text/plain`.
- `curl -s https://sahilkolge-dev.vercel.app/agent | grep -c 'id="root"'` prints `1`.
