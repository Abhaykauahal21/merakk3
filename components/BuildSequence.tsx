"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const stages = ["Site & survey", "Structure", "Slabs & volume", "Envelope & light", "Landscape", "Home"];

/**
 * Pinned scroll story: a blueprint of the house draws itself stage by stage,
 * then the finished photograph wipes in over the drawing.
 */
export default function BuildSequence() {
  const root = useRef<HTMLElement>(null);
  const [stage, setStage] = useState(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ isMobile: "(max-width: 767px)", isDesktop: "(min-width: 768px)" }, (ctx) => {
        const { isMobile } = ctx.conditions as { isMobile: boolean };

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: isMobile ? "+=300%" : "+=420%",
            pin: ".build-pin",
            scrub: 0.8,
            onUpdate: (self) => {
              const p = self.progress;
              setStage(p < 0.14 ? 0 : p < 0.3 ? 1 : p < 0.44 ? 2 : p < 0.62 ? 3 : p < 0.76 ? 4 : 5);
            },
          },
        });

        tl.to(".g-site .draw", { strokeDashoffset: 0, duration: 1, stagger: 0.15 })
          .to(".g-structure .draw", { strokeDashoffset: 0, duration: 1, stagger: 0.12 })
          .to(".g-slabs .draw", { strokeDashoffset: 0, duration: 0.8, stagger: 0.2 })
          .to(".g-slabs .fill-soft", { fillOpacity: 1, duration: 0.4 }, "<0.5")
          .to(".g-envelope .draw", { strokeDashoffset: 0, duration: 1.2, stagger: 0.1 })
          .to(".g-envelope [class*='fill-']", { fillOpacity: 1, duration: 0.5 }, "<0.8")
          .to(".g-landscape .draw", { strokeDashoffset: 0, duration: 1, stagger: 0.1 })
          .to(".build-photo", { clipPath: "inset(0 0% 0 0)", duration: 1.4, ease: "power2.inOut" }, "+=0.2")
          .fromTo(".build-photo img", { scale: 1.15 }, { scale: 1, duration: 1.4, ease: "power2.out" }, "<")
          .to(".build-svg", { opacity: 0, duration: 0.4 }, "<0.8")
          .to(".build-caption", { opacity: 1, y: 0, duration: 0.5 }, "<0.3")
          .to({}, { duration: 0.6 });

        // progress bar follows the same scroll
        gsap.to(".build-bar", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: isMobile ? "+=300%" : "+=420%",
            scrub: true,
          },
        });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="build" className="relative border-y border-line bg-surface">
      <div className="build-pin mx-auto grid h-svh max-w-[1440px] grid-rows-[auto_1fr_auto] overflow-hidden px-pad pb-8 pt-[84px] md:pt-[100px]">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="eyebrow">How a Merakk home comes together</p>
            <h2 className="display mt-2.5">
              From open ground
              <br />
              to a home.
            </h2>
          </div>
          <p className="hidden max-w-[30ch] text-[15px] text-ink-2 md:block">
            Keep scrolling — every line is placed with intent, from the first survey peg to the final light.
          </p>
        </div>

        <div className="relative grid min-h-0 place-items-center">
          <svg className="build-svg h-full max-h-[62vh] w-full" viewBox="0 0 1200 620" fill="none" aria-hidden>
            <g className="g-site">
              <line className="draw" pathLength={1} x1="40" y1="520" x2="1160" y2="520" />
              <rect className="draw" pathLength={1} x="170" y="470" width="860" height="70" />
              <path className="draw" pathLength={1} d="M170 470 v-14 M170 463 h40 M1030 470 v-14 M1030 463 h-40" />
              <path className="draw thin" pathLength={1} d="M170 575 h860 M170 568 v14 M1030 568 v14" />
              <path className="draw thin" pathLength={1} d="M300 520 v-8 M430 520 v-8 M560 520 v-8 M690 520 v-8 M820 520 v-8 M950 520 v-8" />
            </g>
            <g className="g-structure">
              <rect className="draw" pathLength={1} x="210" y="496" width="780" height="24" />
              <path className="draw" pathLength={1} d="M250 496 V330 M262 496 V330" />
              <path className="draw" pathLength={1} d="M470 496 V330 M482 496 V330" />
              <path className="draw" pathLength={1} d="M700 496 V330 M712 496 V330" />
              <path className="draw" pathLength={1} d="M930 496 V330 M942 496 V330" />
              <path className="draw" pathLength={1} d="M360 312 V172 M372 312 V172" />
              <path className="draw" pathLength={1} d="M920 312 V172 M932 312 V172" />
            </g>
            <g className="g-slabs">
              <rect className="draw fill-soft" pathLength={1} x="180" y="312" width="880" height="20" />
              <rect className="draw fill-soft" pathLength={1} x="300" y="150" width="700" height="24" />
            </g>
            <g className="g-envelope">
              <rect className="draw fill-stone" pathLength={1} x="210" y="332" width="110" height="164" />
              <path className="draw thin" pathLength={1} d="M210 360 H320 M210 390 H320 M210 420 H320 M210 450 H320 M210 478 H320 M250 332 v28 M285 360 v30 M240 390 v30 M290 420 v30 M255 450 v28" />
              <rect className="draw fill-glass" pathLength={1} x="330" y="340" width="590" height="150" />
              <path className="draw thin" pathLength={1} d="M400 340 V490 M470 340 V490 M545 340 V490 M620 340 V490 M700 340 V490 M775 340 V490 M850 340 V490" />
              <rect className="draw fill-wall" pathLength={1} x="372" y="174" width="548" height="138" />
              <path
                className="draw fins"
                pathLength={1}
                d={Array.from({ length: 20 }, (_, i) => `M${520 + i * 20} 178 V308`).join(" ")}
              />
              <path className="draw thin" pathLength={1} d="M190 312 V262 H360 M190 287 H360" />
            </g>
            <g className="g-landscape">
              <path className="draw" pathLength={1} d="M380 548 h440 l-20 22 h-400 z" />
              <path className="draw thin" pathLength={1} d="M420 558 q20 -6 40 0 t40 0 t40 0 M600 560 q20 -6 40 0 t40 0 t40 0" />
              <path className="draw" pathLength={1} d="M100 520 V430 M100 470 l-24 -20 M100 455 l22 -18" />
              <path className="draw thin" pathLength={1} d="M100 440 c-60 -10 -70 -90 -10 -110 c10 -40 70 -40 80 0 c55 15 45 100 -10 110 z" />
              <path className="draw" pathLength={1} d="M1100 520 V450 M1100 480 l18 -16" />
              <path className="draw thin" pathLength={1} d="M1100 455 c-45 -5 -55 -70 -5 -85 c10 -30 55 -30 60 0 c45 12 35 80 -10 85 z" />
              <path className="draw thin" pathLength={1} d="M60 520 q10 -20 20 0 q10 -20 20 0 q10 -20 20 0 q10 -20 20 0 M1050 520 q10 -20 20 0 q10 -20 20 0 q10 -20 20 0 q10 -20 20 0" />
            </g>
          </svg>

          <div className="build-photo absolute inset-y-[18%] inset-x-0 overflow-hidden [clip-path:inset(0_100%_0_0)] md:inset-y-[4%]">
            <img
              src="/assets/villa-golden.jpg"
              alt="Completed Merakk residence at golden hour with timber fins and a pool"
              className="h-full w-full object-cover"
            />
            <div className="build-caption absolute bottom-0 left-0 right-0 flex translate-y-4 items-end justify-between bg-gradient-to-t from-black/60 to-transparent p-5 text-white opacity-0 md:p-8">
              <span className="font-head text-lg font-light md:text-2xl">Golden Hour Residence</span>
              <span className="font-head text-[10px] uppercase tracking-[0.26em] text-white/70">Completed · 2025</span>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <ol className="grid grid-cols-3 gap-2.5 md:grid-cols-6">
            {stages.map((s, i) => (
              <li
                key={s}
                className={`font-head text-xs transition-colors duration-500 ${i <= stage ? "text-ink" : "text-muted"}`}
              >
                <span className="mb-0.5 block text-[10px] tracking-[0.2em]">{String(i + 1).padStart(2, "0")}</span>
                {s}
              </li>
            ))}
          </ol>
          <div className="h-px bg-line">
            <div className="build-bar h-full origin-left scale-x-0 bg-ink" />
          </div>
        </div>
      </div>
    </section>
  );
}
