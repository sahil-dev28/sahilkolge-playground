import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import type { Project } from "@/data";
import { cn } from "@/lib/utils";

type ProjectSectionProps = Omit<Project, "short"> & { children: ReactNode };

export default function ProjectSection({ id, meta, title, lead, bullets, liveUrl, repoUrl, children }: ProjectSectionProps) {
  return (
    <section
      id={id}
      className="reveal grid items-start scroll-mt-20 grid-cols-[repeat(auto-fit,minmax(min(460px,100%),1fr))] gap-10 border-b py-12 last:border-b-0"
    >
      <div className="flex flex-col gap-[18px]">
        <div className="font-mono text-xs text-muted-foreground">{meta}</div>
        <h2 className="heading-display text-5xl sm:text-[64px]">{title}</h2>
        <p className="m-0 text-[19px] text-ink-2">{lead}</p>
        <ul className="m-0 flex list-disc flex-col gap-2 pl-5 text-base text-ink-2">
          {bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {[
            ["Open live app", liveUrl],
            ["Source code", repoUrl],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "link" }), "h-auto p-0 text-[17px] font-semibold")}
            >
              {label} <ArrowUpRight aria-hidden />
            </a>
          ))}
        </div>
      </div>
      {children}
    </section>
  );
}
