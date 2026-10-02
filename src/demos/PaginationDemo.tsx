import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { CodeBlock } from "./CodeBlock";
import { DemoCard } from "./DemoCard";
import type { DemoProps } from "./types";

type Strategy = "offset" | "keyset";

const PER_PAGE = 20;
const MAX_PAGE = 5000;

export default function PaginationDemo({ onPlay }: DemoProps) {
  const [mode, setMode] = useState<Strategy>("offset");
  const [page, setPage] = useState(1200);

  const isOffset = mode === "offset";
  const skip = (page - 1) * PER_PAGE;
  const scanned = isOffset ? skip + PER_PAGE : PER_PAGE;
  const maxScan = MAX_PAGE * PER_PAGE;
  const pct = isOffset ? Math.max(2, Math.round((Math.log10(scanned) / Math.log10(maxScan)) * 100)) : 4;

  const query = isOffset
    ? `db.products\n  .find({})\n  .sort({ _id: 1 })\n  .skip(${skip.toLocaleString("en-US")})\n  .limit(20)`
    : "db.products\n  .find({ _id: { $gt: lastSeenId } })\n  .sort({ _id: 1 })\n  .limit(20)";

  const pick = (values: readonly string[]) => {
    const next = values[0];
    if (next !== "offset" && next !== "keyset") return;
    setMode(next);
    onPlay();
  };

  const toggle = (
    <ToggleGroup
      value={[mode]}
      onValueChange={pick}
      spacing={1.5}
      aria-label="Pagination strategy"
      className="rounded-[10px] bg-panel-2 p-1"
    >
      {(["offset", "keyset"] as const).map((m) => (
        <ToggleGroupItem
          key={m}
          value={m}
          className="h-9 rounded-lg px-3.5 font-mono text-xs text-panel-muted hover:bg-transparent hover:text-panel-foreground aria-pressed:bg-mark aria-pressed:text-on-mark"
        >
          {m}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );

  return (
    <DemoCard dark title="Why keyset pagination?" action={toggle}>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between font-mono text-[13px] text-panel-muted">
          <Label htmlFor="pg" className="font-mono text-[13px] font-normal text-panel-muted">
            jump to page
          </Label>
          <strong className="font-normal text-mark">page {page}</strong>
        </div>
        <Slider
          id="pg"
          aria-label="jump to page"
          min={1}
          max={MAX_PAGE}
          step={1}
          value={[page]}
          onValueChange={(v: number | readonly number[]) => {
            const n = typeof v === "number" ? v : v[0];
            setPage(Number(n) || 1);
            onPlay();
          }}
          className="[&_[data-slot=slider-range]]:bg-primary [&_[data-slot=slider-track]]:bg-panel-2"
        />
      </div>

      <CodeBlock>{query}</CodeBlock>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between font-mono text-xs text-panel-muted">
          <span>documents the database walks through</span>
          <span className="text-panel-foreground">{scanned.toLocaleString("en-US")}</span>
        </div>
        <Progress
          value={pct}
          aria-label="documents scanned"
          className={cn(
            "[&_[data-slot=progress-indicator]]:transition-[width,background-color] [&_[data-slot=progress-indicator]]:duration-300 [&_[data-slot=progress-track]]:h-3.5 [&_[data-slot=progress-track]]:rounded-lg [&_[data-slot=progress-track]]:bg-panel-2",
            isOffset ? "[&_[data-slot=progress-indicator]]:bg-meter-bad" : "[&_[data-slot=progress-indicator]]:bg-meter-good"
          )}
        />
        <span className="text-sm text-panel-muted">
          {isOffset
            ? "Offset makes the database skip every row before your page. Deep pages get slower."
            : "Keyset jumps straight to the last seen id. Page 1 and page 5,000 cost the same."}
        </span>
      </div>
    </DemoCard>
  );
}
