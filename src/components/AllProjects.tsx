import { Link } from "react-router";
import { ALL_PROJECTS, type ProjectEntry } from "@/all-projects";
import { usePageTitle } from "@/hooks/use-page-title";
import { cn } from "@/lib/utils";

const linkClass = "text-primary underline-offset-4 hover:underline";

function External({ href, children }: { href: string; children: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={linkClass}>
      {children} ↗
    </a>
  );
}

function Links({ p }: { p: ProjectEntry }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold whitespace-nowrap sm:justify-end">
      {p.demoId && (
        <Link to={`/#${p.demoId}`} className={linkClass}>
          Demo
        </Link>
      )}
      <External href={p.liveUrl}>Live</External>
      <External href={p.repoUrl}>Code</External>
      {p.caseStudyUrl && <External href={p.caseStudyUrl}>Case study</External>}
    </div>
  );
}

function Row({ p }: { p: ProjectEntry }) {
  const app = p.group === "app";
  const stack = <span className="font-mono text-xs text-muted-foreground">{p.stack.join(" · ")}</span>;
  return (
    <li
      className={cn(
        "grid gap-x-6 gap-y-1.5 border-t sm:grid-cols-[56px_1fr_auto] sm:items-baseline",
        app ? "py-5" : "py-3 text-[15px]"
      )}
    >
      <span className="font-mono text-xs text-muted-foreground">{p.year}</span>
      {app ? (
        <div className="flex flex-col gap-1">
          <strong className="text-lg font-semibold">{p.name}</strong>
          <p className="m-0 text-ink-2">{p.description}</p>
          {stack}
        </div>
      ) : (
        <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
          <strong className="font-medium">{p.name}</strong>
          <span className="text-muted-foreground">{p.description}</span>
          {stack}
        </div>
      )}
      <Links p={p} />
    </li>
  );
}

function Group({ label, items }: { label: string; items: ProjectEntry[] }) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="m-0 font-mono text-[13px] font-normal text-muted-foreground">{label}</h2>
      <ul className="m-0 list-none border-b p-0">
        {items.map((p) => (
          <Row key={p.name} p={p} />
        ))}
      </ul>
    </section>
  );
}

export default function AllProjects() {
  usePageTitle("All projects · Sahil Kolge");
  const apps = ALL_PROJECTS.filter((p) => p.group === "app");
  const practice = ALL_PROJECTS.filter((p) => p.group === "practice");
  const years = ALL_PROJECTS.map((p) => p.year).sort();
  const span = years[0] === years[years.length - 1] ? years[0] : `${years[0]}–${years[years.length - 1]}`;

  return (
    <main className="wrap flex flex-col gap-12 pt-10 pb-24 lg:pt-36">
      <div className="flex flex-col gap-3">
        <h1 className="heading-display text-[clamp(40px,5vw,64px)]">
          All <span className="text-primary italic">projects</span>
        </h1>
        <p className="m-0 text-lg text-ink-2">
          {apps.length} apps and {practice.length} practice builds, {span}.
        </p>
      </div>
      <Group label="apps" items={apps} />
      <Group label="practice" items={practice} />
    </main>
  );
}
