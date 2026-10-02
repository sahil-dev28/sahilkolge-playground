import ecommerceImg from "@/assets/projects/e-commerce.webp";
import hackerNewsImg from "@/assets/projects/hacker-news.webp";
import philkartImg from "@/assets/projects/philkart.webp";
import urbanEstateImg from "@/assets/projects/urban-estate.webp";
import worksphereImg from "@/assets/projects/worksphere.webp";

export type ProjectId = "p1" | "p2" | "p3" | "p4" | "p5";

export interface Project {
  id: ProjectId;
  short: string;
  meta: string;
  title: string;
  lead: string;
  bullets: string[];
  liveUrl: string;
  image: string;
}

export type Played = Partial<Record<ProjectId, true>>;

export interface SkillGroup {
  k: string;
  v: string[];
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

export type CareItem = [title: string, text: string];

export const PROJECTS: Project[] = [
  {
    id: "p1",
    short: "WorkSphere",
    meta: "01 · HR platform · React · Express · MongoDB · d3-org-chart",
    title: "WorkSphere",
    lead: "An employee management system where the org chart can't be broken, because the server won't let it.",
    bullets: [
      "Role based access across 3 roles, enforced in Express middleware and mirrored in the UI.",
      "JWT in httpOnly cookies, with forced password rotation on first login.",
      "CSV bulk import of 50+ employees with per row success and failure reports.",
      "Recharts dashboard for headcount, hiring trend and active split.",
    ],
    liveUrl: "https://work-sphere-web.vercel.app",
    image: worksphereImg,
  },
  {
    id: "p2",
    short: "Philkart",
    meta: "02 · E-commerce monorepo · Turborepo · Zod · worker_threads",
    title: "Philkart",
    lead: "A store built like it expects to get big. Type safe from database to button.",
    bullets: [
      "Turborepo monorepo with shared packages for end to end type safety and fail fast env validation.",
      "Cursor based (keyset) pagination so deep pages stay fast.",
      "A worker_threads background worker that seeds catalog data with Faker.js without blocking the API.",
      "Zod request schemas, central error middleware, shared shadcn/ui tokens with dark and light themes.",
    ],
    liveUrl: "https://philkart-web.vercel.app",
    image: philkartImg,
  },
  {
    id: "p3",
    short: "HN Clone",
    meta: "03 · Search client · TanStack Query v5 · Zustand v5",
    title: "Hacker News Clone",
    lead: "Search, sort, filter and paginate Hacker News, with zero flicker between pages.",
    bullets: [
      "Composes Algolia query strings at runtime from tags, page, hitsPerPage, query and numericFilters.",
      "Composite query keys for granular cache invalidation, keepPreviousData to kill pagination flicker.",
      "Zustand actions reset the page index when filters change, so you never land on an empty page.",
    ],
    liveUrl: "https://hacker-news-clone-sahil.vercel.app",
    image: hackerNewsImg,
  },
  {
    id: "p4",
    short: "Urban Estate",
    meta: "04 · Real estate · React Router v7 · Leaflet · Zustand persist",
    title: "Urban Estate",
    lead: "Property search where every filter lives in the URL, so any search can be shared or bookmarked.",
    bullets: [
      "Auth pipeline with registration, email verification and password reset, persisted with Zustand.",
      "Dual role authorization through HOC route guards, keeping permissions out of UI components.",
      "Map discovery with custom Leaflet markers and useSearchParams synced filters.",
    ],
    liveUrl: "https://urban-estate-nine.vercel.app",
    image: urbanEstateImg,
  },
  {
    id: "p5",
    short: "E-Commerce",
    meta: "05 · Storefront · Razorpay · Axios · React Hook Form + Zod",
    title: "E-Commerce",
    lead: "Cart to checkout, with every API error handled in exactly one place.",
    bullets: [
      "Razorpay checkout end to end across cart, wishlist, addresses and orders.",
      "One Axios client with interceptors for global error normalization and withCredentials auth.",
      "30+ reusable data hooks that keep API logic out of the UI, with skeleton loaders.",
    ],
    liveUrl: "https://e-commerce-smk-user-frontend.vercel.app",
    image: ecommerceImg,
  },
];

export const SKILLS: SkillGroup[] = [
  { k: "core", v: ["HTML", "CSS", "JavaScript", "TypeScript", "Node.js", "MongoDB", "Agentic Coding"] },
  {
    k: "frameworks and libraries",
    v: ["React.js", "Next.js", "Express.js", "Mongoose", "shadcn/ui", "Tailwind CSS", "Redux Toolkit", "TanStack Query", "SWR", "React Hook Form", "Zod", "Formik", "Yup", "Zustand"],
  },
  { k: "tools and platforms", v: ["Git", "GitHub", "Figma", "Claude Code"] },
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

export const CARE: CareItem[] = [
  ["Performance", "Keyset pagination, cached server state, workers that keep the event loop free."],
  ["State management", "Zustand, Redux Toolkit, TanStack Query and SWR, each where it fits best."],
  ["Clean architecture", "Monorepos, shared types, guards and hooks that keep logic out of components."],
  ["Agentic workflows", "Using AI tools like Claude Code to build smarter and ship faster."],
];

export const RESUME_URL = "/sahil-kolge-resume.pdf";
export const SOURCE_URL = "https://github.com/sahil-dev28/sahilkolge-playground";

export const ABOUT: string[] = [
  "React, TypeScript and Next.js on the front, Node, Express and MongoDB behind it.",
  "Five projects live in production, each designed, built and deployed end to end, each with a live demo on this page.",
  "The most involved is Philkart: a Turborepo monorepo with keyset pagination and a worker_threads seeder that never blocks the API.",
  "I care about clean architecture and state management, and I use agentic workflows to ship faster.",
];

export const NAV_LINKS = [
  { id: "work", label: "Playground" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "certs", label: "Certifications" },
  { id: "contact", label: "Contact" },
] as const;

export const NAV_IDS = NAV_LINKS.map((l) => l.id);
