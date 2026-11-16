"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = {
  /** px travelled over the element's trip through the viewport. Positive = drifts up faster than the page, negative = lags behind it. */
  distance?: number;
  axis?: "y" | "x";
  /** optional rotation (deg) applied across the same trip */
  rotate?: number;
  className?: string;
  children: React.ReactNode;
};

/**
 * Scroll-linked parallax wrapper. The outer element is the (un-transformed) trigger,
 * the inner one is moved — so ScrollTrigger measurements never drift.
 * Halved on phones, disabled with prefers-reduced-motion.
 */
export default function Parallax({ distance = 60, axis = "y", rotate = 0, className = "", children }: Props) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ ok: "(prefers-reduced-motion: no-preference)", mobile: "(max-width: 767px)" }, (ctx) => {
        const { ok, mobile } = ctx.conditions as { ok: boolean; mobile: boolean };
        if (!ok) return;
        const d = distance * (mobile ? 0.5 : 1);
        gsap.fromTo(
          inner.current,
          { [axis]: d / 2, rotate: -rotate / 2 },
          {
            [axis]: -d / 2,
            rotate: rotate / 2,
            ease: "none",
            force3D: true,
            scrollTrigger: { trigger: outer.current, start: "top bottom", end: "bottom top", scrub: 0.6 },
          }
        );
      });
    },
    { scope: outer }
  );

  return (
    <div ref={outer} className={className}>
      <div ref={inner} className="will-change-transform">
        {children}
      </div>
    </div>
  );
}
