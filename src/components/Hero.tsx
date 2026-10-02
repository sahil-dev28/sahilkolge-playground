import { Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { PROJECTS, type Played } from "@/data";
import { cn } from "@/lib/utils";

interface HeroProps {
  visits: number;
  played: Played;
}

export default function Hero({ visits, played }: HeroProps) {
  const greeting =
    visits > 1
      ? `welcome back · visit #${visits} · open to frontend roles`
      : "open to frontend roles · new here? start with 01";

  return (
    <section id="top" className="wrap flex flex-col gap-8 pt-24 pb-18">
      <div className="flex flex-wrap items-center gap-2.5 font-mono text-[13px] text-muted-foreground motion-safe:animate-rise motion-safe:[animation-delay:50ms]">
        <span className="size-[9px] rounded-full bg-live motion-safe:animate-dot" />
        <span>{greeting}</span>
      </div>
      <h1 className="heading-display max-w-[1150px] text-[clamp(64px,9.6vw,152px)] leading-[0.88] tracking-[-0.045em] motion-safe:animate-rise motion-safe:[animation-delay:200ms]">
        Don't read about my projects.{" "}
        <span className="font-serif font-normal tracking-[-0.02em] text-primary italic [font-stretch:100%]">
          Play with them.
        </span>
      </h1>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(380px,100%),1fr))] items-end gap-8 motion-safe:animate-rise motion-safe:[animation-delay:350ms]">
        <p className="m-0 max-w-[600px] text-[21px] leading-normal text-pretty">
          I'm <strong>Sahil Kolge</strong>, a frontend developer who builds scalable React and Next.js apps, and the
          Node APIs under them. Every project below has a small live demo of the{" "}
          <span className="hl-mark">hardest problem I solved in it</span>.
        </p>
        <div className="flex flex-wrap justify-start gap-2.5 sm:justify-end">
          {PROJECTS.map((p, i) => {
            const done = Boolean(played[p.id]);
            return (
              <a
                key={p.id}
                href={`#${p.id}`}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-11 rounded-full border-line-2 bg-card px-4 text-[15px] font-semibold transition-transform hover:-translate-y-0.5 dark:border-line-2 dark:bg-card dark:hover:bg-muted",
                  done &&
                    "border-foreground bg-foreground text-background hover:bg-foreground/90 hover:text-background dark:border-foreground dark:bg-foreground dark:hover:bg-foreground/90"
                )}
              >
                {done && <Check aria-hidden />}0{i + 1} {p.short}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
