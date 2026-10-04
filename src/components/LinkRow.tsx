export interface RowLink {
  label: string;
  href: string;
  external?: boolean;
}

export function projectLinks(liveUrl: string, repoUrl: string, caseStudyUrl?: string): RowLink[] {
  const links: RowLink[] = [
    { label: "Live", href: liveUrl, external: true },
    { label: "Code", href: repoUrl, external: true },
  ];
  if (caseStudyUrl) links.push({ label: "Case study", href: caseStudyUrl, external: true });
  return links;
}

export default function LinkRow({ links, className = "" }: { links: RowLink[]; className?: string }) {
  return (
    <p className={`m-0 ${className}`}>
      {links.map((l, i) => (
        <span key={l.label}>
          {i > 0 && <span className="text-muted"> · </span>}
          <a href={l.href} className="link" {...(l.external ? { target: "_blank", rel: "noreferrer" } : {})}>
            {l.label}
          </a>
        </span>
      ))}
    </p>
  );
}
