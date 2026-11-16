"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SheetBar from "./SheetBar";
import Reveal from "./Reveal";
import Parallax from "./Parallax";

const ease = [0.22, 0.8, 0.2, 1] as const;

/** Swatches are cropped from the finished home in the hero timelapse. */
const materials = [
  { code: "M-01", name: "Travertine", spec: "Split-face cladding · 600 × 300 mm", note: "Warms in low sun, ages gracefully.", img: "/materials/travertine.webp" },
  { code: "M-02", name: "Teak fins", spec: "Vertical screens · 75 × 200 mm @ 300 c/c", note: "Shade, privacy and rhythm in one line.", img: "/materials/teak.webp" },
  { code: "M-03", name: "Lime plaster", spec: "Hand-trowelled · natural off-white", note: "Breathable, soft, quietly luminous.", img: "/materials/plaster.webp" },
  { code: "M-04", name: "Low-iron glass", spec: "Slim-profile sliding · 3.2 m high", note: "Floor-to-ceiling, garden to garden.", img: "/materials/glass.webp" },
  { code: "M-05", name: "Planting", spec: "Native lawn · layered hedging", note: "The landscape is part of the plan.", img: "/materials/lawn.webp" },
];

export default function Materials() {
  const [active, setActive] = useState(0);
  const m = materials[active];

  return (
    <section className="mx-auto max-w-[1440px] px-pad section-y">
      <SheetBar n="06" label="Material library" sheet="M-00" scale="1:5" />
      <div className="grid gap-[clamp(32px,5vw,80px)] lg:grid-cols-[1fr_1.15fr]">
        {/* big preview */}
        <Parallax distance={70}>
        <Reveal className="relative">
          <div className="relative aspect-square overflow-hidden rounded-[32px] bg-bg-2 md:rounded-[48px]">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.img
                key={m.img}
                src={m.img}
                alt={`${m.name} sample`}
                initial={{ opacity: 0, scale: 1.12 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-black/55 to-transparent p-6 text-white md:p-8">
              <div>
                <p className="font-head text-[10px] uppercase tracking-[0.26em] text-white/70">{m.code}</p>
                <p className="mt-1 font-head text-2xl font-light md:text-3xl">{m.name}</p>
              </div>
              <span className="rounded-full bg-white/15 px-4 py-2 font-head text-[10px] uppercase tracking-[0.2em] backdrop-blur-md">
                Sample 1:5
              </span>
            </div>
          </div>
        </Reveal>
        </Parallax>

        {/* list */}
        <div className="flex flex-col justify-between gap-10">
          <div>
            <Reveal>
              <Parallax distance={-30}><h2 className="display">
                Honest materials,
                <br />
                <span className="text-muted">chosen to age well.</span>
              </h2></Parallax>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-[42ch] text-[15px] text-ink-2">
                Every Merakk project has a short, deliberate palette. These are the actual surfaces of the home you just
                watched being built.
              </p>
            </Reveal>
          </div>

          <ul className="border-t border-line">
            {materials.map((x, i) => (
              <li key={x.code}>
                <button
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className="group grid w-full grid-cols-[auto_1fr_auto] items-center gap-5 border-b border-line py-4 text-left"
                >
                  <span className={`h-14 w-14 overflow-hidden rounded-full ring-2 ring-offset-2 ring-offset-bg transition-all duration-500 ${active === i ? "ring-ink" : "ring-transparent"}`}>
                    <img src={x.img} alt="" className="h-full w-full scale-150 object-cover" />
                  </span>
                  <span>
                    <span className="flex items-baseline gap-3">
                      <span className="font-head text-[10px] tracking-[0.2em] text-muted">{x.code}</span>
                      <span className="font-head text-lg">{x.name}</span>
                    </span>
                    <span className="block text-[13px] text-muted">{x.spec}</span>
                  </span>
                  <span className={`hidden max-w-[22ch] text-right text-[13px] text-ink-2 transition-opacity duration-500 sm:block ${active === i ? "opacity-100" : "opacity-0"}`}>
                    {x.note}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
