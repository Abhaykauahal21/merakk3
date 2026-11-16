"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import Reveal from "./Reveal";
import SheetBar from "./SheetBar";
import Parallax from "./Parallax";

const u = (id: string) => `https://images.unsplash.com/photo-${id}?w=700&q=70&auto=format&fit=crop`;

const services: { title: [string, string]; img: string; icon: React.ReactNode }[] = [
  { title: ["Architecture", "Design"], img: u("1600585154340-be6161a56a0c"), icon: <><rect x="5" y="5" width="30" height="30" /><path d="M5 35 L35 5 M5 22 L22 5" /></> },
  { title: ["Interior", "Design"], img: u("1600607687939-ce8a6c25118c"), icon: <><circle cx="15" cy="16" r="10" /><circle cx="25" cy="16" r="10" /><circle cx="20" cy="25" r="10" /></> },
  { title: ["Master", "Planning"], img: u("1503387762-592deb58ef4e"), icon: <path d="M20 5 L36 35 H4 Z M20 5 V35 M12 20 H28" /> },
  { title: ["Renovations", "& Extensions"], img: u("1600566753190-17f0baa2a6c3"), icon: <path d="M20 4 L35 12 V28 L20 36 L5 28 V12 Z M5 12 L20 20 L35 12 M20 20 V36" /> },
  { title: ["Landscape", "Design"], img: u("1582268611958-ebfd161ef9cf"), icon: <><path d="M20 36 V18 M20 22 C10 22 6 14 8 6 C16 6 20 12 20 22 M20 18 C28 18 32 12 32 6 C24 6 20 10 20 18" /><path d="M6 36 H34" /></> },
  { title: ["Turnkey", "Execution"], img: u("1497366216548-37526070297c"), icon: <path d="M6 34 H34 M10 34 V14 H30 V34 M16 34 V24 H24 V34 M6 14 L20 5 L34 14" /> },
];

export default function Services() {
  const area = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 180, damping: 22 });
  const y = useSpring(my, { stiffness: 180, damping: 22 });

  const onMove = (e: React.MouseEvent) => {
    const r = area.current!.getBoundingClientRect();
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  };

  return (
    <section id="services" className="mx-auto grid max-w-[1440px] gap-[clamp(40px,6vw,100px)] px-pad section-y lg:grid-cols-[1fr_1.6fr]">
      <SheetBar n="07" label="Our services" sheet="S-01" />
      <div>
        <Reveal delay={0.05}><Parallax distance={-30}><h2 className="display mt-4">From concept<br />to completion.</h2></Parallax></Reveal>
        <Reveal delay={0.1}><span className="mb-5 mt-7 block h-px w-9 bg-ink" /></Reveal>
        <Reveal delay={0.15}>
          <p className="max-w-[34ch] text-[15px] text-ink-2">
            We offer a full range of architectural services tailored to your goals and context.
          </p>
        </Reveal>
      </div>

      <div ref={area} onMouseMove={onMove} onMouseLeave={() => setHover(null)} className="relative grid self-end border-t border-line md:grid-cols-2">
        {/* floating preview that follows the cursor */}
        <motion.div
          style={{ x, y }}
          className="pointer-events-none absolute left-0 top-0 z-20 hidden -translate-x-1/2 -translate-y-1/2 md:block"
        >
          <AnimatePresence>
            {hover !== null && (
              <motion.div
                key={hover}
                initial={{ opacity: 0, scale: 0.7, rotate: -6 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.85, rotate: 4 }}
                transition={{ duration: 0.45, ease: [0.22, 0.8, 0.2, 1] }}
                className="absolute h-[200px] w-[280px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[20px] shadow-2xl shadow-black/20"
              >
                <img src={services[hover].img} alt="" className="h-full w-full object-cover" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {services.map((s, i) => (
          <Reveal key={s.title[0]} delay={(i % 2) * 0.08}>
            <a
              href="#contact"
              onMouseEnter={() => setHover(i)}
              className={`group relative grid grid-cols-[44px_1fr_auto] items-center gap-5 overflow-hidden border-b border-line py-7 pr-5 font-head text-sm leading-snug ${
                i % 2 === 0 ? "pl-1 md:border-r" : "pl-1 md:pl-6"
              }`}
            >
              <span className="absolute inset-1 origin-bottom scale-y-0 rounded-[18px] bg-ink transition-transform duration-500 ease-expo group-hover:scale-y-100" />
              <svg viewBox="0 0 40 40" aria-hidden className="relative h-10 w-10 fill-none stroke-ink [stroke-linejoin:round] [stroke-width:1.1] transition-[transform,stroke] duration-700 ease-expo group-hover:rotate-[8deg] group-hover:scale-110 group-hover:stroke-surface">
                {s.icon}
              </svg>
              <span className="relative transition-colors duration-500 group-hover:text-surface">
                {s.title[0]}
                <br />
                {s.title[1]}
              </span>
              <span className="relative transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-surface">→</span>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
