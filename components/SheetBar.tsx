"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = {
  n: string;
  label: string;
  sheet: string;
  scale?: string;
  dark?: boolean;
  className?: string;
};

/**
 * Architectural drawing "title strip" that sits at the top of a section:
 * 01 — Approach ················ SHEET A-01 · SCALE 1:100 · [scale bar] · N↑
 * The rule draws itself in when it enters the viewport.
 */
export default function SheetBar({ n, label, sheet, scale = "1:100", dark = false, className = "" }: Props) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(".sb-rule", { scaleX: 0 }, {
        scaleX: 1,
        duration: 1.4,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 92%", once: true },
      });
      gsap.fromTo(".sb-item", { opacity: 0, y: 10 }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.06,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 92%", once: true },
      });
    },
    { scope: root }
  );

  const muted = dark ? "text-white/50" : "text-muted";
  const line = dark ? "bg-white/20" : "bg-line";
  const ink = dark ? "border-white/50" : "border-ink/50";

  return (
    <div ref={root} className={`col-span-full mb-[clamp(24px,5vw,72px)] ${className}`}>
      <div className={`flex items-center justify-between gap-4 pb-3 font-head text-[10px] uppercase tracking-[0.24em] ${muted}`}>
        <span className="sb-item flex items-center gap-3">
          <span className={`grid h-7 w-7 place-items-center rounded-full border text-[10px] tracking-normal ${ink} ${dark ? "text-white" : "text-ink"}`}>
            {n}
          </span>
          {label}
        </span>
        <span className="flex items-center gap-5">
          <span className="sb-item hidden sm:inline">Sheet {sheet}</span>
          <span className="sb-item hidden md:inline">Scale {scale}</span>
          {/* scale bar */}
          <span className={`sb-item hidden h-[7px] w-20 overflow-hidden rounded-full border md:flex ${ink}`}>
            {Array.from({ length: 4 }, (_, i) => (
              <span key={i} className={`h-full flex-1 ${i % 2 === 0 ? (dark ? "bg-white/50" : "bg-ink/50") : ""}`} />
            ))}
          </span>
          {/* north arrow */}
          <span className={`sb-item grid h-7 w-7 place-items-center rounded-full border ${ink}`} aria-label="North">
            <svg viewBox="0 0 12 12" className={`h-3 w-3 ${dark ? "fill-white" : "fill-ink"}`} aria-hidden>
              <path d="M6 0 L10 11 L6 8.5 L2 11 Z" />
            </svg>
          </span>
        </span>
      </div>
      <div className={`sb-rule h-px origin-left ${line}`} />
    </div>
  );
}
