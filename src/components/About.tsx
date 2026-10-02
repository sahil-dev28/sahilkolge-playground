import { useEffect, useState, type ReactNode } from "react";
import { Briefcase, Mail, MapPin, User } from "lucide-react";
import profileImg from "@/assets/profile.webp";
import { ABOUT, CONTACT } from "@/data";

function useMumbaiTime() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Kolkata",
      hour: "numeric",
      minute: "2-digit",
    }).format(now);
  } catch {
    return null;
  }
}

function Row({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-muted-foreground [&_svg]:size-4" aria-hidden>
        {icon}
      </span>
      <span>{children}</span>
    </div>
  );
}

export default function About() {
  const time = useMumbaiTime();

  return (
    <section id="about" className="wrap scroll-mt-20 py-24">
      <div className="grid items-start gap-10 md:grid-cols-[280px_1fr] md:gap-14">
        <img
          src={profileImg}
          alt="Sahil Kolge"
          width={280}
          height={280}
          loading="lazy"
          decoding="async"
          className="size-[220px] rounded-[20px] border object-cover md:size-[280px]"
        />
        <div className="flex flex-col gap-7">
          <h2 className="heading-display text-[clamp(44px,6vw,80px)]">
            A bit <span className="font-serif font-normal text-primary italic">about me</span>
          </h2>
          <div className="flex flex-col gap-2.5 text-[17px]">
            <Row icon={<User />}>Sahil Kolge</Row>
            <Row icon={<Briefcase />}>Full Stack Developer</Row>
            <Row icon={<MapPin />}>
              Mumbai, India
              {time && (
                <>
                  {" · "}
                  <time className="font-mono text-sm text-muted-foreground">{time} local time</time>
                </>
              )}
            </Row>
            <Row icon={<Mail />}>
              <a href={`mailto:${CONTACT.email}`} className="text-primary hover:underline">
                {CONTACT.email}
              </a>
            </Row>
          </div>
          <ul className="m-0 flex max-w-[680px] list-disc flex-col gap-2.5 pl-5 text-ink-2">
            {ABOUT.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
