// Plain markdown version of the site for agents. Served as /llms.txt and shown on /agent.
// Relative .ts imports so vite.config.ts can load it without the @/ alias.
import { ALL_PROJECTS, type ProjectEntry } from "./all-projects.ts";
import { BIO, CERTS, CONTACT, PROJECTS, RESUME_URL, SITE_URL, SKILLS, TAGLINE, type Project } from "./data.ts";

const bare = (url: string) => url.replace(/^https?:\/\//, "");
// On-site case studies are stored as paths; agents need full URLs.
const absolute = (url: string) => (url.startsWith("/") ? `${SITE_URL}${url}` : url);

function projectBlock(p: Project): string {
  const links = [`Live: ${p.liveUrl}`, `Code: ${p.repoUrl}`];
  if (p.caseStudyUrl) links.push(`Case study: ${absolute(p.caseStudyUrl)}`);
  return [
    `### ${p.title} (${p.year})`,
    "",
    p.oneLine,
    "",
    `- Hard part: ${p.hardPart}`,
    `- Stack: ${p.stack.join(", ")}`,
    `- ${links.join(" · ")}`,
  ].join("\n");
}

function entryLine(p: ProjectEntry): string {
  const caseStudy = p.caseStudyUrl ? ` · Case study: ${absolute(p.caseStudyUrl)}` : "";
  return `- [${p.name}](${p.liveUrl}) (${p.year}): ${p.description} Stack: ${p.stack.join(", ")}. Code: ${p.repoUrl}${caseStudy}`;
}

export function buildAgentMarkdown(): string {
  const featured = new Set(PROJECTS.map((p) => p.title));
  const others = ALL_PROJECTS.filter((p) => !featured.has(p.name));
  const more = others.filter((p) => p.group === "app");
  const practice = others.filter((p) => p.group === "practice");

  return (
    [
      "# Sahil Kolge",
      `> ${TAGLINE}`,
      `Personal site of Sahil Kolge (${SITE_URL}). Everything below is also on the site. Resume: ${SITE_URL}${RESUME_URL}`,
      `**Contact:** ${CONTACT.email} · ${bare(CONTACT.github)} · ${bare(CONTACT.linkedin)}`,
      `**About**\n\n${BIO}`,
      "## Projects",
      ...PROJECTS.map(projectBlock),
      `## More projects\n\n${more.map(entryLine).join("\n")}`,
      `## Practice builds\n\n${practice.map(entryLine).join("\n")}`,
      `## Skills\n\n${SKILLS.map((s) => `- ${s.label}: ${s.items.join(", ")}`).join("\n")}`,
      `## Certifications\n\n${CERTS.map((c) => `- [${c.name}](${c.url})`).join("\n")}`,
    ].join("\n\n") + "\n"
  );
}
