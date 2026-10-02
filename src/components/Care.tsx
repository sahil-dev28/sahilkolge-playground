import { CARE } from "@/data";

export default function Care() {
  return (
    <section className="border-y border-panel-line bg-panel text-panel-foreground">
      <div className="wrap flex flex-col gap-10 py-24">
        <h2 className="heading-display text-[clamp(44px,6vw,80px)]">
          Four things I <span className="font-serif font-normal text-mark italic">keep caring about</span>
        </h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(250px,100%),1fr))] gap-px overflow-hidden rounded-[18px] border border-panel-line bg-panel-line">
          {CARE.map(([title, text], i) => (
            <div key={title} className="flex flex-col gap-3 bg-panel p-7">
              <span className="font-mono text-xs text-mark">0{i + 1}</span>
              <strong className="text-2xl font-bold">{title}</strong>
              <p className="m-0 text-[15px] text-panel-muted">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
