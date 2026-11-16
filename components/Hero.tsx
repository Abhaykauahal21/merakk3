"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useReady } from "./ReadyProvider";
import Magnetic from "./Magnetic";
import { markFramesReady } from "./frames";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type FrameSet = "desktop" | "mobile";
const src = (set: FrameSet, i: number) => `/sequence/${set}/${String(i + 1).padStart(4, "0")}.webp`;

/** `at` = position in the video (0–1) where the chapter appears. */
const chapters = [
  { k: "01", at: 0.06, title: "From open ground.", text: "Every Merakk home begins by listening to the site." },
  { k: "02", at: 0.3, title: "Structure, honestly built.", text: "Concrete, steel and stone — every line placed with intent." },
  { k: "03", at: 0.78, title: "A home, complete.", text: "Stone, timber, glass and garden — finished inside and out." },
];

// timeline layout (in timeline seconds)
const SEQ_START = 0.4;
const SEQ_LEN = 3.6;

/**
 * Cinematic pinned hero: a construction timelapse (video → frames via
 * scripts/video-to-frames.py) scrubbed on a <canvas> as you scroll.
 * Desktop: frame covers the screen. Mobile: frame fits the width over a blurred backdrop.
 */
export default function Hero() {
  const { ready } = useReady();
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const backdrop = useRef<HTMLCanvasElement>(null);
  const images = useRef<HTMLImageElement[]>([]);
  const total = useRef(85);
  const mode = useRef<FrameSet>("desktop");
  const state = useRef({ p: 0 }); // 0..1 through the video
  const lastDrawn = useRef<HTMLImageElement | null>(null);
  const lastPan = useRef(-1);
  const cutCanvas = useRef<HTMLCanvasElement>(null);
  const cutImg = useRef<HTMLImageElement | null>(null);

  // ---------- preload: first frame, coarse pass, then fill in ----------
  useEffect(() => {
    let cancelled = false;
    mode.current = window.matchMedia("(max-width: 767px)").matches ? "mobile" : "desktop";

    (async () => {
      try {
        const m = await fetch("/sequence/manifest.json").then((r) => r.json());
        if (m?.frames) total.current = m.frames;
      } catch {}
      const N = total.current;
      const imgs: HTMLImageElement[] = new Array(N);
      images.current = imgs;

      const order: number[] = [];
      const seen = new Set<number>();
      for (const step of [N, 16, 8, 4, 2, 1]) {
        for (let i = 0; i < N; i += step) if (!seen.has(i)) (seen.add(i), order.push(i));
        if (!seen.has(N - 1)) (seen.add(N - 1), order.push(N - 1));
      }
      const coarseCount = order.findIndex((_, k) => k > 0 && order[k] % 16 !== 0 && order[k] !== N - 1);
      let loaded = 0;
      let idx = 0;

      const loadNext = () => {
        if (cancelled || idx >= order.length) return;
        const i = order[idx++];
        const im = new Image();
        im.decoding = "async";
        im.src = src(mode.current, i);
        im.onload = () => {
          imgs[i] = im;
          loaded++;
          if (loaded >= Math.max(1, coarseCount)) markFramesReady();
          draw();
          loadNext();
        };
        im.onerror = () => {
          loaded++;
          loadNext();
        };
      };
      for (let k = 0; k < 6; k++) loadNext();
    })();

    const cut = new Image();
    cut.decoding = "async";
    cut.src = `/sequence/cutout-${mode.current}.webp`;
    cut.onload = () => {
      cutImg.current = cut;
      drawCut();
    };

    const onResize = () => {
      lastDrawn.current = null;
      draw();
      drawCut();
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
    };
  }, []);

  function nearestLoaded(f: number) {
    const imgs = images.current;
    const N = imgs.length;
    for (let d = 0; d < N; d++) {
      if (imgs[f - d]) return imgs[f - d];
      if (imgs[f + d]) return imgs[f + d];
    }
    return null;
  }

  function fitCanvas(c: HTMLCanvasElement, scale = 1) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2) * scale;
    const w = Math.round(c.clientWidth * dpr);
    const h = Math.round(c.clientHeight * dpr);
    if (c.width !== w || c.height !== h) {
      c.width = w;
      c.height = h;
    }
  }

  /** where the frame sits inside a canvas (device px) — shared by the frame and the cutout */
  /** mobile: how far the camera has panned across the wide frame (0 = left edge, 1 = right edge) */
  const panFor = (p: number, c: HTMLCanvasElement) =>
    c.width / c.height < 1.25 ? 0.22 + 0.4 * Math.min(1, Math.max(0, p)) : 0.5; // portrait screens pan, landscape stays centred

  function placeRect(c: HTMLCanvasElement, iw: number, ih: number, pan = 0.5) {
    if (mode.current === "desktop") {
      const s = Math.max(c.width / iw, c.height / ih);
      const h = ih * s;
      // when the frame is taller than the canvas, crop from the bottom (lawn), never the roof/sky
      const y = h > c.height ? Math.max(c.height - h, -c.height * 0.02) : (c.height - h) / 2;
      return { x: (c.width - iw * s) * pan, y, w: iw * s, h };
    }
    // mobile: a tall window (68% of the screen) that crops the wide frame and pans across it as you scroll
    const boxH = c.height * 0.68;
    const boxY = c.height * 0.16;
    const s = Math.max(c.width / iw, boxH / ih);
    const w = iw * s;
    const h = ih * s;
    return { x: (c.width - w) * pan, y: boxY + (boxH - h) / 2, w, h, boxY, boxH };
  }

  /** house cut-out (sky removed) drawn exactly over the last frame, so text can sit "behind" the house */
  function drawCut() {
    const c = cutCanvas.current;
    const img = cutImg.current;
    if (!c || !img) return;
    fitCanvas(c);
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
    const r = placeRect(c, img.naturalWidth, img.naturalHeight, panFor(1, c));
    ctx.drawImage(img, r.x, r.y, r.w, r.h);
    // expose the image box (CSS px) so the "behind" headline can align to the roofline
    const dpr = c.width / c.clientWidth;
    const host = c.parentElement;
    host?.style.setProperty("--it", `${r.y / dpr}px`);
    host?.style.setProperty("--ih", `${r.h / dpr}px`);
  }

  function draw() {
    const c = canvas.current;
    if (!c || !images.current.length) return;
    const img = nearestLoaded(Math.round(state.current.p * (images.current.length - 1)));
    const pan = panFor(state.current.p, c);
    if (!img || (img === lastDrawn.current && Math.abs(pan - lastPan.current) < 0.002)) return;
    lastDrawn.current = img;
    lastPan.current = pan;
    fitCanvas(c);
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    const r = placeRect(c, iw, ih, pan);
    if (mode.current === "desktop") {
      ctx.drawImage(img, r.x, r.y, r.w, r.h);
      return;
    }

    // mobile: frame fits the width (slightly zoomed), blurred copy fills the screen behind it
    const b = backdrop.current;
    if (b) {
      fitCanvas(b, 0.25);
      const bctx = b.getContext("2d");
      if (bctx) {
        const s = Math.max(b.width / iw, b.height / ih);
        bctx.drawImage(img, (b.width - iw * s) / 2, (b.height - ih * s) / 2, iw * s, ih * s);
      }
    }
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.drawImage(img, r.x, r.y, r.w, r.h);
  }

  // ---------- intro + scroll story ----------
  useGSAP(
    () => {
      if (!ready) return;
      const mm = gsap.matchMedia();

      mm.add(
        { isMobile: "(max-width: 767px)", isDesktop: "(min-width: 768px)", reduce: "(prefers-reduced-motion: reduce)" },
        (ctx) => {
          const { isMobile, reduce } = ctx.conditions as { isMobile: boolean; reduce: boolean };
          // the opening "window" matches where the frame sits
          const startClip = isMobile ? "inset(16% 5% 16% 5% round 26px)" : "inset(25% 28% 25% 28% round 32px)";
          const startScale = isMobile ? 1 : 0.5;

          const intro = gsap.timeline({ defaults: { ease: "expo.out" } });
          intro
            .fromTo(".h-grid", { opacity: 0 }, { opacity: 1, duration: 1.4 }, 0)
            .fromTo(".h-frame", { clipPath: "inset(50% 50% 50% 50% round 32px)" }, { clipPath: startClip, duration: 1.6 }, 0.1)
            .fromTo(".h-canvas", { scale: startScale * 1.35 }, { scale: startScale, duration: 2 }, 0.1)
            .fromTo(".h-line-inner", { yPercent: 110 }, { yPercent: 0, duration: 1.3, stagger: 0.12 }, 0.35)
            .fromTo(".h-anno", { opacity: 0 }, { opacity: 1, duration: 1, stagger: 0.05 }, 0.9)
            .fromTo(".h-side", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, stagger: 0.1 }, 1);

          if (reduce) {
            state.current.p = 1;
            lastDrawn.current = null;
            draw();
            return;
          }

          const ir = { immediateRender: false };
          const end = isMobile ? "+=260%" : "+=400%";
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end,
              pin: ".h-pin",
              scrub: 1,
              refreshPriority: 10,
              invalidateOnRefresh: true,
              onUpdate: () => {
                if (intro.progress() < 1) intro.progress(1);
              },
            },
          });

          // phase 1 — window opens to full bleed
          tl.fromTo(".h-frame", { clipPath: startClip }, { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 1, ease: "power2.inOut", ...ir }, 0)
            .fromTo(".h-canvas", { scale: startScale }, { scale: 1, duration: 1, ease: "power2.inOut", ...ir }, 0)
            .fromTo(".h-backdrop", { opacity: 0 }, { opacity: 1, duration: 0.8, ...ir }, 0.1)
            .fromTo(".h-line-1", { xPercent: 0, opacity: 1 }, { xPercent: -45, opacity: 0, duration: 0.8, ...ir }, 0)
            .fromTo(".h-line-2", { xPercent: 0, opacity: 1 }, { xPercent: 45, opacity: 0, duration: 0.8, ...ir }, 0)
            .fromTo(".h-anno, .h-side", { opacity: 1 }, { opacity: 0, duration: 0.3, ...ir }, 0)
            .fromTo(".h-grid", { opacity: 1 }, { opacity: 0, duration: 0.6, ...ir }, 0.2)
            // phase 2 — the construction timelapse plays
            .to(state.current, { p: 1, duration: SEQ_LEN, ease: "none", onUpdate: draw }, SEQ_START)
            .fromTo(".h-shade", { opacity: 0 }, { opacity: 1, duration: 0.5, ...ir }, 0.6)
            .fromTo(".h-counter", { opacity: 0 }, { opacity: 1, duration: 0.3, ...ir }, 0.7);

          chapters.forEach((c, i) => {
            const at = SEQ_START + c.at * SEQ_LEN;
            tl.fromTo(`.h-ch-${i}`, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.3, ...ir }, at);
            const next = i < chapters.length - 1 ? SEQ_START + chapters[i + 1].at * SEQ_LEN : SEQ_START + SEQ_LEN - 0.05;
            tl.to(`.h-ch-${i}`, { opacity: 0, y: -40, duration: 0.25 }, next - 0.3);
          });

          // phase 3 — final message + CTAs
          const fin = SEQ_START + SEQ_LEN;
          tl.to(".h-counter", { opacity: 0, duration: 0.2 }, fin - 0.1)
            // the image settles into a smaller rounded card…
            .fromTo(
              ".h-frame",
              { scale: 1, y: 0, clipPath: "inset(0% 0% 0% 0% round 0px)" },
              {
                // card fits between the nav (top gap) and a small bottom margin
                scale: () => {
                  const top = isMobile ? 84 : 104;
                  const bottom = isMobile ? 14 : 22;
                  return (window.innerHeight - top - bottom) / window.innerHeight;
                },
                y: () => ((isMobile ? 84 : 104) - (isMobile ? 14 : 22)) / 2,
                clipPath: `inset(0% 0% 0% 0% round ${isMobile ? 34 : 48}px)`,
                duration: 0.6,
                ease: "power2.inOut",
                ...ir,
              },
              fin - 0.05
            )
            // …the house cut-out switches on over the final frame (pixel-identical)…
            .fromTo(".h-cut", { opacity: 0 }, { opacity: 1, duration: 0.01, ...ir }, fin - 0.04)
            // …and the big headline rises up from behind the roof
            .fromTo(".h-behind-inner", { yPercent: 70, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.6, ease: "power3.out", ...ir }, fin + 0.05)
            .fromTo(".h-reveal > *", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.07, ...ir }, fin + 0.25)
            .fromTo(".h-stat", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, stagger: 0.07, ...ir }, fin + 0.4)
            .to({}, { duration: 0.5 });

          gsap.fromTo(
            ".h-progress",
            { scaleY: 0 },
            { scaleY: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end, scrub: true } }
          );

          ScrollTrigger.sort();
          ScrollTrigger.refresh();

          if (!isMobile) {
            const xTo = gsap.quickTo(".h-parallax", "x", { duration: 1.2, ease: "power3.out" });
            const yTo = gsap.quickTo(".h-parallax", "y", { duration: 1.2, ease: "power3.out" });
            const onMove = (e: MouseEvent) => {
              xTo((e.clientX / window.innerWidth - 0.5) * -24);
              yTo((e.clientY / window.innerHeight - 0.5) * -16);
            };
            window.addEventListener("mousemove", onMove);
            return () => window.removeEventListener("mousemove", onMove);
          }
        }
      );
    },
    { scope: root, dependencies: [ready] }
  );

  // frame counter + stage label without React re-renders
  useEffect(() => {
    let raf = 0;
    const count = root.current?.querySelector<HTMLElement>(".h-count");
    const of = root.current?.querySelector<HTMLElement>(".h-of");
    const stage = root.current?.querySelector<HTMLElement>(".h-stage");
    const stages: [number, string][] = [
      [0, "Site & survey"],
      [0.3, "Foundation"],
      [0.51, "Structure"],
      [0.72, "Envelope"],
      [0.92, "Landscape"],
      [0.99, "Complete"],
    ];
    const tick = () => {
      const N = images.current.length || total.current;
      const p = state.current.p;
      if (count) count.textContent = String(Math.round(p * (N - 1)) + 1).padStart(3, "0");
      if (of) of.textContent = ` / ${N}`;
      if (stage) stage.textContent = [...stages].reverse().find(([t]) => p >= t)?.[1] ?? "";
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section ref={root} id="top" className="relative">
      <div className="h-pin relative h-svh overflow-hidden bg-bg">
        {/* blueprint grid */}
        <div
          aria-hidden
          className="h-grid absolute inset-0 opacity-0 [background-image:linear-gradient(var(--color-line)_1px,transparent_1px),linear-gradient(90deg,var(--color-line)_1px,transparent_1px)] [background-position:center_center] [background-size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        />

        {/* expanding window with the scroll-scrubbed frames */}
        <div className="h-frame absolute inset-0 overflow-hidden bg-dark-2 [clip-path:inset(50%_50%_50%_50%_round_32px)]">
          {/* mobile-only blurred backdrop */}
          <canvas
            ref={backdrop}
            aria-hidden
            className="h-backdrop absolute inset-0 h-full w-full scale-125 opacity-0 [filter:blur(18px)_brightness(.5)] md:hidden"
          />
          <div className="h-parallax absolute inset-0 md:-inset-[2%]">
            <canvas
              ref={canvas}
              role="img"
              aria-label="Timelapse of a Merakk home being built: an empty plot, foundations, structure, finishes, landscaping, then the lights coming on at dusk"
              className="h-canvas h-full w-full"
            />
            {/* headline BEHIND the house: sits over the sky, cut-out canvas covers its lower half */}
            <div
              aria-hidden
              className="h-behind pointer-events-none absolute inset-x-0 overflow-hidden text-center"
              style={{ top: "calc(var(--it, 0px) + var(--ih, 100vh) * 0.035)" }}
            >
              <span className="h-behind-inner block font-head font-medium uppercase leading-[0.86] tracking-[-0.035em] text-white opacity-0 [font-size:min(calc(var(--ih,100vh)*0.175),11.6vw)] [text-shadow:0_10px_60px_rgba(0,0,0,.18)]">
                Spaces shaped
              </span>
            </div>
            <canvas ref={cutCanvas} aria-hidden className="h-cut pointer-events-none absolute inset-0 h-full w-full opacity-0" />
          </div>
          <div className="h-shade absolute inset-0 bg-[linear-gradient(90deg,rgba(18,18,17,.6)_0%,rgba(18,18,17,.18)_45%,rgba(18,18,17,0)_70%),linear-gradient(0deg,rgba(18,18,17,.6)_0%,rgba(18,18,17,0)_42%)] opacity-0" />
          {/* final reveal — inside the card, in front of the house */}
          <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col justify-between gap-8 px-[clamp(22px,4.5vw,72px)] pb-[clamp(24px,6vh,64px)] text-white md:flex-row md:items-end">
            <div className="h-reveal max-w-[640px] [&>*]:opacity-0">
              <p className="eyebrow !text-white/70">Merakk Studios · Architecture & Interiors</p>
              <h2 className="mt-3 font-head text-[clamp(44px,6.4vw,104px)] font-light italic leading-[1] tracking-[-0.03em]">
                <span className="sr-only">Spaces shaped </span>by purpose.
              </h2>
              <p className="mt-5 max-w-[38ch] text-[16px] text-white/80">
                From open ground to a home — we design meaningful spaces that balance people, place and purpose.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Magnetic>
                  <a
                    href="#projects"
                    className="group inline-flex items-center gap-3.5 rounded-full border border-white bg-white px-7 py-[15px] font-head text-[13px] font-medium text-ink transition-colors duration-300 hover:bg-transparent hover:text-white"
                  >
                    View Our Work <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </a>
                </Magnetic>
                <a
                  href="#contact"
                  className="inline-flex items-center rounded-full border border-white/60 px-7 py-[15px] font-head text-[13px] font-medium transition-colors duration-300 hover:bg-white hover:text-ink"
                >
                  Start a Project
                </a>
              </div>
            </div>
            <div className="flex gap-[clamp(20px,3vw,48px)]">
              {[
                ["3+", "Years of practice"],
                ["150+", "Projects delivered"],
                ["24+", "Countries"],
              ].map(([n, l]) => (
                <div key={l} className="h-stat border-l border-white/30 pl-4 opacity-0">
                  <strong className="block font-head text-[clamp(26px,3vw,44px)] font-extralight leading-none">{n}</strong>
                  <span className="mt-1.5 block text-xs text-white/60">{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* blueprint annotations (desktop) */}
        <div aria-hidden className="pointer-events-none absolute inset-0 hidden font-head text-[10px] tracking-[0.2em] text-muted md:block">
          {[
            "left-[28%] top-[25%] -translate-x-1/2 -translate-y-1/2",
            "right-[28%] top-[25%] translate-x-1/2 -translate-y-1/2",
            "left-[28%] bottom-[25%] -translate-x-1/2 translate-y-1/2",
            "right-[28%] bottom-[25%] translate-x-1/2 translate-y-1/2",
          ].map((pos) => (
            <span key={pos} className={`h-anno absolute h-6 w-6 ${pos}`}>
              <span className="absolute left-1/2 top-0 h-full w-px bg-ink/50" />
              <span className="absolute left-0 top-1/2 h-px w-full bg-ink/50" />
            </span>
          ))}
          <div className="h-anno absolute left-[28%] right-[28%] top-[20.5%] flex items-center gap-3">
            <span className="h-2.5 w-px bg-ink/40" />
            <span className="h-px flex-1 bg-ink/30" />
            <span>PLOT 24.60 M</span>
            <span className="h-px flex-1 bg-ink/30" />
            <span className="h-2.5 w-px bg-ink/40" />
          </div>
          <div className="h-anno absolute bottom-[25%] right-[24.5%] top-[25%] flex flex-col items-center gap-3">
            <span className="h-px w-2.5 bg-ink/40" />
            <span className="w-px flex-1 bg-ink/30" />
            <span className="[writing-mode:vertical-rl]">SITE 18.20 M</span>
            <span className="w-px flex-1 bg-ink/30" />
            <span className="h-px w-2.5 bg-ink/40" />
          </div>
          <span className="h-anno absolute left-[28%] top-[77%]">N 23°15′ · E 77°24′</span>
          <span className="h-anno absolute right-[28%] top-[77%]">DAY 001 — SITE</span>
        </div>

        {/* giant headline — inverts over the image */}
        <h1 className="pointer-events-none absolute inset-x-0 top-0 z-10 flex h-full flex-col justify-between px-pad pb-[9vh] pt-[16vh] font-head font-light uppercase leading-[0.9] tracking-[-0.03em] text-white mix-blend-difference md:pb-[6vh] md:pt-[14vh]">
          <span className="h-line-1 block overflow-hidden text-[clamp(30px,10.2vw,200px)]">
            <span className="h-line-inner inline-block">Architecture</span>
          </span>
          <span className="h-line-2 block overflow-hidden text-right text-[clamp(34px,7.4vw,136px)]">
            <span className="h-line-inner inline-block">That lives</span>
            <br />
            <span className="h-line-inner inline-block">with you</span>
          </span>
        </h1>

        {/* side copy */}
        <p className="h-side eyebrow absolute left-[clamp(20px,5vw,72px)] top-[44%] z-10 hidden max-w-[16ch] opacity-0 md:block">
          Spaces that shape a brighter tomorrow
        </p>
        <div className="h-side absolute right-[clamp(20px,5vw,72px)] top-[40%] z-10 hidden flex-col items-center gap-3 opacity-0 md:flex">
          <span className="eyebrow [writing-mode:vertical-rl]">Scroll to build</span>
          <span className="relative h-16 w-px overflow-hidden bg-line">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollLine_1.8s_ease-in-out_infinite] bg-ink" />
          </span>
        </div>

        {/* chapters over the sequence */}
        <div className="pointer-events-none absolute inset-0 z-20 text-white">
          {chapters.map((c, i) => (
            <div
              key={c.k}
              className={`h-ch-${i} absolute bottom-[10vh] left-[clamp(20px,5vw,72px)] right-[clamp(20px,5vw,72px)] max-w-[560px] opacity-0 md:bottom-auto md:top-1/2 md:-translate-y-1/2`}
            >
              <p className="eyebrow !text-white/70">Chapter {c.k}</p>
              <h2 className="mt-3 font-head text-[clamp(34px,4.6vw,76px)] font-light leading-[1.02] tracking-[-0.02em]">{c.title}</h2>
              <p className="mt-4 max-w-[34ch] text-white/80">{c.text}</p>
            </div>
          ))}
        </div>

        {/* frame counter + stage */}
        <div className="h-counter pointer-events-none absolute right-[clamp(20px,5vw,72px)] top-[96px] z-20 text-right font-head text-white opacity-0">
          <span className="h-count text-[clamp(36px,5vw,72px)] font-extralight leading-none">001</span>
          <span className="h-of text-sm text-white/60"> / 85</span>
          <p className="h-stage eyebrow mt-1 !text-white/70">Site &amp; survey</p>
        </div>

        {/* progress rail */}
        <div className="absolute bottom-0 left-0 top-0 z-30 w-[3px]">
          <div className="h-progress h-full origin-top scale-y-0 bg-white/80 mix-blend-difference" />
        </div>

      </div>
    </section>
  );
}
