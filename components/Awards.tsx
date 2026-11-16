import { awards, publications } from "@/lib/data";
import Reveal from "./Reveal";
import SheetBar from "./SheetBar";

export default function Awards() {
  return (
    <section id="awards" className="mx-auto max-w-[1440px] px-pad section-y">
      <SheetBar n="09" label="Recognition" sheet="R-01" />
      <div className="grid gap-[clamp(32px,5vw,88px)] lg:grid-cols-[1fr_1.6fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Reveal>
            <h2 className="display">
              Quietly
              <br />
              <span className="text-muted">recognised.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-[34ch] text-[15px] text-ink-2">
              Awards are never the brief — but it is good to know the work speaks for itself.
            </p>
          </Reveal>
          <Reveal delay={0.15} className="mt-10 flex items-center gap-5">
            <span className="font-head text-[clamp(56px,6vw,96px)] font-extralight leading-none">
              {String(awards.length).padStart(2, "0")}
            </span>
            <span className="text-sm leading-snug text-muted">
              awards &amp;
              <br />
              commendations
            </span>
          </Reveal>
        </div>

        <div>
          <div className="hidden grid-cols-[72px_1.6fr_1fr_1fr] gap-4 border-b border-ink pb-3 font-head text-[10px] uppercase tracking-[0.24em] text-muted md:grid">
            <span>Year</span>
            <span>Award</span>
            <span>Presented by</span>
            <span className="text-right">Project</span>
          </div>
          {awards.map((a, i) => (
            <Reveal key={a.title} delay={i * 0.05}>
              <div className="group relative grid grid-cols-[56px_1fr] gap-x-4 gap-y-1 border-b border-line py-5 md:grid-cols-[72px_1.6fr_1fr_1fr] md:items-center md:py-6">
                <span className="absolute inset-x-[-12px] inset-y-1 origin-left scale-x-0 rounded-[18px] bg-ink transition-transform duration-500 ease-expo group-hover:scale-x-100" />
                <span className="relative font-head text-sm text-muted transition-colors group-hover:text-white/60">{a.year}</span>
                <span className="relative font-head text-[clamp(17px,1.6vw,22px)] transition-colors group-hover:text-white">{a.title}</span>
                <span className="relative col-start-2 text-sm text-ink-2 transition-colors group-hover:text-white/70 md:col-start-auto">{a.by}</span>
                <span className="relative col-start-2 text-sm text-muted transition-colors group-hover:text-white/70 md:col-start-auto md:text-right">
                  {a.project}
                </span>
              </div>
            </Reveal>
          ))}

          <Reveal className="mt-14">
            <p className="eyebrow mb-4">As featured in</p>
            <div className="flex flex-wrap gap-2.5">
              {publications.map((p) => (
                <span
                  key={p}
                  className="rounded-full border border-line px-5 py-2.5 font-head text-sm italic text-ink-2 transition-colors hover:border-ink hover:bg-ink hover:text-surface"
                >
                  {p}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
