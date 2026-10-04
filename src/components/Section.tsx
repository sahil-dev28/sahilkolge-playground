import type { ReactNode } from "react";

interface SectionProps {
  id: string;
  label: string;
  className?: string;
  children: ReactNode;
}

export default function Section({ id, label, className = "", children }: SectionProps) {
  return (
    <section id={id} tabIndex={-1} className={`flex scroll-mt-6 flex-col gap-4 outline-none ${className}`}>
      <h2 className="section-label">{label}</h2>
      {children}
    </section>
  );
}
