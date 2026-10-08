import type { ReactNode } from "react";

// Renders copy with `backticked` terms in the mono font. Odd parts of the split are code.
export function renderInline(text: string): ReactNode {
  return text
    .split("`")
    .map((part, i) =>
      i % 2 ? (
        <code key={i} className="rounded-sm bg-rule/60 px-1 font-mono text-[0.88em]">
          {part}
        </code>
      ) : (
        part
      )
    );
}
