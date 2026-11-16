"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { contact } from "@/lib/data";
import Reveal from "./Reveal";
import SheetBar from "./SheetBar";
import Parallax from "./Parallax";

const fieldCls =
  "w-full rounded-none border-0 border-b bg-transparent pb-2.5 pt-2 text-base text-ink outline-none transition-colors focus:border-ink";
const labelCls = "font-head text-[10px] uppercase tracking-[0.24em] text-muted";

export default function Contact() {
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [sent, setSent] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const next = { name: !name, email: !/^\S+@\S+\.\S+$/.test(email) };
    setErrors(next);
    if (next.name || next.email) return;
    // TODO: connect to an email service / API route
    setSent(name.split(" ")[0]);
    e.currentTarget.reset();
  }

  return (
    <section id="contact" className="mx-auto grid max-w-[1440px] gap-[clamp(40px,6vw,100px)] px-pad section-y lg:grid-cols-[1.3fr_1fr]">
      <SheetBar n="12" label="Have a site in mind?" sheet="C-01" />
      <div>
        <Reveal delay={0.05}>
          <Parallax distance={-30}><h2 className="display mt-4 !text-[clamp(40px,6vw,92px)]">Let’s draw your<br />next space.</h2></Parallax>
        </Reveal>
        <Reveal delay={0.1} className="mt-14 grid gap-7 sm:grid-cols-2">
          {[
            ["Email", <a key="e" href={`mailto:${contact.email}`} className="border-b border-line hover:border-ink">{contact.email}</a>],
            ["Call", <a key="c" href={contact.phoneHref} className="border-b border-line hover:border-ink">{contact.phone}</a>],
            ["Studio", <p key="s">{contact.address}</p>],
            ["Hours", <p key="h">{contact.hours}</p>],
          ].map(([k, v]) => (
            <div key={k as string} className="text-[15px]">
              <span className={`${labelCls} mb-1.5 block`}>{k}</span>
              {v}
            </div>
          ))}
        </Reveal>
      </div>

      <Parallax distance={56}>
      <Reveal delay={0.1}>
        <form onSubmit={onSubmit} noValidate className="grid gap-6 rounded-[28px] bg-surface p-[clamp(28px,3.4vw,48px)]">
          <label className="grid gap-1.5">
            <span className={labelCls}>Your name</span>
            <input name="name" autoComplete="name" className={`${fieldCls} ${errors.name ? "border-red-800" : "border-line"}`} />
          </label>
          <label className="grid gap-1.5">
            <span className={labelCls}>Email</span>
            <input name="email" type="email" autoComplete="email" className={`${fieldCls} ${errors.email ? "border-red-800" : "border-line"}`} />
          </label>
          <label className="grid gap-1.5">
            <span className={labelCls}>Project type</span>
            <select name="type" className={`${fieldCls} select-arrow border-line`}>
              <option>Residential</option>
              <option>Commercial</option>
              <option>Hospitality</option>
              <option>Interiors</option>
              <option>Something else</option>
            </select>
          </label>
          <label className="grid gap-1.5">
            <span className={labelCls}>Tell us about it</span>
            <textarea name="message" rows={3} className={`${fieldCls} resize-y border-line`} />
          </label>
          <button
            type="submit"
            className="group inline-flex w-full items-center justify-center gap-3.5 rounded-full border border-ink bg-ink px-6 py-[15px] font-head text-[13px] font-medium text-surface transition-colors duration-300 hover:bg-transparent hover:text-ink"
          >
            Send enquiry <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </button>
          <div className="min-h-[1.4em] text-sm text-ink-2" role="status">
            <AnimatePresence mode="wait">
              {(errors.name || errors.email) && !sent && (
                <motion.p key="err" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  Please add your name and a valid email.
                </motion.p>
              )}
              {sent && (
                <motion.p key="ok" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                  Thank you{sent ? `, ${sent}` : ""} — we’ll be in touch within two working days.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </form>
      </Reveal>
      </Parallax>
    </section>
  );
}
