import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { test } from "node:test";
import { CASE_STUDIES } from "../src/case-studies/index.ts";
import { PROJECTS, SITE_URL } from "../src/data.ts";
import { HOME_TITLE, PAGES, headTags } from "../src/pages.ts";

test("prerenders home, projects, agent and every case study", () => {
  const paths = PAGES.map((p) => p.path);
  assert.deepEqual(paths.slice(0, 3), ["/", "/projects", "/agent"]);
  for (const cs of CASE_STUDIES) assert.ok(paths.includes(`/work/${cs.slug}`), cs.slug);
  assert.equal(new Set(paths).size, paths.length, "no duplicate paths");
});

test("every page has its own title and description", () => {
  assert.equal(new Set(PAGES.map((p) => p.title)).size, PAGES.length);
  assert.equal(new Set(PAGES.map((p) => p.description)).size, PAGES.length);
  assert.equal(PAGES[0].title, HOME_TITLE);
});

test("case studies use the project title, one-liner and an existing hero screenshot", () => {
  for (const cs of CASE_STUDIES) {
    const project = PROJECTS.find((p) => p.id === cs.projectId)!;
    const page = PAGES.find((p) => p.path === `/work/${cs.slug}`)!;
    assert.equal(page.title, `${project.title} · Sahil Kolge`);
    assert.equal(page.description, project.oneLine);
    assert.ok(page.image?.startsWith(`${SITE_URL}/work/`), cs.slug);
    assert.ok(existsSync(`public${page.image!.slice(SITE_URL.length)}`), page.image);
  }
});

test("head tags carry absolute canonical and preview tags, escaped", () => {
  const tags = headTags({ path: "/work/x", title: `A "B" & <C>`, description: "D", image: `${SITE_URL}/x.webp` });
  assert.ok(tags.includes("<title>A &quot;B&quot; &amp; &lt;C&gt;</title>"));
  assert.ok(tags.includes(`<link rel="canonical" href="${SITE_URL}/work/x" />`));
  assert.ok(tags.includes(`<meta property="og:image" content="${SITE_URL}/x.webp" />`));
  assert.ok(tags.includes(`<meta name="twitter:card" content="summary_large_image" />`));
  const home = headTags(PAGES[0]);
  assert.ok(home.includes(`<link rel="canonical" href="${SITE_URL}" />`));
  assert.ok(home.includes(`<meta name="twitter:card" content="summary" />`));
  assert.ok(!home.includes("og:image"));
});
