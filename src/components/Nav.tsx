import { Moon, Sun } from "lucide-react";
import MobileMenu from "@/components/MobileMenu";
import SectionLink from "@/components/SectionLink";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { CONTACT, NAV_LINKS, RESUME_URL } from "@/data";
import { cn } from "@/lib/utils";

interface NavProps {
  dark: boolean;
  onToggleMode: () => void;
  playedCount: number;
  total: number;
}

function Logo() {
  return (
    <SectionLink id="top" className="text-lg font-bold tracking-tight whitespace-nowrap text-foreground hover:opacity-80">
      sahil kolge<span className="text-primary">.</span>
    </SectionLink>
  );
}

export default function Nav({ dark, onToggleMode, playedCount, total }: NavProps) {
  return (
    <header>
      <div className="wrap flex h-[74px] items-center lg:hidden">
        <Logo />
      </div>
      <MobileMenu dark={dark} onToggleMode={onToggleMode} playedCount={playedCount} total={total} />
      <nav className="fixed top-3 left-1/2 z-50 hidden h-[54px] -translate-x-1/2 items-center gap-8 rounded-full border bg-glass pr-2.5 pl-6 whitespace-nowrap shadow-[0_10px_30px_-15px_var(--shadow)] backdrop-blur-md lg:flex">
        <Logo />
        <div className="flex gap-5 text-sm">
          {NAV_LINKS.map(({ id, label }) => (
            <SectionLink key={id} id={id} className="px-1 py-1.5 text-foreground hover:opacity-70">
              {label}
            </SectionLink>
          ))}
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Sun className="size-4" aria-hidden />
          <Switch
            checked={dark}
            onCheckedChange={onToggleMode}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          />
          <Moon className="size-4" aria-hidden />
        </div>
        <div className="flex items-center gap-2.5">
          <Badge className="hidden h-[34px] rounded-full bg-foreground px-3 font-mono text-xs font-normal text-background xl:inline-flex">
            played {playedCount}/{total}
          </Badge>
          <a
            href={RESUME_URL}
            target="_blank"
            rel="noreferrer"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-[34px] rounded-full border-line-2 bg-card px-3.5 text-sm font-semibold dark:border-line-2 dark:bg-card dark:hover:bg-muted"
            )}
          >
            Resume
          </a>
          <a
            href={`mailto:${CONTACT.email}`}
            className={buttonVariants({ className: "h-[34px] rounded-full px-3.5 text-sm font-semibold" })}
          >
            Hire me
          </a>
        </div>
      </nav>
    </header>
  );
}
