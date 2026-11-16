"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Reveal from "./Reveal";
import SheetBar from "./SheetBar";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const u = (id: string) => `https://images.unsplash.com/photo-${id}?w=400&q=70&auto=format&fit=crop`;

// words, with inline image "chips" that open up as you scroll
const parts: (string | { img: string; alt: string })[] = [
  "An", "architecture", "practice",
  { img: u("1487958449943-2429e8be8625"), alt: "Angular white facade" },
  "where", "design", "is", "understood", "as", "a", "long-term",
  { img: "/assets/villa-golden.jpg", alt: "Merakk villa at golden hour" },
  "responsibility", "—", "not", "a", "short-term", "statement.",
];

export default function Statement() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const st = { trigger: ".statement-text", start: "top 80%", end: "bottom 40%", scrub: true };
      gsap.fromTo(".word", { opacity: 0.12 }, { opacity: 1, stagger: 0.08, ease: "none", scrollTrigger: st });
      gsap.fromTo(".chip", { width: 0, marginInline: 0 }, { width: "1.9em", marginInline: "0.12em", ease: "power2.out", stagger: 0.4, scrollTrigger: { ...st, end: "center 50%" } });
      gsap.fromTo(".chip img", { scale: 1.6 }, { scale: 1, ease: "none", scrollTrigger: st });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="studio" className="mx-auto max-w-[1440px] px-pad section-y">
      <SheetBar n="02" label="About the studio" sheet="A-02" scale="1:50" />
      <p className="statement-text mb-14 max-w-[24ch] font-head text-[clamp(30px,4.4vw,68px)] font-light leading-[1.14] tracking-[-0.02em]">
        {parts.map((p, i) =>
          typeof p === "string" ? (
            <span key={i} className="word inline-block">
              {p}&nbsp;
            </span>
          ) : (
            <span
              key={i}
              className="chip relative mr-[0.25em] inline-block h-[0.78em] w-0 translate-y-[0.08em] overflow-hidden rounded-full align-baseline"
            >
              <img src={p.img} alt={p.alt} className="absolute inset-0 h-full w-full object-cover" />
            </span>
          )
        )}
      </p>
      <div className="grid gap-10 md:ml-auto md:w-fit md:grid-cols-[minmax(0,40ch)_minmax(0,40ch)]">
        <Reveal>
          <p className="text-[15px] text-ink-2">
            Merakk Studios is a multidisciplinary practice working across architecture, interiors and landscape. Every
            project begins with listening — to the site, the climate and the people who will live with it.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-[15px] text-ink-2">
            We favour honest materials, natural light and quiet detailing, so that what we build feels as right in
            twenty years as it does on the day of handover.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
