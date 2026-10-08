// Runs after both Vite builds. Renders every page in PAGES to static HTML so the
// content is in the file itself, not only after JavaScript runs.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { CASE_STUDIES } from "../src/case-studies/index.ts";
import { BIO, PROJECTS, TAGLINE } from "../src/data.ts";
import { headTags, PAGES } from "../src/pages.ts";

const DIST = "dist";
const SERVER = "dist-server";

const { render } = (await import(pathToFileURL(path.resolve(SERVER, "entry-server.js")).href)) as {
  render: (url: string) => string;
};
const template = readFileSync(path.join(DIST, "index.html"), "utf8");
const EMPTY_ROOT = '<div id="root"></div>';
const HEAD = /<title>.*?<\/title>\s*<meta name="description" content="[^"]*" \/>/s;
if (!template.includes(EMPTY_ROOT) || !HEAD.test(template)) throw new Error("index.html no longer matches the prerender template");

// Text each page must contain once rendered, so a page that renders empty or redirects fails the build.
function expected(pathname: string): string[] {
  if (pathname === "/") return [TAGLINE, BIO, ...PROJECTS.map((p) => p.title)];
  if (pathname === "/projects") return ["All projects", ...PROJECTS.map((p) => p.title)];
  if (pathname === "/agent") return ["agent view", TAGLINE];
  const cs = CASE_STUDIES.find((c) => pathname === `/work/${c.slug}`)!;
  const project = PROJECTS.find((p) => p.id === cs.projectId)!;
  return [project.title, project.oneLine, cs.problem];
}

const decode = (s: string) =>
  s.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");

// Unknown paths get the empty shell; the app renders them in the browser.
writeFileSync(path.join(DIST, "spa.html"), template);

for (const page of PAGES) {
  const body = render(page.path);
  const text = decode(body);
  const missing = expected(page.path).filter((s) => !text.includes(s));
  if (missing.length) throw new Error(`${page.path} rendered without: ${missing.join(" | ")}`);

  const html = template.replace(HEAD, headTags(page)).replace(EMPTY_ROOT, `<div id="root">${body}</div>`);
  const file = page.path === "/" ? "index.html" : `${page.path.slice(1)}.html`;
  mkdirSync(path.dirname(path.join(DIST, file)), { recursive: true });
  writeFileSync(path.join(DIST, file), html);
  console.log(`prerendered ${page.path} -> ${DIST}/${file}`);
}

rmSync(SERVER, { recursive: true, force: true });
