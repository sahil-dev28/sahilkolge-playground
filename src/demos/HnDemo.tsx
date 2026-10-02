import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CodeBlock } from "./CodeBlock";
import { DemoCard } from "./DemoCard";
import type { DemoProps } from "./types";

const HN_TAGS = ["story", "comment", "show_hn", "ask_hn"] as const;
type HnTag = (typeof HN_TAGS)[number];
type Sort = "relevance" | "date";

const isTag = (v: string | undefined): v is HnTag => HN_TAGS.includes(v as HnTag);

export default function HnDemo({ onPlay }: DemoProps) {
  const [query, setQuery] = useState("react");
  const [tag, setTag] = useState<HnTag>("story");
  const [sort, setSort] = useState<Sort>("relevance");
  const [page, setPage] = useState(0);

  const endpoint = sort === "date" ? "search_by_date" : "search";
  const url = `hn.algolia.com/api/v1/${endpoint}?query=${encodeURIComponent(query)}&tags=${tag}&hitsPerPage=20&page=${page}`;
  const queryKey = `['stories', { query: '${query}', tag: '${tag}', sort: '${sort}', page: ${page} }]`;

  return (
    <DemoCard title="Build the query yourself" note="page resets on filter change">
      <div className="flex flex-col gap-2">
        <Label htmlFor="hnq" className="text-sm font-normal text-muted-foreground">
          search term
        </Label>
        <Input
          id="hnq"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(0);
            onPlay();
          }}
          className="h-auto rounded-[10px] border-line-2 bg-muted px-3.5 py-3 text-base md:text-base"
        />
      </div>

      <ToggleGroup
        aria-label="Tag"
        value={[tag]}
        onValueChange={(values: readonly string[]) => {
          const next = values[0];
          if (!isTag(next)) return;
          setTag(next);
          setPage(0);
          onPlay();
        }}
        className="flex-wrap"
      >
        {HN_TAGS.map((t) => (
          <ToggleGroupItem
            key={t}
            value={t}
            variant="outline"
            className="h-10 rounded-full border-line-2 bg-card px-3.5 font-mono text-xs font-normal aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground"
          >
            {t}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="secondary"
          className="h-10 rounded-full bg-foreground px-3.5 text-sm font-normal text-background hover:bg-foreground/90"
          onClick={() => {
            setSort(sort === "relevance" ? "date" : "relevance");
            setPage(0);
            onPlay();
          }}
        >
          sort: {sort}
        </Button>
        <Button
          variant="outline"
          className="h-10 rounded-full border-line-2 bg-card px-3.5 text-sm font-normal dark:border-line-2 dark:bg-card dark:hover:bg-muted"
          onClick={() => {
            setPage(page + 1);
            onPlay();
          }}
        >
          next page → {page}
        </Button>
      </div>

      <CodeBlock className="text-[12.5px]">
        <span className="text-code-muted">GET </span>
        {url}
      </CodeBlock>
      <div className="font-mono text-xs text-muted-foreground">queryKey: {queryKey}</div>
    </DemoCard>
  );
}
