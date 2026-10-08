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
  "I build web apps end to end: React and Next.js on the front, Node, Express and MongoDB behind them. Five of my projects are live in production. I care most about the parts users never see: pagination that stays fast, auth that can't be bypassed, and errors handled in one place.";

export const TAGLINE = "Full stack developer in Mumbai, open to roles.";

export const PROJECTS: Project[] = [
  {
    id: "p1",
    title: "WorkSphere",
    year: "2026",
    oneLine: "An employee management system where the org chart can't be broken, because the server won't let it.",
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
    oneLine: "A store built like it expects to get big. Type safe from database to button.",
    hardPart:
      "Keyset pagination on a compound index per sort order, so page 900 costs what page 1 does. A worker_threads job seeds a catalog big enough to prove it without blocking the API.",
    stack: ["Next.js", "Express", "MongoDB", "Zod", "Turborepo"],
    liveUrl: "https://philkart-web.vercel.app",
    repoUrl: "https://github.com/sahil-dev28/Philkart",
    caseStudyUrl: "/work/philkart",
  },
  {
    id: "p4",
    title: "Urban Estate",
    year: "2026",
    oneLine: "Property search where every filter lives in the URL, so any search can be shared or bookmarked.",
    hardPart:
      "Map markers follow filters stored in the URL, so a search stays shareable and back-button safe, and the list never flashes empty while paging.",
    stack: ["React", "TanStack Query", "Zustand", "Leaflet"],
    liveUrl: "https://urban-estate-sahilkolge-dev.vercel.app",
    repoUrl: "https://github.com/sahil-dev28/Urban_Estate",
  },
  {
    id: "p5",
    title: "E-Commerce",
    year: "2026",
    oneLine: "Cart to checkout, with every API error handled in exactly one place.",
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
    oneLine: "Search, sort, filter and paginate Hacker News, with zero flicker between pages.",
    hardPart:
      "Composite query keys and kept previous data stop the flicker, and changing a filter resets the page so you never land on an empty one.",
    stack: ["React", "TanStack Query", "Zustand"],
    liveUrl: "https://hacker-news-clone-sahil.vercel.app",
    repoUrl: "https://github.com/sahil-dev28/Hacker-news-clone",
  },
];

export const SKILLS: Skill[] = [
  { label: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui"] },
  { label: "State and data", items: ["Redux Toolkit", "Zustand", "TanStack Query", "SWR", "React Hook Form", "Zod"] },
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
export const SOURCE_URL = "https://github.com/sahil-dev28/sahilkolge-playground";
export const SITE_URL = "https://sahilkolge-dev.vercel.app";
