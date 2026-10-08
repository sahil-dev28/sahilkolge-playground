import type { CaseStudy } from "./types.ts";

const dir = "/work/hacker-news";

export const hackerNews: CaseStudy = {
  slug: "hacker-news",
  projectId: "p3",
  tags: ["News search", "Query caching", "Time window filters"],
  meta: [
    { label: "built", value: "Frontend, on the public Algolia HN API" },
    { label: "context", value: "Personal project" },
  ],
  problem:
    "Hacker News has years of stories but no way to browse them by popularity within a time window. Algolia's HN API can, but only if the client keeps sort, search, date range and page in step: change one and the others must follow, or you end up asking for page 40 of a search with three results.",
  approach:
    "Every control writes to one Zustand store, and every action that changes what you're looking at also resets the page. TanStack Query keys on the whole set (sort, search, page, page size and date window), so each combination caches on its own. The search box is debounced, so typing doesn't fire a request per key.",
  architecture: [
    { label: "interface", items: ["React 19 and Vite", "Tailwind", "react-day-picker for custom ranges, react-paginate"] },
    { label: "state", items: ["Zustand for sort, search, page and date window", "TanStack Query for results"] },
    { label: "api", items: ["HN Algolia `search` and `search_by_date`", "Numeric filters on `created_at_i`"] },
  ],
  hardProblems: [
    {
      title: "Never landing on an empty page",
      problem: "On page 12, a new search with five results would ask Algolia for a page that doesn't exist.",
      fix: "Every store action that changes sort, search, page size or date window sets the page back to zero, and the pager is forced to match.",
    },
    {
      title: "One cache entry per view",
      problem: "Sort, search, page and date window all change the request, and a key that misses one serves the wrong results.",
      fix: "One query key with every parameter, so each view caches separately and going back to a page or search you just saw comes from cache.",
    },
    {
      title: "Search without a request per keystroke",
      problem: "Typing a query would fire a request on every key.",
      fix: "A small debounce I wrote myself waits until you stop typing, and cancels the pending call if the component unmounts, so a late request can't update a screen that's gone.",
    },
    {
      title: "Time windows the API understands",
      problem: "Algolia filters by Unix timestamp, while people think in \"last week\" or a calendar range.",
      fix: "Last 24 hours, week, month and year, or a custom calendar range with future dates disabled, are all turned into `created_at_i` numeric filters.",
    },
  ],
  screens: [
    {
      src: `${dir}/01-popular.webp`,
      alt: "Hacker News clone listing the most popular stories of all time",
      caption: "most popular stories, all time",
      width: 1440,
      height: 900,
      placement: "hero",
    },
    {
      src: `${dir}/02-search.webp`,
      alt: "Search for rust showing the most popular matching stories",
      caption: "debounced search for \"rust\"",
      width: 1440,
      height: 900,
      placement: "middle",
    },
    {
      src: `${dir}/03-custom-range.webp`,
      alt: "Custom range calendar open with future dates disabled",
      caption: "custom date range, future dates disabled",
      width: 1440,
      height: 900,
      placement: "middle",
    },
    {
      src: `${dir}/04-past-week.webp`,
      alt: "Most popular stories from the past week",
      caption: "most popular this week",
      width: 1440,
      height: 900,
      placement: "end",
    },
  ],
  outcome:
    "Live on Vercel. Browse Hacker News by popularity or date, for the last day, week, month, year or any custom range, with search and paging that stay in sync. This was one of my earlier projects. In Urban Estate I went further and moved all search state into the URL, so a search survives a refresh and can be shared.",
};
