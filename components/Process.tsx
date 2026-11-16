"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { steps } from "@/lib/data";
import SheetBar from "./SheetBar";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const u = (id: string) => `https://images.unsplash.com/photo-${id}?w=900&q=70&auto=format&fit=crop`;
const stepImages = [
  u("1503387762-592deb58ef4e"),
  u("1487958449943-2429e8be8625"),
  u("1600607687644-c7171b42498f"),
  "/assets/villa-golden.jpg",
];

/** Desktop: pinned horizontal track. Mobile: simple vertical stack. */
export default function Process() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const track = root.current!.querySelector<HTMLElement>(".p-track")!;
        const distance = () => track.scrollWidth - window.innerWidth;
        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => "+=" + distance(),
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
        // each card's image drifts inside its frame while the track moves
        gsap.utils.toArray<HTMLElement>(".p-img").forEach((img) => {
          gsap.fromTo(img, { xPercent: -8 }, {
            xPercent: 8,
            ease: "none",
            scrollTrigger: { trigger: img.parentElement, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
          });
        });
        gsap.fromTo(".p-bar", { scaleX: 0 }, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: () => "+=" + distance(), scrub: true },
        });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative overflow-hidden bg-bg lg:h-svh">
      <div className="p-track flex flex-col gap-10 px-pad section-y lg:h-full lg:w-max lg:flex-row lg:items-center lg:gap-[4vw] lg:py-0">
        <div className="lg:w-[34vw] lg:shrink-0">
          <SheetBar n="08" label="Process" sheet="W-01" scale="1:20" className="!mb-8" />
          <h2 className="display mt-4">Every space counts,<br />every detail matters.</h2>
          <p className="mt-6 max-w-[34ch] text-[15px] text-ink-2">
            Four calm, clear stages — the same care whether it is a single room or a resort.
          </p>
          <div className="mt-10 hidden h-px w-[60%] bg-line lg:block">
            <div className="p-bar h-full origin-left bg-ink" />
          </div>
        </div>

        <div className="-mx-[clamp(20px,5vw,72px)] flex snap-x snap-mandatory gap-3 overflow-x-auto px-[clamp(20px,5vw,72px)] [scrollbar-width:none] lg:contents [&::-webkit-scrollbar]:hidden">
        {steps.map((s, i) => (
          <article key={s.n} className="group grid w-[78vw] shrink-0 snap-start gap-5 sm:w-[46vw] lg:w-[30vw]">
            <div className="relative aspect-[4/3.2] overflow-hidden rounded-[24px] bg-bg-2">
              <img
                loading="lazy"
                src={stepImages[i]}
                alt=""
                className="p-img absolute inset-y-0 -left-[10%] h-full w-[120%] max-w-none object-cover grayscale-[.6] transition-[filter] duration-700 group-hover:grayscale-0"
              />
              <span className="absolute left-4 top-3 font-head text-[clamp(56px,6vw,110px)] font-extralight leading-none text-white mix-blend-difference">
                {s.n}
              </span>
            </div>
            <div className="border-t border-line pt-5">
              <h3 className="text-2xl">{s.title}</h3>
              <p className="mt-2 max-w-[36ch] text-[15px] text-ink-2">{s.text}</p>
            </div>
          </article>
        ))}
        </div>
        <div className="hidden lg:block lg:w-[6vw] lg:shrink-0" />
      </div>
    </section>
  );
}
