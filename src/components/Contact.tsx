import { useState } from "react";
import Section from "@/components/Section";
import { CONTACT } from "@/data";

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked; the address stays visible as a mailto link.
    }
  };

  return (
    <Section id="contact" label="contact" className="page pb-[72px]">
      <p className="m-0">
        Email is the best way to reach me:{" "}
        <a href={`mailto:${CONTACT.email}`} className="link">
          {CONTACT.email}
        </a>{" "}
        <button
          type="button"
          onClick={copyEmail}
          className="font-mono text-xs text-muted underline-offset-4 hover:underline"
        >
          <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
        </button>
        . I'm open to full stack roles.
      </p>
    </Section>
  );
}
