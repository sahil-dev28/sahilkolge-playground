import assert from "node:assert/strict";
import { test } from "node:test";
import { projectLinks } from "../src/lib/links.ts";

test("live and code open in a new tab", () => {
  const [live, code] = projectLinks("https://a.dev", "https://github.com/x/y");
  assert.deepEqual(live, { label: "Live", href: "https://a.dev", external: true });
  assert.deepEqual(code, { label: "Code", href: "https://github.com/x/y", external: true });
});

test("no case study link when none is given", () => {
  assert.equal(projectLinks("https://a.dev", "https://g.com").length, 2);
});

test("on-site case study is an internal link", () => {
  const cs = projectLinks("https://a.dev", "https://g.com", "/work/worksphere")[2];
  assert.deepEqual(cs, { label: "Case study", href: "/work/worksphere", internal: true });
});

test("external case study still opens in a new tab", () => {
  const cs = projectLinks("https://a.dev", "https://g.com", "https://app.notion.com/p/x")[2];
  assert.deepEqual(cs, { label: "Case study", href: "https://app.notion.com/p/x", external: true });
});
