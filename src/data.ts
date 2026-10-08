export type ProjectId = "p1" | "p2" | "p3" | "p4" | "p5";

export interface Project {
  id: ProjectId;
  title: string;
  year: string;
  oneLine: string;
  hardPart: string;
  stack: string[];
  liveUrl: string;
  repoUrl: string;
  caseStudyUrl?: string;
}

export interface Skill {
  label: string;
  items: string[];
}

export interface Cert {
  name: string;
  url: string;
}

export interface Contact {
  email: string;
  github: string;
  linkedin: string;
}

export const BIO =
  "I build and deploy web apps end to end, with React and Next.js on the front and Node, Express and MongoDB behind them. I keep important rules on the server, design data so it stays fast as it grows, and think about what happens when two requests hit at the same time. I use AI agents daily to work faster, while I own the plan, the review and the result.";

export const TAGLINE = "Full stack developer in Mumbai, open to roles.";

export const PROJECTS: Project[] = [
  {
    id: "p1",
    title: "WorkSphere",
    year: "2026",
    oneLine:
      "An employee management system where the org chart can't be broken, because the server won't let it.",
    hardPart:
      "A hierarchy engine checks each record's final state, not just the fields sent: one manager per department, no cycles. Employee IDs come from an atomic counter.",
    stack: ["Next.js", "Express", "MongoDB", "Turborepo"],
    liveUrl: "https://work-sphere-web.vercel.app",
    repoUrl: "https://github.com/sahil-dev28/WorkSphere",
    caseStudyUrl: "/work/worksphere",
  },
  {
    id: "p2",
    title: "Philkart",
    year: "2026",
    oneLine:
      "A product catalog that stays correct while it grows. Half a million products, no duplicates or gaps between pages.",
    hardPart:
      "Cursor pagination on (sort field, _id) with a compound index per sort order, so new inserts can't push items between pages. A worker_threads job seeds a catalog big enough to prove it without blocking the API.",
    stack: ["Next.js", "Express", "MongoDB", "Zod", "Turborepo"],
    liveUrl: "https://philkart-web.vercel.app",
    repoUrl: "https://github.com/sahil-dev28/Philkart",
    caseStudyUrl: "/work/philkart",
  },
  {
    id: "p4",
    title: "Urban Estate",
    year: "2026",
    oneLine:
      "Property search where every filter lives in the URL, so any search can be shared or bookmarked.",
    hardPart:
      "Map markers follow filters stored in the URL, so a search stays shareable and back-button safe, and the list never flashes empty while paging.",
    stack: ["React", "TanStack Query", "Zustand", "Leaflet"],
    liveUrl: "https://urban-estate-sahilkolge-dev.vercel.app",
    repoUrl: "https://github.com/sahil-dev28/Urban_Estate",
    caseStudyUrl: "/work/urban-estate",
  },
  {
    id: "p5",
    title: "E-Commerce",
    year: "2026",
    oneLine:
      "Cart to checkout, with every API error handled in exactly one place.",
    hardPart:
      "Axios interceptors handle every failure centrally, and 30+ data hooks let the storefront and admin share endpoints. Razorpay checkout across cart, wishlist and orders.",
    stack: ["React", "Express", "Prisma", "Razorpay"],
    liveUrl: "https://e-commerce-user-frontend-sahilkolge-dev.vercel.app",
    repoUrl: "https://github.com/sahil-dev28/E-commerce-smk-user-frontend",
  },
  {
    id: "p3",
    title: "Hacker News Clone",
    year: "2025",
    oneLine:
      "Search, sort, filter and paginate every Hacker News story, from all-time popular to a custom date range.",
    hardPart:
      "One composite query key covers sort, search, page and date window, so every view caches on its own. Changing any filter resets to page 1, so you never land on an empty page.",
    stack: ["React", "TanStack Query", "Zustand"],
    liveUrl: "https://hacker-news-clone-sahil.vercel.app",
    repoUrl: "https://github.com/sahil-dev28/Hacker-news-clone",
    caseStudyUrl: "/work/hacker-news",
  },
];

export const SKILLS: Skill[] = [
  {
    label: "Frontend",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui"],
  },
  {
    label: "State and data",
    items: [
      "Redux Toolkit",
      "Zustand",
      "TanStack Query",
      "SWR",
      "React Hook Form",
      "Zod",
    ],
  },
  { label: "Backend", items: ["Node.js", "Express", "MongoDB", "Mongoose"] },
  { label: "Tools", items: ["Git", "GitHub", "Figma", "Claude Code"] },
];

export const CERTS: Cert[] = [
  { name: "React, The Complete Guide", url: "https://bit.ly/4ucSG57" },
  { name: "JavaScript", url: "https://bit.ly/4fvftWk" },
  { name: "JavaScript Projects", url: "https://bit.ly/4xdScyv" },
  { name: "Next.js", url: "https://bit.ly/4e8QxBJ" },
  { name: "Claude Code", url: "https://bit.ly/4e4xmc6" },
];

export const CONTACT: Contact = {
  email: "sahilkolge28@gmail.com",
  github: "https://github.com/sahil-dev28",
  linkedin: "https://linkedin.com/in/sahilkolge-dev",
};

export const RESUME_URL = "/sahil-kolge-resume.pdf";
export const SOURCE_URL =
  "https://github.com/sahil-dev28/sahilkolge-playground";
export const SITE_URL = "https://sahilkolge-dev.vercel.app";
