"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  /** direction the curtain opens from */
  from?: "bottom" | "left" | "right";
  /** scroll parallax strength in % of the image height */
  parallax?: number;
  delay?: number;
};

const startClip = {
  bottom: "inset(100% 0% 0% 0%)",
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
};

/** Image that wipes open when it scrolls into view, then drifts with a subtle parallax. */
export default function ClipImage({ src, alt, className = "", imgClassName = "", from = "bottom", parallax = 8, delay = 0 }: Props) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        root.current,
        { clipPath: startClip[from] },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.4,
          ease: "expo.inOut",
          delay,
          scrollTrigger: { trigger: root.current, start: "top 88%", once: true },
        }
      );
      gsap.fromTo(".ci-img", { scale: 1.35 }, {
        scale: 1.08,
        duration: 1.8,
        ease: "expo.out",
        delay,
        scrollTrigger: { trigger: root.current, start: "top 88%", once: true },
      });
      if (parallax) {
        gsap.fromTo(
          ".ci-wrap",
          { yPercent: -parallax / 2 },
          {
            yPercent: parallax / 2,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
          }
        );
      }
    },
    { scope: root }
  );

  return (
    <div ref={root} className={`relative overflow-hidden ${className}`}>
      <div className="ci-wrap absolute inset-[-6%_0]">
        <img loading="lazy" src={src} alt={alt} className={`ci-img h-full w-full object-cover ${imgClassName}`} />
      </div>
    </div>
  );
}
