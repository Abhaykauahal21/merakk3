"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { contact } from "@/lib/data";
import { WhatsAppIcon } from "./Nav";
import { useReady } from "./ReadyProvider";

/**
 * Phone-only action bar pinned to the bottom: Call · WhatsApp · Enquire.
 * Appears once the hero is done, hides again at the contact form / footer.
 */
export default function MobileDock() {
  const { ready } = useReady();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!ready) return;
    const check = () => {
      const a = document.getElementById("approach")?.getBoundingClientRect().top ?? Infinity;
      const c = document.getElementById("contact")?.getBoundingClientRect().top ?? Infinity;
      const f = document.querySelector("footer")?.getBoundingClientRect().top ?? Infinity;
      const vh = window.innerHeight;
      setShow(a < vh * 0.85 && c > vh * 0.5 && f > vh);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [ready]);

  const wa = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(contact.whatsappText)}`;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 0.8, 0.2, 1] }}
          className="fixed inset-x-3 bottom-3 z-40 flex items-center gap-1.5 rounded-full bg-dark-2/92 p-1.5 shadow-[0_14px_40px_-10px_rgba(0,0,0,0.5)] ring-1 ring-white/10 backdrop-blur-xl md:hidden"
          style={{ marginBottom: "env(safe-area-inset-bottom)" }}
        >
          <a
            href={contact.phoneHref}
            aria-label="Call the studio"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/10 text-white"
          >
            <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-none stroke-current [stroke-width:1.7]" aria-hidden>
              <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" strokeLinejoin="round" />
            </svg>
          </a>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp the studio"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#25D366] text-white"
          >
            <WhatsAppIcon className="h-5 w-5" />
          </a>
          <a
            href="#contact"
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-white font-head text-[13px] font-medium text-ink"
          >
            Start a Project <span aria-hidden>→</span>
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
