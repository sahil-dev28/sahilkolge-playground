import { useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { DemoProps } from "./types";

type FilterKey = "price" | "city" | "sort";

interface FilterGroup {
  key: FilterKey;
  label: string;
  opts: string[];
}

const UE_GROUPS: FilterGroup[] = [
  { key: "price", label: "max price", opts: ["any", "50L", "1Cr", "2Cr"] },
  { key: "city", label: "city", opts: ["any", "Mumbai", "Pune", "Bengaluru"] },
  { key: "sort", label: "sort by", opts: ["newest", "price_asc", "price_desc"] },
];

export default function UrbanDemo({ onPlay }: DemoProps) {
  const [filters, setFilters] = useState<Record<FilterKey, string>>({ price: "any", city: "any", sort: "newest" });
  const [history, setHistory] = useState(1);

  const qs: string[] = [];
  if (filters.price !== "any") qs.push(`maxPrice=${filters.price}`);
  if (filters.city !== "any") qs.push(`city=${filters.city.toLowerCase()}`);
  qs.push(`sort=${filters.sort}`);

  return (
    <Card className="gap-0 rounded-[20px] py-0 text-[17px] shadow-none ring-border transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_var(--shadow)]">
      <div className="flex items-center gap-2.5 border-b bg-muted px-3.5 py-3">
        <span className="font-mono text-[11px] whitespace-nowrap text-muted-foreground">history {history}</span>
        <div className="grow rounded-lg border bg-card px-3 py-2 font-mono text-[12.5px] break-all">
          urban-estate.app/properties<span className="text-primary">?{qs.join("&")}</span>
        </div>
      </div>
      <CardContent className="flex flex-col gap-4 px-6 py-[22px]">
        <CardTitle className="text-xl font-bold">Change a filter, watch the URL</CardTitle>
        {UE_GROUPS.map((g) => (
          <div key={g.key} className="flex flex-col gap-2">
            <span id={`ue-${g.key}`} className="text-[13px] text-muted-foreground">
              {g.label}
            </span>
            <ToggleGroup
              aria-labelledby={`ue-${g.key}`}
              value={[filters[g.key]]}
              onValueChange={(values: readonly string[]) => {
                const next = values[0];
                if (!next) return;
                setFilters((f) => ({ ...f, [g.key]: next }));
                setHistory((h) => h + 1);
                onPlay();
              }}
              className="flex-wrap"
            >
              {g.opts.map((v) => (
                <ToggleGroupItem
                  key={v}
                  value={v}
                  variant="outline"
                  className="h-10 rounded-[10px] border-line-2 bg-card px-3.5 text-sm font-normal aria-pressed:border-foreground aria-pressed:bg-foreground aria-pressed:text-background"
                >
                  {v}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
