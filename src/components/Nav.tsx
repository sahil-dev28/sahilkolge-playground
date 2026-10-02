import { Moon, Sun } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { CONTACT, RESUME_URL } from "@/data";
import { cn } from "@/lib/utils";

interface NavProps {
  dark: boolean;
  onToggleMode: () => void;
  playedCount: number;
  total: number;
}

const LINKS = [
  ["#work", "Playground"],
  ["#about", "About"],
  ["#skills", "Skills"],
  ["#certs", "Certifications"],
  ["#contact", "Contact"],
] as const;

export default function Nav({ dark, onToggleMode, playedCount, total }: NavProps) {
  return (
    <header className="sticky top-0 z-10 border-b bg-glass backdrop-blur-md">
      <nav className="wrap flex flex-wrap items-center justify-between gap-4 py-3">
        <a href="#top" className="text-lg font-bold tracking-tight text-foreground hover:opacity-80">
          sahil kolge<span className="text-primary">.</span>
        </a>
        <div className="flex flex-wrap gap-[22px] text-[15px]">
          {LINKS.map(([href, label]) => (
            <a key={href} href={href} className="text-foreground hover:opacity-80">
              {label}
            </a>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Sun className="size-4" aria-hidden />
            <Switch
              checked={dark}
              onCheckedChange={onToggleMode}
              aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            />
            <Moon className="size-4" aria-hidden />
          </div>
          <Badge className="h-auto rounded-full bg-foreground px-3 py-2 font-mono text-xs font-normal text-background">
            played {playedCount}/{total}
          </Badge>
          <a
            href={RESUME_URL}
            target="_blank"
            rel="noreferrer"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-9 rounded-[10px] border-line-2 bg-card px-4 text-[15px] font-semibold dark:border-line-2 dark:bg-card dark:hover:bg-muted"
            )}
          >
            Resume
          </a>
          <a
            href={`mailto:${CONTACT.email}`}
            className={buttonVariants({ className: "h-9 rounded-[10px] px-4 text-[15px] font-semibold" })}
          >
            Hire me
          </a>
        </div>
      </nav>
    </header>
  );
}
