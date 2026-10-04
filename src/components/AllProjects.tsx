import { ALL_PROJECTS, type ProjectEntry } from "@/all-projects";
import LinkRow, { projectLinks } from "@/components/LinkRow";
import Section from "@/components/Section";
import { usePageTitle } from "@/hooks/use-page-title";

function Row({ p }: { p: ProjectEntry }) {
  const app = p.group === "app";
  return (
    <li className={`flex flex-col gap-1 border-t border-rule ${app ? "py-5" : "py-3 text-[15px]"}`}>
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="m-0 font-semibold">{p.name}</h3>
        <span className="font-mono text-xs text-muted">{p.year}</span>
      </div>
      <p className={`m-0 ${app ? "" : "text-muted"}`}>{p.description}</p>
      <p className="m-0 font-mono text-xs text-muted">{p.stack.join(" · ")}</p>
      <LinkRow links={projectLinks(p.liveUrl, p.repoUrl, p.caseStudyUrl)} className="text-[15px]" />
    </li>
  );
}

function Group({ id, label, items }: { id: string; label: string; items: ProjectEntry[] }) {
  return (
    <Section id={id} label={label}>
      <ul className="m-0 list-none border-b border-rule p-0">
        {items.map((p) => (
          <Row key={p.name} p={p} />
        ))}
      </ul>
    </Section>
  );
}

export default function AllProjects() {
  usePageTitle("All projects · Sahil Kolge");
  const apps = ALL_PROJECTS.filter((p) => p.group === "app");
  const practice = ALL_PROJECTS.filter((p) => p.group === "practice");
  const years = ALL_PROJECTS.map((p) => p.year).sort();
  const span = years[0] === years[years.length - 1] ? years[0] : `${years[0]}–${years[years.length - 1]}`;

  return (
    <main className="page flex flex-col gap-[72px] pt-14 pb-[72px]">
      <div className="flex flex-col gap-2">
        <h1 className="m-0 text-2xl leading-[1.2] font-semibold min-[480px]:text-[30px]">All projects</h1>
        <p className="m-0 text-muted">
          {apps.length} apps and {practice.length} practice builds, {span}.
        </p>
      </div>
      <Group id="apps" label="apps" items={apps} />
      <Group id="practice" label="practice" items={practice} />
    </main>
  );
}
