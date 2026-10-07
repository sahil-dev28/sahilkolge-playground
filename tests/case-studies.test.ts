import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { test } from "node:test";
import { CASE_STUDIES, getCaseStudy } from "../src/case-studies/index.ts";
import { PROJECTS } from "../src/data.ts";

test("finds worksphere by slug", () => {
  const cs = getCaseStudy("worksphere");
  assert.ok(cs);
  assert.equal(cs.projectId, "p1");
});

test("unknown, wrong-case or missing slug returns undefined", () => {
  assert.equal(getCaseStudy("nope"), undefined);
  assert.equal(getCaseStudy("WorkSphere"), undefined);
  assert.equal(getCaseStudy(""), undefined);
  assert.equal(getCaseStudy(undefined), undefined);
});

test("slugs are unique and each points at a featured project", () => {
  const slugs = CASE_STUDIES.map((c) => c.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  for (const c of CASE_STUDIES) {
    assert.ok(PROJECTS.some((p) => p.id === c.projectId), c.slug);
  }
});

test("every screenshot is absolute, exists, and has real dimensions", () => {
  for (const c of CASE_STUDIES) {
    for (const s of c.screens) {
      assert.ok(s.src.startsWith(`/work/${c.slug}/`), s.src);
      assert.ok(existsSync(new URL(`../public${s.src}`, import.meta.url)), `missing ${s.src}`);
      assert.ok(s.width > 0 && s.height > 0, s.src);
      assert.ok(s.alt.trim() && s.caption.trim(), s.src);
    }
    assert.equal(c.screens.filter((s) => s.placement === "hero").length, 1, `${c.slug} needs exactly one hero`);
  }
});

test("no empty copy", () => {
  for (const c of CASE_STUDIES) {
    for (const text of [c.problem, c.approach, c.outcome, ...c.tags]) assert.ok(text.trim(), c.slug);
    for (const m of c.meta) assert.ok(m.label.trim() && m.value.trim(), c.slug);
    for (const a of c.architecture) assert.ok(a.label.trim() && a.items.length > 0, a.label);
    for (const h of c.hardProblems) assert.ok(h.title.trim() && h.problem.trim() && h.fix.trim(), h.title);
  }
});

test("each case study's project links to it", () => {
  for (const c of CASE_STUDIES) {
    const p = PROJECTS.find((x) => x.id === c.projectId);
    assert.equal(p?.caseStudyUrl, `/work/${c.slug}`, c.slug);
  }
});
