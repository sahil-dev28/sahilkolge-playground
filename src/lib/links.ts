export interface RowLink {
  label: string;
  href: string;
  external?: boolean;
  // Rendered as a router link: same tab, no page reload.
  internal?: boolean;
}

export function projectLinks(liveUrl: string, repoUrl: string, caseStudyUrl?: string): RowLink[] {
  const links: RowLink[] = [
    { label: "Live", href: liveUrl, external: true },
    { label: "Code", href: repoUrl, external: true },
  ];
  if (caseStudyUrl) {
    links.push(
      caseStudyUrl.startsWith("/")
        ? { label: "Case study", href: caseStudyUrl, internal: true }
        : { label: "Case study", href: caseStudyUrl, external: true },
    );
  }
  return links;
}
