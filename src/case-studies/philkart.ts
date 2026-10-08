import type { CaseStudy } from "./types.ts";

const dir = "/work/philkart";

export const philkart: CaseStudy = {
  slug: "philkart",
  projectId: "p2",
  tags: ["E-commerce catalog", "Cursor pagination", "Node concurrency"],
  meta: [
    { label: "role", value: "Solo full stack" },
    { label: "context", value: "Hiring assignment" },
    { label: "timeline", value: "4 days" },
  ],
  problem:
    "A catalog that keeps growing while people browse it. The app can add hundreds of thousands of products in the background, and with plain skip-and-limit paging every insert shifts the list: you see the same product twice or miss one. Creating 300k products in one request also has to happen without freezing the server. The task was a hiring assignment, due in four days.",
  approach:
    "A Turborepo monorepo scaffolded with Better-T-Stack, so the time went into the app rather than the wiring. An Express 5 API does the heavy work on a real Node server; a Next.js frontend browses it. Products are paged by cursor over a stable (sort field, _id) order backed by compound indexes, and the server can generate products three ways to show the trade-offs of heavy work in Node.",
  architecture: [
    {
      label: "interface",
      items: [
        "Next.js 16, React 19 with the React Compiler",
        "TanStack Query for server state, Zustand for UI state",
        "react-hook-form and Zod",
      ],
    },
    { label: "design", items: ["shadcn/ui in a shared package", "tweakcn tokens, light and dark"] },
    { label: "api", items: ["Express 5 under /api/v1", "Zod validation"] },
    { label: "data", items: ["Mongoose 9", "Compound indexes per sort order", "Faker seeding"] },
    { label: "generation", items: ["Batched promises", "Streaming", "Worker threads"] },
    { label: "env", items: ["Typed env vars checked at startup"] },
    { label: "deploy", items: ["Vercel, Render, MongoDB Atlas"] },
  ],
  hardProblems: [
    {
      title: "Pages that don't shift while products are added",
      problem: "Skip and limit count rows from the top, so a batch insert makes the next page repeat or skip items.",
      fix: "Cursor pagination on (sort field, _id) with a compound index per sort order. Page numbers stay in the UI, worked out from a counted offset instead of skip.",
    },
    {
      title: "Landing on the right page after a big insert",
      problem: "Generating products while browsing leaves you on a page that now shows different items.",
      fix: "An anchor cursor snaps the list to the right page on its own, with no refresh.",
    },
    {
      title: "300k products without freezing the server",
      problem: "One big insert loop blocks Node's event loop, so every other request waits.",
      fix: "Three methods side by side: batched insertMany (1,000 per batch), a streaming async generator that yields between batches, and 4 worker threads that keep the main thread free.",
    },
  ],
  screens: [
    {
      src: `${dir}/01-product-studio.webp`,
      alt: "Philkart Product Studio with generate controls above a grid of product cards",
      caption: "product studio: generate controls and the live catalog",
      width: 1440,
      height: 900,
      placement: "hero",
    },
    {
      src: `${dir}/02-filtered-sorted.webp`,
      alt: "Catalog filtered to Electronics and sorted by price, low to high",
      caption: "one category, sorted by price",
      width: 1440,
      height: 900,
      placement: "middle",
    },
    {
      src: `${dir}/03-deep-page.webp`,
      alt: "Product grid with the pager showing page 7 of 3903",
      caption: "page 7 of 3,903, reached by cursor",
      width: 1440,
      height: 900,
      placement: "middle",
    },
    {
      src: `${dir}/04-dark-theme.webp`,
      alt: "Product Studio in the dark theme",
      caption: "the same studio in the dark theme",
      width: 1440,
      height: 900,
      placement: "end",
    },
  ],
  outcome:
    "Submitted in the four days given. Live on Vercel, Render and MongoDB Atlas, browsing more than 500,000 generated products with six sort orders, a category filter and 20 to 100 items per page. With more time: cache the total count instead of counting on every request, show the streaming method in the UI, add auth and unit tests.",
};
