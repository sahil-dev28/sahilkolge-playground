// Every route that is rendered to static HTML at build time, with its head tags.
// Relative .ts imports so the prerender script and node --test can load it without the @/ alias.
import { CASE_STUDIES } from "./case-studies/index.ts";
import { PROJECTS, SITE_URL, type Project } from "./data.ts";

export const HOME_TITLE = "Sahil Kolge · Full Stack Developer";
export const PROJECTS_TITLE = "All projects · Sahil Kolge";
export const AGENT_TITLE = "Agent view · Sahil Kolge";

export function caseStudyTitle(project: Project): string {
  return `${project.title} · Sahil Kolge`;
}

export interface Page {
  path: string;
  title: string;
  description: string;
  // Absolute URL of the link preview image, when the page has a screenshot.
  image?: string;
}

export const PAGES: Page[] = [
  {
    path: "/",
    title: HOME_TITLE,
    description: "Sahil Kolge, full stack developer in Mumbai. React, Next.js and Node.js projects live in production.",
  },
  {
    path: "/projects",
    title: PROJECTS_TITLE,
    description: "Every app and practice build by Sahil Kolge, with live links, source code and stack.",
  },
  {
    path: "/agent",
    title: AGENT_TITLE,
    description: "Sahil Kolge's portfolio as plain markdown: projects, skills and contact in one page.",
  },
  ...CASE_STUDIES.map((cs): Page => {
    const project = PROJECTS.find((p) => p.id === cs.projectId);
    if (!project) throw new Error(`Case study ${cs.slug} has no project ${cs.projectId}`);
    const hero = cs.screens.find((s) => s.placement === "hero") ?? cs.screens[0];
    return {
      path: `/work/${cs.slug}`,
      title: caseStudyTitle(project),
      description: project.oneLine,
      image: hero && `${SITE_URL}${hero.src}`,
    };
  }),
];

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Title, description, canonical and link preview tags for one page.
export function headTags(page: Page): string {
  const url = `${SITE_URL}${page.path === "/" ? "" : page.path}`;
  const title = escape(page.title);
  const description = escape(page.description);
  const tags = [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Sahil Kolge" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:url" content="${url}" />`,
  ];
  if (page.image) tags.push(`<meta property="og:image" content="${escape(page.image)}" />`);
  tags.push(`<meta name="twitter:card" content="${page.image ? "summary_large_image" : "summary"}" />`);
  return tags.join("\n    ");
}
