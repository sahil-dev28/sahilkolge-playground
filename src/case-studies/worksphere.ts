import type { CaseStudy } from "./types.ts";

const dir = "/work/worksphere";

export const worksphere: CaseStudy = {
  slug: "worksphere",
  projectId: "p1",
  tags: ["HR software", "RBAC", "Monorepo"],
  meta: [
    { label: "role", value: "Solo full stack" },
    { label: "context", value: "Hiring assignment" },
    { label: "timeline", value: "1 week" },
  ],
  problem:
    "Three roles look at the same people with different rights. If those rights live only in the UI, anyone with devtools can promote themselves. And an org chart is only as good as its data: one broken manager link and the whole tree fails to render. The task was to build an employee management system as a hiring assignment, in one week.",
  approach:
    "Two services in one TypeScript monorepo. An Express 5 API owns every rule; a Next.js frontend renders only what the API allows. Every write is checked again on the server: the caller's role, which fields that role may edit, and whether the change keeps the reporting hierarchy valid. Shared packages hold the UI primitives and typed environment variables.",
  architecture: [
    {
      label: "interface",
      items: ["Next.js App Router, TanStack Query, React Hook Form", "shadcn/ui and Tailwind", "Recharts dashboards, d3-org-chart"],
    },
    {
      label: "api",
      items: ["Express 5 and TypeScript", "Zod validation middleware", "Authenticate and authorize middleware on every route"],
    },
    {
      label: "rules",
      items: [
        "One HR manager per department, reporting to the super admin",
        "Employees report to their department's HR manager, or the super admin when there is none",
        "Cycle check on every manager change",
      ],
    },
    {
      label: "data",
      items: ["MongoDB and Mongoose", "Dashboard stats in one $facet aggregation", "Atomic counter for employee IDs", "Soft delete"],
    },
    { label: "auth", items: ["JWT in httpOnly cookies, bcrypt", "Forced password change for accounts with temporary passwords"] },
    { label: "tests", items: ["Vitest, Supertest, mongodb-memory-server"] },
    { label: "deploy", items: ["Vercel (web), Render (API), MongoDB Atlas", "Env vars validated at boot with Zod"] },
  ],
  hardProblems: [
    {
      title: "Employee IDs that don't collide",
      problem: "\"Highest ID plus one\" sorts as text, so it breaks at EMP-10000, and two requests at once can get the same ID.",
      fix: "An atomic counter document (findOneAndUpdate with $inc), plus a one-time backfill for existing records.",
    },
    {
      title: "Logged in across two domains",
      problem: "The frontend is on Vercel and the API on Render, so the browser won't send the session cookie cross-site.",
      fix: "The Next.js server reads its own httpOnly cookie and forwards it as a header on API calls, server to server.",
    },
    {
      title: "An org chart that survives bad data",
      problem: "A deleted manager left dangling reportingManager references, and one bad record crashed the whole chart.",
      fix: "Orphaned records fall back to the real root. Deleting a manager reassigns their reports to the super admin, and the super admin can't be deleted.",
    },
    {
      title: "Express 5 made req.query read-only",
      problem: "Validation middleware that rewrote req.query with parsed values started throwing.",
      fix: "Validated query data goes through res.locals, so the middleware stays reusable.",
    },
  ],
  screens: [
    {
      src: `${dir}/01-dashboard-admin.webp`,
      alt: "WorkSphere admin dashboard with headcount, hiring trend and recent hires",
      caption: "admin dashboard: headcount, hiring trend, recent hires",
      width: 1440,
      height: 900,
      placement: "hero",
    },
    {
      src: `${dir}/02-directory.webp`,
      alt: "Employee directory table filtered to the Design department",
      caption: "directory, filtered by department",
      width: 1440,
      height: 900,
      placement: "middle",
    },
    {
      src: `${dir}/03-org-chart.webp`,
      alt: "Org chart showing the super admin and the people reporting to them",
      caption: "org chart built from the live manager tree",
      width: 1440,
      height: 900,
      placement: "middle",
    },
    {
      src: `${dir}/04-csv-import.webp`,
      alt: "Bulk CSV import dialog listing the expected columns",
      caption: "bulk CSV import",
      width: 1440,
      height: 900,
      placement: "end",
    },
  ],
  outcome:
    "Delivered in the one week given. Three roles, 60 employees across 7 departments, live on Vercel, Render and MongoDB Atlas. Production bugs (ID collisions, the org-chart crash, mutations that failed silently) were traced from logs and network evidence and fixed with tests first.",
};
