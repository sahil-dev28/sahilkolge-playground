import type { ReactNode } from "react";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DemoCardProps {
  title: string;
  note?: string;
  action?: ReactNode;
  dark?: boolean;
  className?: string;
  children: ReactNode;
}

export function DemoCard({ title, note, action, dark, className, children }: DemoCardProps) {
  return (
    <Card
      className={cn(
        "gap-[18px] rounded-[20px] p-6 text-[17px] shadow-none ring-border transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_var(--shadow)]",
        dark && "bg-panel text-panel-foreground ring-panel-line",
        className
      )}
    >
      <CardHeader className="flex flex-wrap items-center justify-between gap-3 p-0">
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        {action ??
          (note && (
            <CardAction>
              <span className="font-mono text-[11px] text-muted-foreground">{note}</span>
            </CardAction>
          ))}
      </CardHeader>
      <CardContent className="flex flex-col gap-[18px] p-0">{children}</CardContent>
    </Card>
  );
}
