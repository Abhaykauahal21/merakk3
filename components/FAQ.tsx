"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { contact, faqs } from "@/lib/data";
import Reveal from "./Reveal";
import SheetBar from "./SheetBar";

const ease = [0.22, 0.8, 0.2, 1] as const;

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const wa = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(contact.whatsappText)}`;

  return (
    <section id="faq" className="mx-auto max-w-[1440px] px-pad section-y">
      <SheetBar n="11" label="Questions" sheet="Q-01" />
      <div className="grid gap-[clamp(32px,5vw,88px)] lg:grid-cols-[1fr_1.5fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Reveal>
            <h2 className="display">
              Good questions,
              <br />
              <span className="text-muted">straight answers.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="mt-10 rounded-[32px] bg-dark-2 p-7 text-white">
            <p className="font-head text-xl font-light">Still wondering about something?</p>
            <p className="mt-2 text-sm text-white/60">Message the studio directly — we usually reply the same day.</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <a href={wa} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#25D366] px-5 py-3 font-head text-[13px] font-medium text-white">
                WhatsApp us
              </a>
              <a href="#contact" className="rounded-full border border-white/30 px-5 py-3 font-head text-[13px] font-medium transition-colors hover:bg-white hover:text-ink">
                Send an enquiry
              </a>
            </div>
          </Reveal>
        </div>

        <div className="space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={i * 0.04}>
                <div className={`rounded-[26px] transition-colors duration-500 ${isOpen ? "bg-surface" : "bg-transparent ring-1 ring-line hover:bg-surface/60"}`}>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    className="flex w-full items-center gap-5 px-6 py-5 text-left md:px-7 md:py-6"
                  >
                    <span className="font-head text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex-1 font-head text-[clamp(16px,1.4vw,20px)]">{f.q}</span>
                    <span
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-full transition-all duration-500 ease-expo ${
                        isOpen ? "rotate-45 bg-ink text-surface" : "border border-line"
                      }`}
                      aria-hidden
                    >
                      +
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-${i}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-[62ch] px-6 pb-6 pl-[62px] text-[15px] leading-relaxed text-ink-2 md:px-7 md:pl-[70px]">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
