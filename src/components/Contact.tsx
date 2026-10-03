import { useState } from "react";
import { ArrowRight, ArrowUpRight, Check, Copy } from "lucide-react";
import { Link, useLocation } from "react-router";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CONTACT, RESUME_URL, SOURCE_URL } from "@/data";
import { cn } from "@/lib/utils";

interface ContactProps {
  playedCount: number;
  total: number;
}

const LINKS = [
  ["Resume (PDF)", RESUME_URL],
  ["GitHub", CONTACT.github],
  ["LinkedIn", CONTACT.linkedin],
] as const;

const outlineButton =
  "h-auto rounded-xl border-2 border-primary-foreground bg-transparent px-6 py-4 text-base font-semibold text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground dark:border-primary-foreground dark:bg-transparent dark:hover:bg-primary-foreground/10";

function PlayedLine({ playedCount, total }: ContactProps) {
  if (playedCount === 0) {
    return (
      <a href="#work" className="font-mono text-[13px] underline-offset-4 hover:underline">
        haven't tried a demo yet? they're up top ↑
      </a>
    );
  }
  return (
    <span className="font-mono text-[13px]">
      {playedCount === total ? `you played all ${total} demos, thanks` : `you played ${playedCount} of ${total} demos`}
    </span>
  );
}

export default function Contact({ playedCount, total }: ContactProps) {
  const [copied, setCopied] = useState(false);
  const { pathname } = useLocation();

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked; the address stays visible on the mailto button.
    }
  };

  const lead = playedCount === 0 ? "Short on time?" : playedCount === total ? "Played them all?" : "Liked playing?";

  return (
    <section id="contact" tabIndex={-1} className="scroll-mt-20 outline-none bg-primary text-primary-foreground">
      <div className="wrap flex flex-col gap-9 pt-[110px] pb-12">
        <PlayedLine playedCount={playedCount} total={total} />
        <h2 className="heading-display text-[clamp(44px,6.2vw,88px)]">
          {lead} <span className="italic">Imagine what I'd build for your team.</span>
        </h2>
        <p className="m-0 text-lg">Open to full stack roles · based in Mumbai, India</p>
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
          <button
            type="button"
            onClick={copyEmail}
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), outlineButton)}
          >
            {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
            <span aria-live="polite">{copied ? "Copied" : "Copy email"}</span>
          </button>
          {pathname !== "/projects" && (
            <Link to="/projects" className={cn(buttonVariants({ variant: "outline", size: "lg" }), outlineButton)}>
              All projects <ArrowRight aria-hidden />
            </Link>
          )}
          {LINKS.map(([label, href]) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), outlineButton)}
            >
              {label} <ArrowUpRight aria-hidden />
            </a>
          ))}
        </div>
        <div className="flex flex-col gap-[18px]">
          <Separator className="bg-primary-foreground" />
          <footer className="flex flex-wrap justify-between gap-4 text-sm">
            <span>© {new Date().getFullYear()} Sahil Mohan Kolge</span>
            <a href={SOURCE_URL} target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline">
              Built with React, TypeScript &amp; Tailwind · source on GitHub ↗
            </a>
          </footer>
        </div>
      </div>
    </section>
  );
}
