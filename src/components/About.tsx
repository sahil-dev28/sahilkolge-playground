import { useEffect, useState, type ReactNode } from "react";
import { Briefcase, Mail, MapPin, User } from "lucide-react";
import profileImg from "@/assets/profile.webp";
import { ABOUT, CONTACT } from "@/data";

function useMumbaiTime() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    const timeout = setTimeout(() => {
      setNow(new Date());
      interval = setInterval(() => setNow(new Date()), 60_000);
    }, 60_000 - (Date.now() % 60_000));
    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, []);

  try {
    const label = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Kolkata",
      hour: "numeric",
      minute: "2-digit",
    }).format(now);
    return { label, iso: now.toISOString() };
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
    <section id="about" tabIndex={-1} className="wrap scroll-mt-20 outline-none py-24">
      <div className="grid items-start gap-10 md:grid-cols-[280px_1fr] md:gap-14">
        <img
          src={profileImg}
          alt="Sahil Kolge"
          width={280}
          height={280}
          loading="lazy"
          decoding="async"
          className="size-[220px] rounded-full object-cover lg:size-[280px]"
        />
        <div className="flex flex-col gap-7">
          <h2 className="heading-display text-[clamp(40px,5vw,64px)]">
            A bit <span className="text-primary italic">about me</span>
          </h2>
          <div className="flex flex-col gap-2.5 text-[17px]">
            <Row icon={<User />}>Sahil Kolge</Row>
            <Row icon={<Briefcase />}>Full Stack Developer</Row>
            <Row icon={<MapPin />}>
              Mumbai, India
              {time && (
                <span className="text-muted-foreground">
                  {"\u00a0·\u00a0"}
                  <time dateTime={time.iso}>{time.label}</time> local time
                </span>
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
