# Agent view design

Date: 2026-10-07
Status: approved in chat, pending spec review

## Goal

Give the portfolio a "view as agent" option, modelled on abhishekkolge.dev/agent: a plain markdown version of the whole profile that AI agents can fetch and recruiters can paste into an LLM.

## Why

The site is a client-rendered SPA. Its served HTML is an empty `<div id="root">`, so any agent, AI search tool or recruiter screener that fetches the page without running JavaScript sees only the title and meta description. A static `/llms.txt` gives them the full profile in one request.

## Scope

In:

- `/llms.txt`, a static markdown file generated at build time from `src/data.ts` and `src/all-projects.ts`.
- `/agent`, a page that shows the same markdown with a "Copy for your LLM" button.
- A "View as agent →" link at the end of the intro section.
- A `<link rel="alternate" type="text/markdown">` in `index.html`.

Out:

- `Accept: text/markdown` content negotiation.
- Per-project `.md` pages.
- Prerendering the human pages.
- A "last updated" date in the markdown.

## Architecture

### `src/agent-markdown.ts`

One pure function, `buildAgentMarkdown(): string`, with no React and no DOM. It reads `BIO`, `PROJECTS`, `SKILLS`, `CERTS`, `CONTACT`, `RESUME_URL`, `SITE_URL` and `ALL_PROJECTS`, and returns the markdown with a trailing newline.

It must use relative imports with the `.ts` extension (`./data.ts`, `./all-projects.ts`). `vite.config.ts` imports it, and Vite's config loader does not resolve the `@/` alias. The extension lets Node's native TypeScript support run the unit tests without a bundler; `allowImportingTsExtensions` is already on. For the same reason, `src/all-projects.ts` changes its import from `@/data` to `./data.ts`.

### `src/data.ts`

Add `export const SITE_URL = "https://sahilkolge-dev.vercel.app";`.

### Vite plugin in `vite.config.ts`

An inline plugin named `llms-txt`:

- `generateBundle`: `this.emitFile({ type: "asset", fileName: "llms.txt", source: buildAgentMarkdown() })`.
- `configureServer`: middleware that answers `GET /llms.txt` with `buildAgentMarkdown()` and `Content-Type: text/plain; charset=utf-8`, so dev matches production.

Data edits in dev need a dev-server restart to show up in `/llms.txt`. The `/agent` page itself hot-reloads normally, because it imports the module through Vite. This is acceptable and is noted here so nobody chases it as a bug.

### Routing

- `src/main.tsx`: add `<Route path="agent" element={<AgentView />} />` inside the `Layout` route, before the `*` catch-all.
- `vercel.json`: unchanged. Vercel serves files from the build output before it applies rewrites, so `dist/llms.txt` wins over the catch-all.

### `src/Layout.tsx`

Render `<Contact />` only when `pathname !== "/agent"`, because the markdown already carries the email.

### `src/components/Intro.tsx` entry link

The header nav is unchanged. The intro's contact `LinkRow` is wrapped in a `flex flex-wrap items-baseline justify-between` row, and a router `Link` to `/agent` sits at its right end. It reads "View as agent →", in muted 15px text, and turns to the text colour on hover. On narrow screens it wraps below the links. This was the owner's call on 2026-10-07, replacing the original "Agent" nav item, and it also avoids the header overflowing at 320px.

### `src/components/AgentView.tsx`

Wrapped in `<main className="page ...">`, matching the spacing used by `AllProjects`. Top to bottom:

1. A `Link` to `/` reading "← Human view", at 15px.
2. A `Section` with `id="agent"` and `label="agent view"` containing:
   - A row, `flex items-baseline justify-between gap-4`, with mono text-xs muted text reading `GET /llms.txt · text/markdown`. `/llms.txt` is a plain `<a href="/llms.txt" target="_blank" rel="noreferrer" className="link">` so the browser requests the real file instead of routing it inside the app. On the right is a button reading "Copy for your LLM".
   - A `<pre>` containing `buildAgentMarkdown()`, styled `font-mono text-[13px] leading-relaxed whitespace-pre-wrap [overflow-wrap:anywhere] border border-rule p-4 m-0`. Wrapping avoids horizontal scroll at 375px.

The markdown string is computed once at module scope, since it is static.

