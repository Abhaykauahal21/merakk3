"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SheetBar from "./SheetBar";
import Reveal from "./Reveal";
import Parallax from "./Parallax";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Drag (or use arrow keys) to compare the empty plot with the finished home.
 * Uses the first and last frames of the hero timelapse.
 */
export default function BeforeAfter() {
  const root = useRef<HTMLElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(78);
  const dragging = useRef(false);

  // on first view the divider sweeps across to hint that it's interactive
  useGSAP(
    () => {
      const o = { v: 92 };
      gsap.to(o, {
        v: 50,
        duration: 1.8,
        ease: "expo.inOut",
        onUpdate: () => setPos(o.v),
        scrollTrigger: { trigger: box.current, start: "top 70%", once: true },
      });
    },
    { scope: root }
  );

  const setFromClient = (clientX: number) => {
    const r = box.current!.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <section ref={root} className="mx-auto max-w-[1440px] px-pad section-y">
      <SheetBar n="04" label="Site to home" sheet="A-03" scale="1:200" />
      <div className="mb-12 grid items-end gap-8 lg:grid-cols-[1.4fr_1fr]">
        <Reveal>
          <Parallax distance={-30}><h2 className="display">
            Same ground.
            <br />
            <span className="text-muted">A different life.</span>
          </h2></Parallax>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="max-w-[40ch] text-[15px] text-ink-2">
            Drag across the drawing to see how a bare plot became a home — the levels, the light, the garden and the
            water, all set out from the very first survey.
          </p>
        </Reveal>
      </div>

      <div
        ref={box}
        role="slider"
        tabIndex={0}
        aria-label="Compare the empty site with the finished home"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 4));
          if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 4));
        }}
        onPointerDown={(e) => {
          dragging.current = true;
          (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
          setFromClient(e.clientX);
        }}
        onPointerMove={(e) => dragging.current && setFromClient(e.clientX)}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
        data-cursor="Drag"
        className="relative aspect-[4/3] cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-[28px] bg-bg-2 outline-none focus-visible:ring-2 focus-visible:ring-ink md:aspect-[16/8] md:rounded-[40px]"
      >
        {/* after (finished) */}
        <img src="/sequence/desktop/0085.webp" alt="The finished home with lawn and pool" className="absolute inset-0 h-full w-full object-cover" draggable={false} />
        {/* before (site) */}
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <img src="/sequence/desktop/0001.webp" alt="The empty plot before construction" className="absolute inset-0 h-full w-full object-cover grayscale-[.35]" draggable={false} />
          {/* blueprint grid on the "before" side */}
          <div className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px)] [background-size:48px_48px]" />
        </div>

        {/* labels */}
        <span className="absolute left-4 top-4 rounded-full bg-black/45 px-4 py-2 font-head text-[10px] uppercase tracking-[0.24em] text-white backdrop-blur-md md:left-6 md:top-6">
          Day 001 — Site
        </span>
        <span className="absolute right-4 top-4 rounded-full bg-white/80 px-4 py-2 font-head text-[10px] uppercase tracking-[0.24em] text-ink backdrop-blur-md md:right-6 md:top-6">
          Day 240 — Handover
        </span>

        {/* divider + handle */}
        <div className="pointer-events-none absolute inset-y-0" style={{ left: `${pos}%` }}>
          <div className="absolute inset-y-0 -left-px w-0.5 bg-white/90 shadow-[0_0_20px_rgba(0,0,0,.35)]" />
          <div className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-ink shadow-xl">
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current [stroke-width:1.6]" aria-hidden>
              <path d="M9 6 L3 12 L9 18 M15 6 L21 12 L15 18" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
