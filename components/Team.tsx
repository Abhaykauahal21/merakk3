import { founder, team } from "@/lib/data";
import Reveal from "./Reveal";
import SheetBar from "./SheetBar";
import Parallax from "./Parallax";
import Rings from "./Rings";

const people = [
  { ...founder, note: "Sets the studio's direction on every project.", pos: "50% 58%", lead: true },
  { ...team[0], quote: "", credentials: [] as string[], pos: "50% 14%", lead: false },
  { ...team[1], quote: "", credentials: [] as string[], pos: "50% 18%", lead: false },
];

export default function Team() {
  return (
    <section id="team" className="relative isolate mx-auto max-w-[1440px] px-pad section-y">
      <Rings variant="b" />
      <SheetBar n="03" label="Meet the founders" sheet="T-01" scale="1:1" />

      <div className="grid items-center gap-[clamp(36px,5vw,88px)] lg:grid-cols-[1fr_1.7fr]">
        {/* left — heading + founder's words */}
        <div>
          <Reveal>
            <Parallax distance={-34}><h2 className="display">
              The minds behind
              <br />
              <span className="text-muted">the studio.</span>
            </h2></Parallax>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-7 max-w-[36ch] font-head text-[clamp(17px,1.5vw,21px)] font-light leading-[1.45] text-ink-2">
              <span className="text-concrete">“</span>
              {founder.quote}
              <span className="text-concrete">”</span>
            </p>
            <p className="mt-4 text-sm text-muted">— {founder.name}</p>
          </Reveal>
          <Reveal delay={0.18} className="mt-8 flex flex-wrap gap-2">
            {founder.credentials.map((c) => (
              <span key={c} className="rounded-full border border-line px-4 py-2 text-[12px] text-ink-2">
                {c}
              </span>
            ))}
          </Reveal>
        </div>

        {/* right — three arch portraits, one row (swipeable on mobile) */}
        <div className="-mx-[clamp(20px,5vw,72px)] flex snap-x snap-mandatory gap-4 overflow-x-auto px-[clamp(20px,5vw,72px)] py-14 -my-12 [scrollbar-width:none] md:mx-0 md:my-0 md:py-0 md:grid md:grid-cols-3 md:gap-[clamp(12px,1.4vw,22px)] md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
          {people.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.1} className="w-[62vw] shrink-0 snap-start sm:w-[40vw] md:w-auto">
              <Parallax distance={40 + i * 55}>
              <article className="group">
                <div className="relative aspect-[3/4] overflow-hidden rounded-t-[999px] rounded-b-[26px] bg-bg-2">
                  <img
                    loading="eager"
                    decoding="async"
                    width={720}
                    height={900}
                    src={m.img}
                    alt={`${m.name}, ${m.role}`}
                    style={{ objectPosition: m.pos }}
                    className="h-full w-full object-cover transition-transform duration-[1200ms] ease-expo group-hover:scale-105"
                  />
                  {m.lead && (
                    <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white/85 px-3.5 py-1.5 font-head text-[9px] uppercase tracking-[0.22em] text-ink backdrop-blur-md">
                      Founder
                    </span>
                  )}
                  <div className="absolute inset-x-3 bottom-3 translate-y-[130%] rounded-[18px] bg-white/90 p-3.5 text-center text-[12px] text-ink-2 backdrop-blur-md transition-transform duration-500 ease-expo group-hover:translate-y-0">
                    {m.note}
                  </div>
                </div>
                <div className="px-1 pt-4 text-center">
                  <h3 className="font-head text-[clamp(15px,1.25vw,18px)] font-normal leading-tight">{m.name}</h3>
                  <p className="mt-1 text-[12px] leading-snug text-muted">{m.role}</p>
                </div>
              </article>
              </Parallax>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
