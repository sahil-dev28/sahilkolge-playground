import LinkRow from "@/components/LinkRow";
import { renderInline } from "@/lib/inline-code";
import { projectLinks } from "@/lib/links";
import type { Project } from "@/data";

export default function ProjectRow({ p }: { p: Project }) {
  return (
    <article id={p.id} tabIndex={-1} className="flex scroll-mt-6 flex-col gap-1.5 border-t border-rule py-6 outline-none">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="m-0 text-lg font-semibold">{p.title}</h3>
        <span className="font-mono text-xs text-muted">{p.year}</span>
      </div>
      <p className="m-0">{renderInline(p.oneLine)}</p>
      <p className="m-0">{renderInline(p.hardPart)}</p>
      <p className="m-0 font-mono text-xs text-muted">{p.stack.join(" · ")}</p>
      <LinkRow links={projectLinks(p.liveUrl, p.repoUrl, p.caseStudyUrl)} className="text-[15px]" />
    </article>
  );
}
