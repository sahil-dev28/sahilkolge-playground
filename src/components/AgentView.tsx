import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { buildAgentMarkdown } from "@/agent-markdown";
import Section from "@/components/Section";
import { usePageTitle } from "@/hooks/use-page-title";
import { AGENT_TITLE } from "@/pages";

const MARKDOWN = buildAgentMarkdown();

export default function AgentView() {
  usePageTitle(AGENT_TITLE);
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(MARKDOWN);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked; the markdown stays selectable below.
    }
  };

  return (
    <main className="page flex flex-col gap-10 pt-14 pb-[72px]">
      <Link to="/" className="link self-start text-[15px]">
        ← Human view
      </Link>
      <Section id="agent" label="agent view">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 font-mono text-xs text-muted">
          <span>
            GET{" "}
            <a href="/llms.txt" target="_blank" rel="noreferrer" className="link">
              /llms.txt
            </a>{" "}
            · text/markdown
          </span>
          <button type="button" onClick={copy} className="underline-offset-4 hover:underline">
            <span aria-live="polite">{copied ? "Copied" : "Copy for your LLM"}</span>
          </button>
        </div>
        <pre className="m-0 border border-rule p-4 font-mono text-[13px] leading-relaxed whitespace-pre-wrap [overflow-wrap:anywhere]">
          {MARKDOWN}
        </pre>
      </Section>
    </main>
  );
}
