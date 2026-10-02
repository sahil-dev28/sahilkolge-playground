import { useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { CONTACT, NAV_IDS, NAV_LINKS, RESUME_URL } from "@/data";
import { useActiveSection } from "@/hooks/use-active-section";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  dark: boolean;
  onToggleMode: () => void;
  playedCount: number;
  total: number;
}

export default function MobileMenu({ dark, onToggleMode, playedCount, total }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const active = useActiveSection(NAV_IDS);

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="fixed top-3.5 right-4 z-50 inline-flex size-[46px] items-center justify-center rounded-full bg-foreground text-background shadow-[0_10px_24px_-10px_var(--shadow)] lg:hidden"
      >
        <Menu className="size-5" />
      </button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          showCloseButton={false}
          className="h-dvh gap-0 bg-background px-6 pt-[18px] pb-7 text-base text-foreground shadow-none data-[side=right]:w-full data-[side=right]:border-l-0 data-[side=right]:sm:max-w-none"
        >
          <div className="flex h-11 items-center justify-between">
            <SheetTitle className="text-lg font-bold tracking-tight">
              sahil kolge<span className="text-primary">.</span>
            </SheetTitle>
            <SheetClose
              aria-label="Close menu"
              className="inline-flex size-11 items-center justify-center rounded-full border"
            >
              <X className="size-5" />
            </SheetClose>
          </div>
          <p className="mt-7 font-mono text-xs text-muted-foreground">
            played {playedCount}/{total} demos
          </p>
          <nav className="mt-3.5 flex flex-col gap-1.5">
            {NAV_LINKS.map(({ id, label }, i) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => setOpen(false)}
                className={cn(
                  "heading-display text-[52px] leading-[1.05] text-foreground",
                  active === id && "font-serif font-normal tracking-[-0.02em] text-primary italic [font-stretch:100%]"
                )}
              >
                {label}
                <sup className="ml-1.5 font-mono text-xs font-normal tracking-normal text-muted-foreground not-italic">
                  0{i + 1}
                </sup>
              </a>
            ))}
          </nav>
          <div className="mt-auto flex flex-col gap-3.5">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Sun className="size-4" aria-hidden />
              <Switch
                checked={dark}
                onCheckedChange={onToggleMode}
                aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
              />
              <Moon className="size-4" aria-hidden />
            </div>
            <div className="flex gap-2.5">
              <a
                href={RESUME_URL}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-12 flex-1 rounded-xl border-line-2 bg-card text-base font-semibold dark:border-line-2 dark:bg-card dark:hover:bg-muted"
                )}
              >
                Resume (PDF)
              </a>
              <a
                href={`mailto:${CONTACT.email}`}
                className={buttonVariants({ className: "h-12 flex-1 rounded-xl text-base font-semibold" })}
              >
                Hire me
              </a>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
