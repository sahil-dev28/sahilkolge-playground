import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { CodeBlock } from "./CodeBlock";
import { DemoCard } from "./DemoCard";
import type { DemoProps } from "./types";

const AX_CODES = [200, 401, 500] as const;
type AxCode = (typeof AX_CODES)[number];

const AX_STEPS = [
  "request interceptor adds withCredentials",
  "API call to /api/orders",
  "response interceptor normalizes the result",
  "UI gets one clean shape",
];

const AX_OUTPUT: Record<AxCode, string> = {
  200: "{ ok: true, data: { orders: [...] } }",
  401: "{ ok: false, code: 'UNAUTHORIZED',\n  message: 'Session expired. Please log in again.' }",
  500: "{ ok: false, code: 'SERVER_ERROR',\n  message: 'Something broke on our side. Try again.' }",
};

const toCode = (v: string | undefined): AxCode | null => AX_CODES.find((c) => String(c) === v) ?? null;

export default function AxiosDemo({ onPlay }: DemoProps) {
  const [status, setStatus] = useState<AxCode | null>(null);

  return (
    <DemoCard dark title="Send a request through the interceptors">
      <ToggleGroup
        aria-label="Server response"
        value={status === null ? [] : [String(status)]}
        onValueChange={(values: readonly string[]) => {
          const next = toCode(values[0]);
          if (next === null) return;
          setStatus(next);
          onPlay();
        }}
        className="flex-wrap"
      >
        {AX_CODES.map((code) => (
          <ToggleGroupItem
            key={code}
            value={String(code)}
            variant="outline"
            className="h-10 rounded-[10px] border-step-line bg-transparent px-3.5 font-mono text-xs font-normal text-panel-foreground hover:bg-panel-2 hover:text-panel-foreground aria-pressed:border-mark aria-pressed:bg-mark aria-pressed:text-on-mark"
          >
            server says {code}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <ol className="m-0 flex list-none flex-col gap-2 p-0">
        {AX_STEPS.map((label, i) => {
          const lit = status !== null;
          const failed = lit && status !== 200 && i === 1;
          return (
            <li
              key={label}
              className={cn(
                "flex items-center gap-3 rounded-[10px] border border-step-line px-3.5 py-2.5 text-code-muted",
                lit && "text-panel-foreground",
                failed ? "border-step-fail" : lit && "border-step-ok"
              )}
            >
              <span className="font-mono text-xs">0{i + 1}</span>
              <span>{label}</span>
            </li>
          );
        })}
      </ol>

      <CodeBlock>{status === null ? "// pick a server response above" : AX_OUTPUT[status]}</CodeBlock>
    </DemoCard>
  );
}
