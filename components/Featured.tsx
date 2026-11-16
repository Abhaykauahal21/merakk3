"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { testimonials } from "@/lib/data";
import Reveal from "./Reveal";
import ClipImage from "./ClipImage";

const ease = [0.22, 0.8, 0.2, 1] as const;

export default function Featured() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const go = (d: number) => setI((v) => (v + d + testimonials.length) % testimonials.length);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => go(1), 6000);
    return () => clearInterval(t);
  }, [paused, i]);

  const t = testimonials[i];

  return (
    <section className="mx-auto mt-[clamp(80px,10vw,140px)] grid max-w-[1440px] px-pad lg:grid-cols-[1.9fr_1fr]">
      <div className="group relative flex min-h-[clamp(420px,46vw,640px)] items-center overflow-hidden rounded-t-[32px] bg-dark lg:rounded-l-[32px] lg:rounded-tr-none">
        <ClipImage
          src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1800&q=75&auto=format&fit=crop"
          alt="Timber-clad modern house with a deep cantilevered roof"
          from="left"
          parallax={14}
          className="!absolute inset-0"
          imgClassName="brightness-[.85] grayscale-[.55]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(26,26,25,.92)_0%,rgba(26,26,25,.65)_38%,rgba(26,26,25,0)_70%)]" />
        <div className="relative max-w-[460px] p-[clamp(28px,4vw,60px)] text-white/85">
          <Reveal><p className="eyebrow !text-white/70">Featured project</p></Reveal>
          <Reveal delay={0.05}><h2 className="display mt-4 text-white">Timber Court<br />House</h2></Reveal>
          <Reveal delay={0.1}><span className="mb-5 mt-7 block h-px w-9 bg-white" /></Reveal>
          <Reveal delay={0.15}><p className="mb-8">A quiet home, rooted in its landscape.</p></Reveal>
          <Reveal delay={0.2}>
            <a href="#projects" className="group/l inline-flex gap-3 border-b border-white pb-1 font-head text-[13px] text-white">
              View Project <span className="transition-transform duration-300 group-hover/l:translate-x-1">→</span>
            </a>
          </Reveal>
        </div>
      </div>

      <div
        className="flex flex-col rounded-b-[32px] bg-surface p-[clamp(32px,4vw,60px)] lg:rounded-r-[32px] lg:rounded-bl-none"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="font-head text-[64px] leading-[.8] text-concrete">“</div>
        <div className="relative mt-2.5 min-h-[240px] flex-1">
          <AnimatePresence mode="wait">
            <motion.figure
              key={i}
              className="m-0"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.6, ease }}
            >
              <blockquote className="m-0 font-head text-[clamp(18px,1.6vw,23px)] font-light leading-[1.45]">
                {t.quote}
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 font-head text-[10px] uppercase tracking-[0.26em] text-muted before:h-px before:w-5 before:bg-muted">
                Client testimonial — {t.by}
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>
        <div className="mt-6 flex items-center justify-between">
          <span className="font-head text-xs text-muted">
            <b className="font-medium text-ink">{String(i + 1).padStart(2, "0")}</b> / {String(testimonials.length).padStart(2, "0")}
          </span>
          <div className="flex gap-2.5">
            {[
              [-1, "←", "Previous testimonial"],
              [1, "→", "Next testimonial"],
            ].map(([d, s, l]) => (
              <button
                key={l as string}
                onClick={() => go(d as number)}
                aria-label={l as string}
                className="grid h-[46px] w-[46px] place-items-center rounded-full border border-ink transition-colors hover:bg-ink hover:text-surface"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
