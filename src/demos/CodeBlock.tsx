import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function CodeBlock({ className, ...props }: ComponentProps<"pre">) {
  return (
    <pre
      className={cn(
        "m-0 rounded-xl bg-code p-4 font-mono text-[13px] leading-[1.7] break-all whitespace-pre-wrap text-code-foreground",
        className
      )}
      {...props}
    />
  );
}
