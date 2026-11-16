import { journal } from "@/lib/data";
import Reveal from "./Reveal";
import SheetBar from "./SheetBar";
import Parallax from "./Parallax";
import Rings from "./Rings";

export default function Journal() {
  const [lead, ...rest] = journal;
  return (
    <section id="journal" className="relative isolate mx-auto max-w-[1440px] px-pad section-y">
      <Rings variant="c" />
      <SheetBar n="10" label="Journal" sheet="J-01" />
      <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
        <Reveal>
          <Parallax distance={-34}><h2 className="display">
            Notes from
            <br />
            <span className="text-muted">the drawing board.</span>
          </h2></Parallax>
        </Reveal>
        <Reveal delay={0.1}>
          <a
            href="#journal"
            className="group inline-flex items-center gap-3 rounded-full border border-ink px-6 py-3 font-head text-[13px] font-medium transition-colors hover:bg-ink hover:text-surface"
          >
            All articles <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
        </Reveal>
      </div>

      <div className="grid gap-[clamp(14px,1.6vw,24px)] lg:grid-cols-[1.25fr_1fr]">
        {/* lead story */}
        <Reveal>
          <a href="#journal" className="group relative block h-full min-h-[440px] overflow-hidden rounded-[36px] bg-dark">
            <img
              loading="lazy"
              src={lead.img}
              alt=""
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-expo group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-[clamp(24px,3vw,44px)] text-white">
              <div className="flex flex-wrap items-center gap-3 font-head text-[10px] uppercase tracking-[0.22em]">
                <span className="rounded-full bg-white px-3 py-1.5 text-ink">{lead.tag}</span>
                <span className="text-white/70">
                  {lead.date} · {lead.read} read
                </span>
              </div>
              <h3 className="mt-4 max-w-[20ch] font-head text-[clamp(26px,2.8vw,42px)] font-light leading-[1.1]">{lead.title}</h3>
              <p className="mt-3 max-w-[48ch] text-sm text-white/75">{lead.excerpt}</p>
            </div>
            <span className="absolute right-6 top-6 grid h-12 w-12 place-items-center rounded-full bg-white text-ink transition-transform duration-500 ease-expo group-hover:rotate-45">
              ↗
            </span>
          </a>
        </Reveal>

        {/* list */}
        <div className="flex flex-col gap-[clamp(14px,1.6vw,24px)]">
          {rest.map((p, i) => (
            <Reveal key={p.title} delay={0.08 * (i + 1)}>
              <Parallax distance={24 + i * 34}>
              <a href="#journal" className="group grid grid-cols-[120px_1fr] items-center gap-5 rounded-[28px] bg-surface p-3 pr-6 transition-colors hover:bg-white md:grid-cols-[160px_1fr]">
                <div className="aspect-square overflow-hidden rounded-[22px] bg-bg-2">
                  <img
                    loading="lazy"
                    src={p.img}
                    alt=""
                    className="h-full w-full object-cover grayscale-[.4] transition-[transform,filter] duration-[1200ms] ease-expo group-hover:scale-110 group-hover:grayscale-0"
                  />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 font-head text-[10px] uppercase tracking-[0.2em] text-muted">
                    <span className="rounded-full border border-line px-2.5 py-1">{p.tag}</span>
                    <span>
                      {p.date} · {p.read}
                    </span>
                  </div>
                  <h3 className="mt-2.5 font-head text-[clamp(17px,1.5vw,21px)] leading-snug">{p.title}</h3>
                  <p className="mt-1.5 hidden text-[13px] text-muted sm:block">{p.excerpt}</p>
                </div>
              </a>
              </Parallax>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