The copy button follows the `Contact.tsx` pattern:

- `navigator.clipboard.writeText`, then the label reads "Copied" for 2s.
- The timer is kept in a ref and cleared on unmount.
- The label sits in an `aria-live="polite"` span.
- If the clipboard is blocked, the failure is caught silently and the text stays selectable in the `<pre>`.

The page title is set with `usePageTitle("Agent view · Sahil Kolge")`.

### `index.html`

Add to `<head>`: `<link rel="alternate" type="text/markdown" href="/llms.txt" title="Markdown version for agents" />`.

## Markdown content

Built only from facts already on the site:

```
# Sahil Kolge

> Full stack developer in Mumbai, open to roles.

Personal site of Sahil Kolge (https://sahilkolge-dev.vercel.app). Everything below is also on the site. Resume: https://sahilkolge-dev.vercel.app/sahil-kolge-resume.pdf

**Contact:** sahilkolge28@gmail.com · github.com/sahil-dev28 · linkedin.com/in/sahilkolge-dev

**About**

<BIO>

## Projects

### WorkSphere (2026)

<oneLine>

- Hard part: <hardPart>
- Stack: Next.js, Express, MongoDB, Turborepo
- Live: <liveUrl> · Code: <repoUrl> · Case study: <caseStudyUrl>

...one block per PROJECTS entry, in array order. "Case study" appears only when caseStudyUrl is set.

## More projects

- [<name>](<liveUrl>) (<year>): <description> Stack: <stack joined by ", ">. Code: <repoUrl>[ · Case study: <caseStudyUrl>]

...one line per ALL_PROJECTS entry with group === "app" whose name is not a PROJECTS title (currently Nova AI Productivity and Elementum Figma Clone).

## Practice builds

...same line format, one per ALL_PROJECTS entry with group === "practice".

## Skills

- <label>: <items joined by ", ">

## Certifications

- [<name>](<url>)
```

Formatting rules:

- In the contact line, strip `https://` from the GitHub and LinkedIn URLs.
- The resume URL is `SITE_URL + RESUME_URL`.
- The tagline "Full stack developer in Mumbai, open to roles." now appears in both `Intro.tsx` and the markdown. Move it to `data.ts` as `TAGLINE` and have both read it, so they cannot drift.

## Error handling

- Clipboard failure: caught silently. The `<pre>` remains selectable.
- Bad data, such as a missing field: TypeScript types on `Project`, `Skill`, `Cert` and `ProjectEntry` already enforce shape, and `npm run build` runs `tsc -b`.

## Verification

`buildAgentMarkdown` gets unit tests in `tests/agent-markdown.test.ts`, using Node's built-in `node:test` with native TypeScript support (Node 26). No new dependencies. `package.json` gains `"test": "node --test tests/*.test.ts"`. The `tests/` folder sits outside `src`, so `tsc -b` does not type-check it.

Other verification:

1. `npm run build` passes, and `dist/llms.txt` exists and starts with `# Sahil Kolge`.
2. `vite preview`, then `curl -i localhost:4173/llms.txt` returns plain text, not HTML. Its body is identical to the `<pre>` text on `/agent`, checked with Playwright `textContent` compared against the file.
3. Playwright on `/agent`:
   - Light and dark modes.
   - 375px width has no horizontal scroll (`scrollWidth <= clientWidth`).
   - The copy button shows "Copied".
   - The "← Human view" link returns to `/`.
   - The "Agent" header link reaches `/agent`.
   - The contact section is absent on `/agent` and present on `/`.
4. `npm run dev`, then `curl localhost:5173/llms.txt` returns the markdown.
5. After deploy: `curl -sI https://sahilkolge-dev.vercel.app/llms.txt` shows a non-HTML content type.

## Files touched

- New: `src/agent-markdown.ts`, `src/components/AgentView.tsx`, `tests/agent-markdown.test.ts`.
- Edited: `src/data.ts` (`SITE_URL`, `TAGLINE`), `src/all-projects.ts` (relative import), `src/components/Intro.tsx` (`TAGLINE`), `src/components/Header.tsx`, `src/Layout.tsx`, `src/main.tsx`, `vite.config.ts`, `index.html`, `package.json` (test script).
