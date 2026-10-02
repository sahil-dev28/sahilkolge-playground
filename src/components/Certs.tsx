import { ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { CERTS } from "@/data";

export default function Certs() {
  return (
    <section id="certs" className="wrap flex flex-col gap-7 pt-14 pb-24">
      <h2 className="heading-display text-[clamp(44px,6vw,80px)]">
        Certified, <span className="font-serif font-normal text-primary italic">and still learning</span>
      </h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(210px,100%),1fr))] gap-3.5">
        {CERTS.map((c) => (
          <a
            key={c.name}
            href={c.url}
            target="_blank"
            rel="noreferrer"
            className="group rounded-2xl text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <Card className="h-full rounded-2xl p-[22px] shadow-none ring-border transition-[translate,box-shadow] duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_18px_40px_-18px_var(--shadow)]">
              <CardContent className="flex flex-col gap-7 p-0">
                <span className="flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
                  certificate <ArrowUpRight className="size-3" aria-hidden />
                </span>
                <strong className="text-xl leading-tight font-bold">{c.name}</strong>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </section>
  );
}
