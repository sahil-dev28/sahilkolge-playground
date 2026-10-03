import { Badge } from "@/components/ui/badge";
import { SKILLS } from "@/data";

export default function Skills() {
  return (
    <section id="skills" tabIndex={-1} className="wrap scroll-mt-20 outline-none flex flex-wrap gap-10 pt-24 pb-10">
      <h2 className="heading-display flex-[1_1_280px] text-[clamp(40px,5vw,64px)]">Toolbox</h2>
      <div className="flex min-w-0 flex-[2_1_560px] flex-col gap-7">
        {SKILLS.map((g) => (
          <div key={g.k} className="flex flex-col gap-3">
            <span className="font-mono text-xs text-muted-foreground">{g.k}</span>
            <div className="flex flex-wrap gap-2">
              {g.v.map((s) => (
                <Badge
                  key={s}
                  variant="outline"
                  className="h-auto rounded-full border-foreground bg-card px-3.5 py-1.5 text-[15px] font-normal motion-safe:hover:animate-wig"
                >
                  {s}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
