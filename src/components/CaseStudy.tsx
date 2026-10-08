import type { ReactNode } from "react";
import { Link, Navigate, useParams } from "react-router";
import { getCaseStudy, getNextCaseStudy } from "@/case-studies";
import type { Screen } from "@/case-studies/types";
import LinkRow from "@/components/LinkRow";
import { projectLinks } from "@/lib/links";
import { PROJECTS } from "@/data";
import { HOME_TITLE, usePageTitle } from "@/hooks/use-page-title";

function Block({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="grid gap-2 min-[640px]:grid-cols-[112px_1fr] min-[640px]:gap-6">
      <h2 className="section-label min-[640px]:pt-[3px]">{label}</h2>
      <div className="flex min-w-0 flex-col gap-3">{children}</div>
    </section>
  );
}

function Figure({ s, n }: { s: Screen; n: number }) {
  const hero = s.placement === "hero";
  return (
    <figure className="m-0 flex flex-col gap-2">
      <a href={s.src} target="_blank" rel="noreferrer" aria-label={`Open full size: ${s.alt}`}>
        <img
          src={s.src}
          alt={s.alt}
          width={s.width}
          height={s.height}
          loading={hero ? "eager" : "lazy"}
          decoding="async"
          className="block h-auto w-full border border-rule"
        />
      </a>
      <figcaption className="font-mono text-[13px] text-muted">
        fig. {n} · {s.caption}
      </figcaption>
    </figure>
  );
}

const back = (
  <Link to="/projects" className="link self-start text-[15px]">
    ← All projects
  </Link>
);

export default function CaseStudy() {
  const { slug } = useParams();
  const study = getCaseStudy(slug);
  const project = study && PROJECTS.find((p) => p.id === study.projectId);
  usePageTitle(project ? `${project.title} · Sahil Kolge` : HOME_TITLE);

  if (!study || !project) return <Navigate to="/" replace />;

  const figures = (placement: Screen["placement"]) =>
    study.screens.map((s, i) => (s.placement === placement ? <Figure key={s.src} s={s} n={i + 1} /> : null));
  const meta = [...study.meta, { label: "stack", value: project.stack.join(" · ") }];
  const next = getNextCaseStudy(study.slug);
  const nextTitle = next && PROJECTS.find((p) => p.id === next.projectId)?.title;

  return (
    <main className="mx-auto flex max-w-[640px] flex-col gap-10 px-6 pt-14 pb-[72px] lg:max-w-[1040px]">
      {back}

      <div className="flex flex-col gap-12 lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-16">
        {/* Project facts first on mobile; a sticky panel on the right on desktop. */}
        <aside className="flex flex-col gap-6 lg:sticky lg:top-8 lg:col-start-2 lg:row-start-1 lg:self-start">
          <header className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-4">
              <h1 className="m-0 text-2xl leading-[1.2] font-semibold min-[480px]:text-[30px] lg:text-2xl">{project.title}</h1>
              <span className="font-mono text-xs text-muted">{project.year}</span>
            </div>
            <p className="m-0">{project.oneLine}</p>
            <p className="m-0 font-mono text-xs text-muted">{study.tags.join(" · ")}</p>
            <LinkRow links={projectLinks(project.liveUrl, project.repoUrl)} className="text-[15px]" />
          </header>

          <dl className="m-0 grid grid-cols-[88px_1fr] gap-x-4 gap-y-1 border-y border-rule py-4">
            {meta.map((m) => (
              <div key={m.label} className="contents">
                <dt className="section-label pt-[3px]">{m.label}</dt>
                <dd className="m-0">{m.value}</dd>
              </div>
            ))}
          </dl>
        </aside>

        <div className="flex min-w-0 flex-col gap-12 lg:col-start-1 lg:row-start-1">
          {figures("hero")}

          <Block label="problem">
            <p className="m-0">{study.problem}</p>
          </Block>
          <Block label="approach">
            <p className="m-0">{study.approach}</p>
          </Block>
          <Block label="architecture">
            <dl className="m-0 flex flex-col gap-3">
              {study.architecture.map((a) => (
                <div key={a.label}>
                  <dt className="font-mono text-[13px] text-muted">{a.label}</dt>
                  <dd className="m-0">{a.items.join(" · ")}</dd>
                </div>
              ))}
            </dl>
          </Block>

          {figures("middle")}

          <Block label="hard problems">
            <ol className="m-0 flex list-none flex-col gap-6 p-0">
              {study.hardProblems.map((h, i) => (
                <li key={h.title} className="flex flex-col gap-1">
                  <h3 className="m-0 text-[17px] font-semibold">
                    <span className="mr-3 font-mono text-[13px] font-normal text-muted">{String(i + 1).padStart(2, "0")}</span>
                    {h.title}
                  </h3>
                  <p className="m-0">
                    <span className="text-muted">Problem: </span>
                    {h.problem}
                  </p>
                  <p className="m-0">
                    <span className="text-muted">Fix: </span>
                    {h.fix}
                  </p>
                </li>
              ))}
            </ol>
          </Block>

          {figures("end")}

          <Block label="outcome">
            <p className="m-0">{study.outcome}</p>
          </Block>

          <nav className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t border-rule pt-6">
            {back}
            {next && nextTitle && (
              <Link to={`/work/${next.slug}`} className="link text-[15px]">
                Next: {nextTitle} →
              </Link>
            )}
          </nav>
        </div>
      </div>
    </main>
  );
}
