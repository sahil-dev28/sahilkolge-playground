import { ArrowUpRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CONTACT, RESUME_URL } from "@/data";
import type { Mode } from "@/lib/storage";
import { cn } from "@/lib/utils";

interface ContactProps {
  playedCount: number;
  total: number;
  mode: Mode;
}

const LINKS = [
  ["Resume (PDF)", RESUME_URL],
  ["GitHub", CONTACT.github],
  ["LinkedIn", CONTACT.linkedin],
] as const;

export default function Contact({ playedCount, total, mode }: ContactProps) {
  return (
    <section id="contact" tabIndex={-1} className="scroll-mt-20 outline-none bg-primary text-primary-foreground">
      <div className="wrap flex flex-col gap-9 pt-[110px] pb-12">
        <span className="font-mono text-[13px]">
          you played {playedCount} of {total} demos
        </span>
        <h2 className="heading-display text-[clamp(56px,9vw,140px)] leading-[0.88] tracking-[-0.045em]">
          Liked playing? <span className="font-serif font-normal italic">Imagine what I'd build for your team.</span>
        </h2>
        <div className="flex flex-wrap gap-3">
          <a
            href={`mailto:${CONTACT.email}`}
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-auto rounded-xl bg-primary-foreground px-[26px] py-[18px] text-lg font-bold text-primary hover:bg-primary-foreground/90"
            )}
          >
            {CONTACT.email}
          </a>
          {LINKS.map(([label, href]) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-auto rounded-xl border-2 border-primary-foreground bg-transparent px-6 py-4 text-base font-semibold text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground dark:border-primary-foreground dark:bg-transparent dark:hover:bg-primary-foreground/10"
              )}
            >
              {label} <ArrowUpRight aria-hidden />
            </a>
          ))}
        </div>
        <div className="flex flex-col gap-[18px]">
          <Separator className="bg-primary-foreground" />
          <footer className="flex flex-wrap justify-between gap-4 text-sm">
            <span>© {new Date().getFullYear()} Sahil Mohan Kolge</span>
            <span>{mode} mode · your pick is saved for next time.</span>
          </footer>
        </div>
      </div>
    </section>
  );
}
