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
  assert.ok(worksphere.includes(`Case study: ${SITE_URL}/work/worksphere`));
  const philkart = md.slice(md.indexOf("### Philkart"), md.indexOf("### Urban Estate"));
  assert.ok(philkart.includes(`Case study: ${SITE_URL}/work/philkart`));
  const more = md.slice(md.indexOf("## More projects"), md.indexOf("## Practice builds"));
  assert.ok(more.includes("Case study: https://app.notion.com/"), "Notion case studies stay absolute");
  const urban = md.slice(md.indexOf("### Urban Estate"), md.indexOf("### E-Commerce"));
  assert.ok(!urban.includes("Case study"));
  assert.ok(!/Case study: \//.test(md), "no relative case study links");
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
