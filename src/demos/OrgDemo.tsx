import { useState, type ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DemoCard } from "./DemoCard";
import type { DemoProps } from "./types";

interface OrgAction {
  label: string;
  ok: boolean;
  code: string;
  msg: string;
}

const ORG_ACTIONS: OrgAction[] = [
  { label: "Make Riya report to Arjun", ok: false, code: "409 EMPLOYEE_CHAIN", msg: "Blocked. An employee cannot report to another employee." },
  { label: "Add a 2nd HR Manager to Engineering", ok: false, code: "409 DEPT_HAS_HR", msg: "Blocked. Each department gets exactly one HR manager." },
  { label: "Make Meera report to Riya", ok: false, code: "409 CIRCULAR_CHAIN", msg: "Blocked. That would create a circular reporting chain." },
  { label: "Move Arjun under Kabir", ok: true, code: "200 OK", msg: "Allowed. Arjun now reports to Kabir. Chart updated." },
];

function OrgNode({ children, variant = "default" }: { children: ReactNode; variant?: "default" | "strong" | "hr" }) {
  return (
    <span
      className={cn(
        "rounded-[10px] border-2 border-foreground bg-card px-3.5 py-1.5 text-[15px]",
        variant === "strong" && "font-semibold",
        variant === "hr" && "border-primary font-semibold text-primary"
      )}
    >
      {children}
    </span>
  );
}

function OrgLine() {
  return <span className="h-3.5 w-0.5 bg-foreground" />;
}

export default function OrgDemo({ onPlay }: DemoProps) {
  const [result, setResult] = useState<OrgAction | null>(null);

  return (
    <DemoCard title="Try to break the org chart" note="demo data">
      <div className="flex flex-col items-center gap-2.5 rounded-[14px] bg-muted p-[18px]">
        <OrgNode variant="strong">Meera · Admin</OrgNode>
        <OrgLine />
        <OrgNode variant="hr">Kabir · HR Manager, Engineering</OrgNode>
        <OrgLine />
        <div className="flex flex-wrap justify-center gap-3">
          <OrgNode>Riya · Employee</OrgNode>
          <OrgNode>Arjun · Employee</OrgNode>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-2">
        {ORG_ACTIONS.map((a) => (
          <Button
            key={a.label}
            variant="outline"
            className="h-auto min-h-12 justify-start rounded-[10px] border-line-2 bg-card px-3.5 py-2.5 text-left text-sm font-normal whitespace-normal hover:-translate-y-0.5 dark:border-line-2 dark:bg-card dark:hover:bg-muted"
            onClick={() => {
              setResult(a);
              onPlay();
            }}
          >
            {a.label}
          </Button>
        ))}
      </div>

      {result ? (
        <Alert
          key={result.code}
          role="status"
          variant={result.ok ? "default" : "destructive"}
          className={cn(
            "gap-1 rounded-xl px-4 py-3.5 text-[17px] motion-safe:animate-flash",
            result.ok ? "border-success-border bg-success-bg text-success" : "border-danger-border bg-danger-bg"
          )}
        >
          <AlertTitle className="font-mono text-xs font-medium">{result.code}</AlertTitle>
          <AlertDescription className={cn("text-[17px]", result.ok ? "text-success" : "text-destructive")}>
            {result.msg}
          </AlertDescription>
        </Alert>
      ) : (
        <div className="flex flex-col gap-1 rounded-xl border border-dashed border-line-2 bg-muted px-4 py-3.5 text-muted-foreground">
          <span className="font-mono text-xs font-medium">waiting</span>
          <span>Pick an action above. The server rules decide.</span>
        </div>
      )}
    </DemoCard>
  );
}
