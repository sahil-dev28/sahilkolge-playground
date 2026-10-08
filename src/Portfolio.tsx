import { Link } from "react-router";
import { ALL_PROJECTS } from "@/all-projects";
import Intro from "@/components/Intro";
import ProjectRow from "@/components/ProjectRow";
import Section from "@/components/Section";
import { CERTS, PROJECTS, SKILLS } from "@/data";
import { usePageTitle } from "@/hooks/use-page-title";
import { HOME_TITLE } from "@/pages";

export default function Portfolio() {
  usePageTitle(HOME_TITLE);

  return (
    <main className="page flex flex-col gap-[72px] pt-14 pb-[72px]">
      <Intro />
      <Section id="work" label="selected work">
        <div className="border-b border-rule">
          {PROJECTS.map((p) => (
            <ProjectRow key={p.id} p={p} />
          ))}
        </div>
        <Link to="/projects" className="link self-start">
          All {ALL_PROJECTS.length} projects →
        </Link>
      </Section>
      <Section id="skills" label="skills">
        <ul className="m-0 flex list-none flex-col gap-1 p-0">
          {SKILLS.map((s) => (
            <li key={s.label}>
              <span className="text-muted">{s.label}:</span> {s.items.join(", ")}
            </li>
          ))}
        </ul>
      </Section>
      <Section id="certs" label="certifications">
        <ul className="m-0 flex list-disc flex-col gap-1 pl-5">
          {CERTS.map((c) => (
            <li key={c.name}>
              <a href={c.url} target="_blank" rel="noreferrer" className="link">
                {c.name}
              </a>
            </li>
          ))}
        </ul>
      </Section>
    </main>
  );
}
