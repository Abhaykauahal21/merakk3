import { categories } from "@/lib/data";
import Reveal from "./Reveal";
import SheetBar from "./SheetBar";
import ClipImage from "./ClipImage";
import Parallax from "./Parallax";
import Rings from "./Rings";

export default function Approach() {
  return (
    <section id="approach" className="relative isolate mx-auto grid max-w-[1440px] items-start gap-[clamp(32px,4vw,64px)] px-pad section-y lg:grid-cols-[minmax(240px,1fr)_3fr]">
      <Rings variant="a" />
      <SheetBar n="01" label="Our approach" sheet="A-01" />
      <div>
        <Reveal delay={0.05}>
          <Parallax distance={-34}><h2 className="display mt-4">People.<br />Place.<br />Possibility.</h2></Parallax>
        </Reveal>
        <Reveal delay={0.1}><span className="mb-5 mt-7 block h-px w-9 bg-ink" /></Reveal>
        <Reveal delay={0.15}>
          <p className="max-w-[34ch] text-[15px] text-ink-2">Architecture for a more connected and considered world.</p>
        </Reveal>
      </div>

      <div className="grid gap-[clamp(14px,1.6vw,24px)] md:grid-cols-3">
        {categories.map((c, i) => (
          <Parallax key={c.title} distance={30 + i * 55}>
          <Reveal delay={i * 0.1}>
            <a href="#projects" className="group flex flex-col">
              <ClipImage
                src={c.img}
                alt={c.alt}
                delay={i * 0.12}
                parallax={6 + i * 4}
                className="aspect-[4/3.6] rounded-[24px] bg-bg-2"
                imgClassName="grayscale-[.55] transition-[filter] duration-700 group-hover:grayscale-0"
              />
              <span className="mt-4 font-head text-xs text-muted">{c.n}</span>
              <span className="flex items-center justify-between border-b border-line pb-3.5 pt-1.5 font-head text-[15px]">
                {c.title}
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </span>
            </a>
          </Reveal>
          </Parallax>
        ))}
      </div>
    </section>
  );
}
