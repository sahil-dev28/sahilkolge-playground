import { useRef, useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
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
  const pending = useRef<string | null>(null);
  const active = useActiveSection(NAV_IDS);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const home = pathname === "/";

  const goTo = (id: string) => {
    pending.current = id;
    setOpen(false);
  };

  // Jump only after the sheet has closed and released its scroll lock,
  // otherwise the lock restores the old scroll position.
  const handleClosed = (isOpen: boolean) => {
    const id = pending.current;
    if (isOpen || !id) return;
    pending.current = null;
    if (!home) {
      navigate(`/#${id}`);
      return;
    }
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (!el) return;
      history.replaceState(null, "", `#${id}`);
      el.scrollIntoView();
      el.focus({ preventScroll: true });
    });
  };

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
      <Sheet open={open} onOpenChange={setOpen} onOpenChangeComplete={handleClosed}>
        <SheetContent
          side="right"
          showCloseButton={false}
          finalFocus={() => pending.current === null}
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
                href={home ? `#${id}` : `/#${id}`}
                aria-current={active === id ? "location" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  goTo(id);
                }}
                className={cn(
                  "heading-display text-[44px] leading-[1.1] text-foreground",
                  active === id && "text-primary italic"
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
