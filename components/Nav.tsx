"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { contact, navLinks } from "@/lib/data";
import { useReady } from "./ReadyProvider";
import Magnetic from "./Magnetic";

const ease = [0.22, 0.8, 0.2, 1] as const;

export function Brand({ light = false }: { light?: boolean }) {
  return (
    <a href="#top" className="inline-flex items-center gap-3" aria-label="Merakk Studios home">
      <img src={light ? "/assets/mark-light.png" : "/assets/mark-dark.png"} alt="" className="h-auto w-[34px]" />
      <span className="flex flex-col leading-none">
        <span className={`font-head text-[17px] font-medium tracking-[0.38em] ${light ? "text-white" : ""}`}>MERAKK</span>
        <span className={`mt-1 font-head text-[8.5px] uppercase tracking-[0.3em] ${light ? "text-white/55" : "text-muted"}`}>
          Architecture Studio
        </span>
      </span>
    </a>
  );
}

export function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91A9.86 9.86 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.22 8.22 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.29Z" />
    </svg>
  );
}

const pill = "pointer-events-auto rounded-full bg-bg/80 ring-1 ring-line/80 backdrop-blur-xl shadow-[0_10px_40px_-14px_rgba(0,0,0,0.28)]";

export default function Nav() {
  const { ready } = useReady();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#top");

  // highlight the section in view (used in the menu overlay)
  useEffect(() => {
    const ids = ["studio", "projects", "services", "contact"];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    const onTop = () => window.scrollY < 300 && setActive("#top");
    window.addEventListener("scroll", onTop, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onTop);
    };
  }, []);

  // lock page scroll + close on Escape while the menu is open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const wa = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(contact.whatsappText)}`;

  return (
    <>
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={ready ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.6, ease }}
        className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-3 px-3 pt-3 md:px-6 md:pt-5"
      >
        {/* left — logo */}
        <a href="#top" aria-label="Merakk Studios home" className={`${pill} flex items-center px-4 py-1.5 md:px-6 md:py-2`}>
          <img src="/assets/logo-nav.png" alt="Merakk Studios" width={383} height={320} className="h-[46px] w-auto md:h-[56px]" />
        </a>

        {/* right — menu + CTAs */}
        <div className={`${pill} flex items-center gap-1.5 p-1.5`}>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="group flex items-center gap-2.5 rounded-full px-4 py-2.5 font-head text-[13px] font-medium transition-colors hover:bg-ink/5"
          >
            <span className="relative block h-3 w-4">
              <span className={`absolute left-0 h-[1.5px] w-full bg-ink transition-all duration-300 ${open ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 h-[1.5px] bg-ink transition-all duration-300 ${open ? "top-1.5 w-full -rotate-45" : "top-[10px] w-2.5 group-hover:w-full"}`} />
            </span>
            <span className="hidden sm:inline">{open ? "Close" : "Menu"}</span>
          </button>

          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with Merakk Studios on WhatsApp"
            className="hidden items-center gap-2 rounded-full border border-line bg-surface px-3 py-2.5 font-head text-[13px] font-medium text-ink transition-colors hover:border-[#25D366] hover:bg-[#25D366] hover:text-white md:flex md:px-4"
          >
            <WhatsAppIcon className="h-[18px] w-[18px]" />
            <span className="hidden lg:inline">WhatsApp</span>
          </a>

          <Magnetic strength={0.25}>
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="group hidden items-center gap-3 rounded-full bg-ink px-5 py-2.5 font-head text-[13px] font-medium text-surface transition-colors hover:bg-ink-2 md:inline-flex"
            >
              Start a Project <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
          </Magnetic>
        </div>
      </motion.header>

      {/* full-screen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 overflow-y-auto bg-bg"
            initial={{ clipPath: "inset(0 0 100% 0 round 0 0 48px 48px)" }}
            animate={{ clipPath: "inset(0 0 0% 0 round 0 0 0px 0px)" }}
            exit={{ clipPath: "inset(0 0 100% 0 round 0 0 48px 48px)" }}
            transition={{ duration: 0.7, ease }}
          >
            <div className="mx-auto grid min-h-full max-w-[1440px] gap-12 px-pad pb-12 pt-32 md:grid-cols-[1.6fr_1fr] md:items-end md:pt-40">
              <nav aria-label="Primary" className="flex flex-col">
                {navLinks.map((l, i) => (
                  <motion.a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.06, duration: 0.7, ease }}
                    className="group flex items-baseline gap-5 border-b border-line py-3 md:py-4"
                  >
                    <span className="font-head text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                    <span
                      className={`font-head text-[clamp(40px,7vw,104px)] font-light leading-none tracking-[-0.03em] transition-transform duration-500 ease-expo group-hover:translate-x-3 ${
                        active === l.href ? "italic" : ""
                      }`}
                    >
                      {l.label}
                    </span>
                    <span className="ml-auto self-center opacity-0 transition-opacity group-hover:opacity-100">→</span>
                  </motion.a>
                ))}
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.7, ease }}
                className="space-y-8 text-[15px]"
              >
                <div className="overflow-hidden rounded-[28px]">
                  <img src="/sequence/desktop/0085.webp" alt="" className="aspect-[16/10] w-full object-cover" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="eyebrow mb-1.5">Email</p>
                    <a href={`mailto:${contact.email}`} className="border-b border-line hover:border-ink">{contact.email}</a>
                  </div>
                  <div>
                    <p className="eyebrow mb-1.5">Call</p>
                    <a href={contact.phoneHref} className="border-b border-line hover:border-ink">{contact.phone}</a>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 font-head text-[13px] font-medium text-white"
                  >
                    <WhatsAppIcon className="h-4 w-4" /> WhatsApp us
                  </a>
                  <a
                    href="#contact"
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 font-head text-[13px] font-medium text-surface"
                  >
                    Start a Project →
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
