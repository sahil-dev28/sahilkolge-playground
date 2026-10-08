import type { CaseStudy } from "./types.ts";

const dir = "/work/philkart";

export const philkart: CaseStudy = {
  slug: "philkart",
  projectId: "p2",
  tags: ["E-commerce catalog", "Cursor pagination", "Worker threads"],
  meta: [
    { label: "built", value: "API, frontend and deploy" },
    { label: "context", value: "Hiring assignment" },
    { label: "timeline", value: "4 days" },
  ],
  problem:
    "A catalog that keeps growing while people browse it. The app can add hundreds of thousands of products in the background, and with plain skip-and-limit paging every insert shifts the list: you see the same product twice or miss one. The app also needs to create hundreds of thousands of products on demand, without making other requests wait. The task was a hiring assignment, due in four days.",
  approach:
    "A Turborepo monorepo scaffolded with Better-T-Stack, so the time went into the app rather than the wiring. An Express 5 API does the heavy work on a real Node server; a Next.js frontend browses it. Products are paged by cursor over a stable `(sort field, _id)` order backed by compound indexes, and the server can insert products two ways, batched on the main thread or split across worker threads, so the trade-offs of heavy work in Node can be compared.",
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
    { label: "api", items: ["Express 5 under `/api/v1`", "Zod validation"] },
    {
      label: "data",
      items: [
        "Mongoose 9",
        "Six compound indexes, one per sort order with and without category, so every filter and sort is an index scan",
        "Faker seeding",
      ],
    },
    {
      label: "generation",
      items: [
        "Batched `insertMany`",
        "Worker threads",
        "A streaming endpoint that sends products without holding them all in memory",
      ],
    },
    { label: "env", items: ["Typed env vars checked at startup"] },
    { label: "deploy", items: ["Vercel, Render, MongoDB Atlas"] },
  ],
  hardProblems: [
    {
      title: "Pages that don't shift while products are added",
      problem: "Skip and limit count rows from the top, so a batch insert makes the next page repeat or skip items.",
      fix: "Next and previous use cursor pagination on `(sort field, _id)`, so a new insert can't push items between pages. The page number in the UI comes from counting how many products sort before the first one on screen.",
    },
    {
      title: "Landing on the right page after a big insert",
      problem: "Generating products while browsing leaves you on a page that now shows different items.",
      fix: "The app remembers the first product you were looking at. After an insert, the server finds which page that product is on now and loads that page. This is the one place that uses `skip`, since it has to land on an exact page number.",
    },
    {
      title: "300k products without freezing the server",
      problem: "One big insert loop blocks Node's event loop, so every other request waits.",
      fix: "Two ways side by side. Batched `insertMany` awaits each batch of 1,000, so other requests get a turn between batches. Worker threads split the job across 4 threads, each with its own database connection, so the main thread only waits for them to finish.",
    },
    {
      title: "Page numbers aren't free",
      problem:
        'To show "page 7 of 3,903", the server counts rows on every request. Counting deep into 500k products gets slow, close to the cost skip had.',
      tradeOff:
        'Cursors fixed duplicates and gaps, but not the cost of knowing which page you\'re on. I kept page numbers because the assignment asked for them. A real store would likely switch to "load more" and drop exact page numbers.',
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
      caption: "page 7 of 3,903, reached by clicking next, each page fetched by cursor",
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
    "Submitted in the four days given. Live on Vercel, Render and MongoDB Atlas, browsing more than 500,000 generated products with six sort orders, a category filter and 20 to 100 items per page. With more time: cache the counts instead of running them on every request, cap and protect the generate endpoints, and add tests that walk every page while products are being inserted to prove nothing repeats or goes missing.",
};
