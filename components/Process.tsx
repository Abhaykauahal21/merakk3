"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useInView, useMotionValue, useReducedMotion } from "framer-motion";
import { steps } from "@/lib/data";
import SheetBar from "./SheetBar";

const DURATION = 5.5; // seconds per step
const ease = [0.22, 0.8, 0.2, 1] as const;

const u = (id: string) => `https://images.unsplash.com/photo-${id}?w=1400&q=75&auto=format&fit=crop`;
const stepImages = [
  u("1503387762-592deb58ef4e"),
  u("1487958449943-2429e8be8625"),
  u("1600607687644-c7171b42498f"),
  "/assets/villa-golden.jpg",
];

/** Line-art icons that draw themselves (one per step) */
type Shape = { t: "circle" | "rect" | "path"; a: Record<string, string | number> };
const icons: Shape[][] = [
  // survey
  [
    { t: "circle", a: { cx: 60, cy: 60, r: 34 } },
    { t: "path", a: { d: "M60 12V34 M60 86V108 M12 60H34 M86 60H108" } },
    { t: "circle", a: { cx: 60, cy: 60, r: 4 } },
  ],
  // concept
  [
    { t: "path", a: { d: "M18 92 L60 20 L102 92 Z" } },
    { t: "path", a: { d: "M34 66 H86" } },
    { t: "path", a: { d: "M18 92 H102" } },
  ],
  // develop
  [
    { t: "rect", a: { x: 18, y: 24, width: 84, height: 72, rx: 8 } },
    { t: "path", a: { d: "M18 56 H60 V96 M60 56 V24 M78 56 H102" } },
  ],
  // deliver
  [
    { t: "path", a: { d: "M14 62 L60 22 L106 62" } },
    { t: "path", a: { d: "M28 56 V100 H92 V56" } },
    { t: "path", a: { d: "M52 100 V76 H68 V100" } },
  ],
];
const Tags = { circle: motion.circle, rect: motion.rect, path: motion.path } as const;
const drawVariants = { hidden: { pathLength: 0, opacity: 0 }, shown: { pathLength: 1, opacity: 1 } };

/**
 * Auto-playing process stage: the image wipes in with a circular reveal, a blueprint icon draws itself,
 * and a progress line fills the active step before moving on. Hover (desktop) pauses; tap a step to jump.
 */
export default function Process() {
  const root = useRef<HTMLElement>(null);
  const inView = useInView(root, { amount: 0.3 });
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState(false);
  const progress = useMotionValue(0);
  const ctl = useRef<ReturnType<typeof animate> | null>(null);
  const paused = hover || !inView || !!reduce;

  useEffect(() => {
    progress.set(0);
    const c = animate(progress, 1, {
      duration: DURATION,
      ease: "linear",
      onComplete: () => setActive((a) => (a + 1) % steps.length),
    });
    ctl.current = c;
    return () => c.stop();
  }, [active, progress]);

  useEffect(() => {
    if (paused) ctl.current?.pause();
    else ctl.current?.play();
  }, [paused, active]);

  return (
    <section ref={root} className="mx-auto max-w-[1440px] px-pad section-y">
      <SheetBar n="08" label="Process" sheet="W-01" scale="1:20" />

      <div
        className="grid items-center gap-[clamp(28px,4vw,72px)] lg:grid-cols-[1fr_1.15fr]"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {/* stage — on phones it comes first, like a hero image */}
        <div className="relative order-first aspect-[4/3.6] overflow-hidden rounded-[32px] bg-dark-2 md:rounded-[48px] lg:order-last lg:aspect-[4/4.2]">
          <AnimatePresence initial={false}>
            <motion.div
              key={active}
              className="absolute inset-0"
              initial={{ clipPath: "circle(0% at 80% 20%)" }}
              animate={{ clipPath: "circle(150% at 80% 20%)" }}
              exit={{ opacity: 0, transition: { delay: 1.1, duration: 0.2 } }}
              transition={{ duration: 1.2, ease }}
            >
              <motion.img
                src={stepImages[active]}
                alt=""
                className="h-full w-full object-cover"
                initial={{ scale: 1.32 }}
                animate={{ scale: 1.06 }}
                transition={{ duration: DURATION + 2, ease: "linear" }}
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-black/20" />

          {/* drawing icon */}
          <div className="absolute right-4 top-4 grid h-20 w-20 place-items-center rounded-full bg-black/30 backdrop-blur-md md:right-7 md:top-7 md:h-28 md:w-28">
            <AnimatePresence mode="wait" initial={false}>
              <motion.svg
                key={active}
                viewBox="0 0 120 120"
                className="h-14 w-14 fill-none stroke-white [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:2.2] md:h-20 md:w-20"
                initial="hidden"
                animate="shown"
                exit={{ opacity: 0 }}
                aria-hidden
              >
                {icons[active].map((sh, k) => {
                  const Tag = Tags[sh.t];
                  return <Tag key={k} {...sh.a} variants={drawVariants} transition={{ duration: 1.2, delay: 0.3 + k * 0.25, ease: "easeInOut" }} />;
                })}
              </motion.svg>
            </AnimatePresence>
          </div>

          {/* caption */}
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-white md:p-8">
            <div className="overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={active}
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-110%" }}
                  transition={{ duration: 0.6, ease }}
                  className="font-head text-[clamp(48px,7vw,104px)] font-extralight leading-[0.9]"
                >
                  {steps[active].n}
                </motion.p>
              </AnimatePresence>
            </div>
            <span className="rounded-full bg-white/15 px-4 py-2 font-head text-[10px] uppercase tracking-[0.24em] backdrop-blur-md">
              Stage {active + 1} / {steps.length}
            </span>
          </div>
        </div>

        {/* steps list */}
        <div>
          <h2 className="display">
            Every space counts,
            <br />
            <span className="text-muted">every detail matters.</span>
          </h2>
          <ul className="mt-8 border-t border-line md:mt-10">
            {steps.map((s, i) => {
              const on = active === i;
              return (
                <li key={s.n} className="relative border-b border-line">
                  <button
                    onClick={() => setActive(i)}
                    aria-current={on}
                    className="flex w-full items-baseline gap-4 py-4 text-left md:gap-5 md:py-5"
                  >
                    <span className={`font-head text-xs transition-colors duration-500 ${on ? "text-ink" : "text-muted"}`}>{s.n}</span>
                    <span
                      className={`font-head text-[clamp(22px,2.4vw,34px)] font-light transition-all duration-500 ease-expo ${
                        on ? "translate-x-2 text-ink" : "text-muted"
                      }`}
                    >
                      {s.title}
                    </span>
                    <span
                      className={`ml-auto grid h-8 w-8 place-items-center self-center rounded-full border text-sm transition-all duration-500 ${
                        on ? "border-ink bg-ink text-surface" : "border-line text-muted"
                      }`}
                      aria-hidden
                    >
                      {on ? "●" : "+"}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-[40ch] pb-5 pl-9 text-[15px] text-ink-2 md:pl-10">{s.text}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {/* progress line for the active step */}
                  <motion.span
                    aria-hidden
                    className="absolute -bottom-px left-0 h-[2px] w-full origin-left bg-ink"
                    style={{ scaleX: on ? progress : 0 }}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
