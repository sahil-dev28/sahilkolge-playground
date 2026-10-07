import { Link } from "react-router";
import type { RowLink } from "@/lib/links";

export default function LinkRow({ links, className = "" }: { links: RowLink[]; className?: string }) {
  return (
    <p className={`m-0 ${className}`}>
      {links.map((l, i) => (
        <span key={l.label}>
          {i > 0 && <span className="text-muted"> · </span>}
          {l.internal ? (
            <Link to={l.href} className="link">
              {l.label}
            </Link>
          ) : (
            <a href={l.href} className="link" {...(l.external ? { target: "_blank", rel: "noreferrer" } : {})}>
              {l.label}
            </a>
          )}
        </span>
      ))}
    </p>
  );
}
