"use client";

import { useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useMotionValue, useSpring } from "framer-motion";
import { projects, type ProjectCat } from "@/lib/data";
import Reveal from "./Reveal";
import ClipImage from "./ClipImage";
import SheetBar from "./SheetBar";
import Parallax from "./Parallax";

const filters: ("all" | ProjectCat)[] = ["all", "residential", "commercial", "hospitality", "interiors"];
const ease = [0.22, 0.8, 0.2, 1] as const;

function Pills<T extends string>({ items, value, onChange, id, label }: { items: readonly T[]; value: T; onChange: (v: T) => void; id: string; label: string }) {
  return (
    <LayoutGroup id={id}>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label={label}>
        {items.map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={value === f}
            onClick={() => onChange(f)}
            className={`relative rounded-full border px-4 py-2 font-head text-xs capitalize transition-colors ${
              value === f ? "border-ink text-surface" : "border-line text-ink-2 hover:border-ink hover:text-ink"
            }`}
          >
            {value === f && <motion.span layoutId={`${id}-pill`} className="absolute inset-0 rounded-full bg-ink" transition={{ duration: 0.5, ease }} />}
            <span className="relative">{f}</span>
          </button>
        ))}
      </div>
    </LayoutGroup>
  );
}

/** Architect-portfolio style index table with a floating preview that follows the cursor. */
function ProjectIndex({ list }: { list: typeof projects }) {
  const area = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 160, damping: 20 });
  const y = useSpring(my, { stiffness: 160, damping: 20 });

  return (
    <div
      ref={area}
      className="relative"
      onMouseMove={(e) => {
        const r = area.current!.getBoundingClientRect();
        mx.set(e.clientX - r.left);
        my.set(e.clientY - r.top);
      }}
      onMouseLeave={() => setHover(null)}
    >
      <motion.div style={{ x, y }} className="pointer-events-none absolute left-0 top-0 z-20 hidden md:block">
        <AnimatePresence>
          {hover !== null && list[hover] && (
            <motion.div
              key={list[hover].title}
              initial={{ opacity: 0, scale: 0.6, rotate: -4 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.45, ease }}
              className="absolute h-[240px] w-[340px] -translate-x-1/2 -translate-y-[115%] overflow-hidden rounded-[22px] shadow-2xl shadow-black/25"
            >
              <img src={list[hover].img} alt="" className="h-full w-full object-cover" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="hidden grid-cols-[60px_2fr_1fr_1fr_1fr_80px] gap-4 border-b border-ink pb-3 font-head text-[10px] uppercase tracking-[0.24em] text-muted md:grid">
        <span>No.</span>
        <span>Project</span>
        <span>Type</span>
        <span>Location</span>
        <span>Area</span>
        <span className="text-right">Year</span>
      </div>
      {list.map((p, i) => (
        <motion.a
          key={p.title}
          href="#contact"
          onMouseEnter={() => setHover(i)}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease, delay: i * 0.04 }}
          className="group relative grid grid-cols-[44px_1fr_auto] items-center gap-4 border-b border-line py-5 md:grid-cols-[60px_2fr_1fr_1fr_1fr_80px] md:py-6"
        >
          <span className="absolute inset-x-[-12px] inset-y-1 -z-0 origin-left scale-x-0 rounded-[18px] bg-surface transition-transform duration-500 ease-expo group-hover:scale-x-100" />
          <span className="relative font-head text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
          <span className="relative font-head text-[clamp(20px,2.2vw,32px)] font-light transition-transform duration-500 ease-expo group-hover:translate-x-2">
            {p.title}
          </span>
          <span className="relative hidden text-sm capitalize text-ink-2 md:block">{p.cat}</span>
          <span className="relative hidden text-sm text-ink-2 md:block">{p.place}</span>
          <span className="relative hidden text-sm text-ink-2 md:block">{p.area}</span>
          <span className="relative text-right font-head text-sm text-muted">{p.year}</span>
        </motion.a>
      ))}
    </div>
  );
}

export default function Projects() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");
  const [view, setView] = useState<"grid" | "index">("grid");
  const list = projects.filter((p) => filter === "all" || p.cat === filter);
  const showWide = filter === "all";

  return (
    <section id="projects" className="mx-auto max-w-[1440px] px-pad section-y">
      <SheetBar n="05" label="Selected work" sheet="P-01" scale="1:500" />
      <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
        <div>
          <Reveal>
            <Parallax distance={-30}><h2 className="display">
              See the work.
              <br />
              <span className="text-muted">{String(list.length).padStart(2, "0")} projects</span>
            </h2></Parallax>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="flex flex-col items-start gap-3 md:items-end">
          <Pills id="view" label="Choose view" items={["grid", "index"] as const} value={view} onChange={setView} />
          <Pills id="filter" label="Filter projects" items={filters} value={filter} onChange={setFilter} />
        </Reveal>
      </div>

      <AnimatePresence mode="wait">
        {view === "grid" ? (
          <motion.div
            key="grid"
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-[clamp(14px,1.6vw,24px)] md:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {list.map((p) => (
                <motion.article
                  layout
                  key={p.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.7, ease }}
                  className={`group flex flex-col ${p.wide && showWide ? "lg:col-span-2" : ""}`}
                >
                  <div
                    data-cursor="View"
                    className={`relative overflow-hidden rounded-[24px] bg-bg-2 ${p.wide && showWide ? "aspect-[4/3.2] lg:aspect-[2.53/1]" : "aspect-[4/3.2]"}`}
                  >
                    <ClipImage
                      src={p.img}
                      alt={p.alt}
                      parallax={10}
                      className="h-full w-full transition-transform duration-[1200ms] ease-expo group-hover:scale-[1.03]"
                      imgClassName="grayscale-[.5] transition-[filter] duration-700 group-hover:grayscale-0"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-white/80 px-3 py-1.5 font-head text-[10px] uppercase tracking-[0.2em] text-ink backdrop-blur-md">
                      {p.place}
                    </span>
                    <span className="absolute bottom-4 right-4 grid h-11 w-11 translate-y-3 place-items-center rounded-full bg-white text-ink opacity-0 transition-all duration-500 ease-expo group-hover:translate-y-0 group-hover:opacity-100">
                      ↗
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between gap-3 pb-1.5 pt-4">
                    <h3 className="text-lg font-normal">{p.title}</h3>
                    <span className="text-xs capitalize text-muted">
                      {p.cat} · {p.area} · {p.year}
                    </span>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div key="index" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ProjectIndex list={list} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
