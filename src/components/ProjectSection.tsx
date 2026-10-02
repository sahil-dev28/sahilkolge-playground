import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import type { Project } from "@/data";
import { cn } from "@/lib/utils";

type ProjectSectionProps = Omit<Project, "short"> & { children: ReactNode };

export default function ProjectSection({ id, meta, title, lead, bullets, liveUrl, image, children }: ProjectSectionProps) {
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
        <a
          href={liveUrl}
          target="_blank"
          rel="noreferrer"
          tabIndex={-1}
          aria-hidden="true"
          className="block overflow-hidden rounded-[14px] border transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_var(--shadow)]"
        >
          <img
            src={image}
            alt={`Screenshot of ${title}`}
            width={760}
            height={390}
            loading="lazy"
            decoding="async"
            className="aspect-[760/390] w-full object-cover object-top"
          />
        </a>
        <a
          href={liveUrl}
          target="_blank"
          rel="noreferrer"
          className={cn(buttonVariants({ variant: "link" }), "h-auto self-start p-0 text-[17px] font-semibold")}
        >
          Open live app <ArrowUpRight aria-hidden />
        </a>
      </div>
      {children}
    </section>
  );
}
