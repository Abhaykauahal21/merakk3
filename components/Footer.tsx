"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Brand } from "./Nav";
import { contact } from "@/lib/data";


const cols = [
  { h: "Pages", links: [["Home", "#top"], ["Projects", "#projects"], ["Studio", "#studio"], ["Contact", "#contact"]] },
  { h: "Services", links: [["Architecture", "#services"], ["Interiors", "#services"], ["Landscape", "#services"], ["Planning", "#services"]] },
  { h: "Follow", links: [["Instagram", "#"], ["LinkedIn", "#"], ["Pinterest", "#"]] },
];

function LocalTime() {
  const [t, setT] = useState("");
  useEffect(() => {
    const fmt = () =>
      new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" }).format(new Date());
    setT(fmt());
    const id = setInterval(() => setT(fmt()), 30_000);
    return () => clearInterval(id);
  }, []);
  return <span suppressHydrationWarning>{t || "--:--"} IST</span>;
}

export default function Footer() {
  const root = useRef<HTMLElement>(null);
  // wordmark letters rise in via IntersectionObserver (whileInView below), not a
  // scroll-position trigger — the footer is the end of the page, so position-based
  // triggers can go stale and leave the letters stuck half-hidden

  return (
    <footer ref={root} className="mx-2 mb-2 overflow-hidden rounded-[32px] bg-dark-2 px-pad pb-7 pt-16 text-white/75 md:mx-4 md:mb-4 md:rounded-[56px] md:pt-20">
      <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[1.2fr_2fr_auto]">
        <div className="space-y-6">
          <Brand light />
          <p className="max-w-[30ch] text-sm text-white/55">
            Architecture, interiors and landscape — designed with patience, built to endure.
          </p>
          <a
            href={`mailto:${contact.email}`}
            className="group inline-flex items-center gap-3 rounded-full border border-white/25 px-5 py-2.5 font-head text-[13px] text-white transition-colors hover:bg-white hover:text-ink"
          >
            {contact.email} <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
        </div>
        <div className="grid grid-cols-2 gap-[clamp(30px,5vw,80px)] sm:grid-cols-3">
          {cols.map((c) => (
            <div key={c.h}>
              <h4 className="mb-3.5 text-[10px] font-medium uppercase tracking-[0.26em] text-white/40">{c.h}</h4>
              {c.links.map(([l, h]) => (
                <a key={l} href={h} className="block py-0.5 text-sm transition-colors hover:text-white">
                  {l}
                </a>
              ))}
            </div>
          ))}
        </div>
        <a
          href="#top"
          aria-label="Back to top"
          className="grid h-[52px] w-[52px] place-items-center rounded-full border border-white/30 transition-colors hover:bg-white hover:text-ink"
        >
          ↑
        </a>
      </div>

      {/* drawing strip: coordinates · scale bar · time */}
      <div className="mx-auto mt-14 flex max-w-[1440px] flex-wrap items-center justify-between gap-6 border-y border-white/10 py-4 font-head text-[10px] uppercase tracking-[0.24em] text-white/45">
        <span>N 23°15′ · E 77°24′</span>
        <span className="flex items-center gap-3">
          <span className="flex h-2 w-40 overflow-hidden rounded-full border border-white/30">
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i} className={`h-full flex-1 ${i % 2 === 0 ? "bg-white/40" : ""}`} />
            ))}
          </span>
          0 — 10 M
        </span>
        <LocalTime />
      </div>

      {/* giant wordmark — sized by container width so it never overflows */}
      <div aria-hidden className="fw mx-auto mt-8 max-w-[1440px] [container-type:inline-size]">
        <motion.div
          initial="hidden"
          whileInView="shown"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ shown: { transition: { staggerChildren: 0.07 } } }}
          className="flex justify-between overflow-hidden pb-[0.06em] font-head text-[21.5cqw] font-semibold leading-[0.9] tracking-[-0.04em]"
        >
          {"MERAKK".split("").map((l, i) => (
            <motion.span
              key={i}
              variants={{ hidden: { y: "105%" }, shown: { y: "0%", transition: { duration: 1.3, ease: [0.16, 1, 0.3, 1] } } }}
              className="fw-letter inline-block bg-gradient-to-b from-white/30 to-white/[0.04] bg-clip-text text-transparent"
            >
              {l}
            </motion.span>
          ))}
        </motion.div>
      </div>

      <div className="mx-auto mt-6 flex max-w-[1440px] flex-col justify-between gap-4 border-t border-white/10 pt-5 text-xs text-white/40 sm:flex-row">
        <span>© {new Date().getFullYear()} Merakk Studios. All rights reserved.</span>
        <span>Studios · Est. 2024</span>
      </div>
    </footer>
  );
}
