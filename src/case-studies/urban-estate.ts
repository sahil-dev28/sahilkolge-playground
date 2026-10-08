import type { CaseStudy } from "./types.ts";

const dir = "/work/urban-estate";

export const urbanEstate: CaseStudy = {
  slug: "urban-estate",
  projectId: "p4",
  tags: ["Rental marketplace", "URL state", "Maps"],
  meta: [
    { label: "built", value: "Frontend, on an existing REST API" },
    { label: "context", value: "Personal project" },
    { label: "timeline", value: "1 month" },
  ],
  problem:
    "Property search lives or dies by its filters. If they sit in component state, a search can't be shared, bookmarked or undone with Back. Listings only carry a free-text address, so showing them on a map means geocoding in the browser against a free service with a strict rate limit. And paging through results shouldn't blank the list every time.",
  approach:
    "The URL is the only place search state lives: the filter form keeps a draft, writes the query string on submit, and re-reads it on Back and Forward. The list and the map read the same TanStack Query result, so pins always match the cards. Server data lives in TanStack Query, the logged-in user in a small persisted Zustand store, and errors go through one axios interceptor.",
  architecture: [
    { label: "interface", items: ["React 19, React Router 7", "shadcn/ui and Tailwind", "⌘K command palette, dark mode"] },
    { label: "state", items: ["Filters and page in the URL", "TanStack Query for server data", "Zustand for the session"] },
    { label: "map", items: ["Leaflet with OpenStreetMap tiles", "Nominatim geocoding, queued and cached"] },
    { label: "forms", items: ["react-hook-form and Zod", "FilePond image uploads"] },
    { label: "api", items: ["Axios with cookie auth", "One interceptor for errors and 401s"] },
    { label: "roles", items: ["Tenants search and apply", "Landlords list and edit properties"] },
  ],
  hardProblems: [
    {
      title: "Searches you can share and undo",
      problem: "Filters kept in component state vanish on reload and can't be linked or undone with Back.",
      fix: "Every filter and the page number live in the URL. The form keeps a local draft that re-syncs on every URL change, and a new search drops back to page 1.",
    },
    {
      title: "Geocoding without getting rate-limited",
      problem: "Listings carry free-text addresses, and Nominatim allows about one request a second.",
      fix: 'A promise queue spaces requests 1.1 seconds apart. If two cards have the same address, only one request goes out. Answers are cached in localStorage, including "not found", so a bad address isn\'t retried on every visit. If you change the search before a lookup finishes, its result is ignored.',
      tradeOff:
        "Each visitor still geocodes in their own browser. The better fix is geocoding once on the server when a listing is saved and storing the coordinates. I kept it in the browser because the API wasn't mine to change.",
    },
    {
      title: "A list that never flashes empty",
      problem: "Each new page would blank the grid while it loads.",
      fix: "placeholderData: keepPreviousData keeps the old page on screen, faded, until the new one arrives. Pins and cards come from the same query, so they swap together.",
    },
  ],
  screens: [
    {
      src: `${dir}/01-search-map.webp`,
      alt: "Urban Estate search results: property cards beside a map with price pins",
      caption: "search results: cards and map from the same query",
      width: 1440,
      height: 900,
      placement: "hero",
    },
    {
      src: `${dir}/02-filtered.webp`,
      alt: "Search for Mumbai, open listings only, sorted by price, with the map zoomed to the results",
      caption: "Mumbai, open only, cheapest first. Copy the link and anyone gets the same results.",
      width: 1440,
      height: 900,
      placement: "middle",
    },
    {
      src: `${dir}/03-property-detail.webp`,
      alt: "Property detail page with photo, price, carpet area and a Book Property button",
      caption: "property detail with the owner card",
      width: 1440,
      height: 900,
      placement: "middle",
    },
    {
      src: `${dir}/04-command-palette.webp`,
      alt: "Command palette open with a search for Thane showing one matching property",
      caption: "⌘K palette searching properties",
      width: 1440,
      height: 900,
      placement: "end",
    },
  ],
  outcome:
    "Live on Vercel with a one-click demo login for reviewers. Tenants can search, see results on a map, open a property and apply. Landlords can create and edit listings with photos. Any search can be copied as a link and opens the same results, and repeat visits load map pins from cache instantly. Built while learning frontend; the first UI was rough, and I reworked it as I learned. With more time: move geocoding to the server and add tests for the URL and filter sync.",
};
