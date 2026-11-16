"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import { stats } from "@/lib/data";
import Reveal from "./Reveal";
import Parallax from "./Parallax";

function Counter({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const [v, setV] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const c = animate(0, value, { duration: 2, ease: [0.22, 0.8, 0.2, 1], onUpdate: setV });
    return () => c.stop();
  }, [inView, value]);

  return <strong ref={ref}>{v.toFixed(decimals)}</strong>;
}

const words = ["Design", "Detail", "Build", "Endure"];

export default function Numbers() {
  return (
    <section className="mx-2 overflow-hidden rounded-[32px] bg-dark-2 pb-[clamp(60px,8vw,110px)] text-white md:mx-4 md:rounded-[56px]">
      <div className="overflow-hidden border-b border-white/10 py-6" aria-hidden>
        <Parallax axis="x" distance={520}><div className="flex w-max animate-marquee items-center gap-12 font-head text-[clamp(42px,6vw,96px)] font-extralight uppercase tracking-[0.02em] text-white/90">
          {[...words, ...words, ...words, ...words].map((w, i) => (
            <span key={i} className="flex items-center gap-12">
              {w}
              <i className="not-italic text-[0.3em] text-concrete">◆</i>
            </span>
          ))}
        </div></Parallax>
      </div>

      <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-6 gap-y-11 px-pad pt-[clamp(50px,6vw,80px)] lg:grid-cols-4">
        {stats.map((s, i) => (
          <Parallax key={s.label} distance={30 + i * 30}>
          <Reveal delay={i * 0.08} className="border-l border-white/15 pl-5">
            <div className="font-head text-[clamp(44px,5vw,76px)] font-extralight leading-none">
              <Counter value={s.value} decimals={s.decimals} />
              <span className="text-concrete">{s.suffix}</span>
            </div>
            <p className="mt-2.5 text-sm text-white/55">{s.label}</p>
          </Reveal>
          </Parallax>
        ))}
      </div>
    </section>
  );
}
