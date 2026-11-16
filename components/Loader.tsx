"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, animate } from "framer-motion";
import { useReady } from "./ReadyProvider";
import { whenFramesReady } from "./frames";

const ease = [0.22, 0.8, 0.2, 1] as const;

export default function Loader() {
  const { setReady } = useReady();
  const [count, setCount] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    // always start the intro from the top of the page
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    document.documentElement.style.overflow = "hidden";
    let stopped = false;
    let controls = animate(0, 88, {
      duration: 1.6,
      ease: [0.6, 0, 0.3, 1],
      onUpdate: (v) => setCount(Math.round(v)),
    });
    // finish only once the first pass of hero frames has arrived (or after a timeout)
    Promise.all([controls.then(() => {}), whenFramesReady(6000)]).then(() => {
      if (stopped) return;
      controls = animate(88, 100, {
        duration: 0.4,
        ease: "easeOut",
        onUpdate: (v) => setCount(Math.round(v)),
        onComplete: () => {
          setShow(false);
          document.documentElement.style.overflow = "";
          setTimeout(() => setReady(true), 250);
        },
      });
    });
    return () => {
      stopped = true;
      controls.stop();
    };
  }, [setReady]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          aria-hidden
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-dark-2 text-white"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 1, ease }}
        >
          <motion.img
            src="/assets/mark-light.png"
            alt=""
            className="w-[74px]"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease }}
          />
          <motion.div
            className="font-head text-xs font-normal tracking-[0.5em]"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.15 }}
          >
            MERAKK STUDIOS
          </motion.div>
          <div className="h-px w-40 bg-white/15">
            <div className="h-full bg-white" style={{ width: `${count}%` }} />
          </div>
          <span className="absolute bottom-8 right-8 font-head text-[64px] font-extralight leading-none text-white/20 md:text-[120px]">
            {String(count).padStart(3, "0")}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
