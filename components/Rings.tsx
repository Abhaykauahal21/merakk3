import Parallax from "./Parallax";

/**
 * Big, faint outline circles/arcs that float at different speeds behind a section —
 * adds depth (and echoes the studio's curved look). Purely decorative.
 * The parent section needs `relative isolate`.
 */
export default function Rings({ variant = "a" }: { variant?: "a" | "b" | "c" }) {
  const layouts = {
    a: [
      { cls: "-right-[8%] top-[6%] h-[min(46vw,560px)] w-[min(46vw,560px)]", d: 260 },
      { cls: "left-[-6%] bottom-[8%] h-[min(30vw,360px)] w-[min(30vw,360px)]", d: -160 },
    ],
    b: [
      { cls: "-left-[10%] top-[10%] h-[min(50vw,620px)] w-[min(50vw,620px)]", d: 300 },
      { cls: "right-[4%] bottom-[4%] h-[min(22vw,260px)] w-[min(22vw,260px)]", d: -220 },
    ],
    c: [
      { cls: "right-[-12%] top-[30%] h-[min(56vw,680px)] w-[min(56vw,680px)]", d: 340 },
      { cls: "left-[8%] top-[4%] h-[min(18vw,200px)] w-[min(18vw,200px)]", d: -200 },
    ],
  }[variant];

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {layouts.map((l, i) => (
        <Parallax key={i} distance={l.d} className={`absolute ${l.cls}`}>
          <span className="block aspect-square w-full rounded-full border border-ink/[0.07]" />
          <span className="absolute inset-[14%] rounded-full border border-ink/[0.05]" />
        </Parallax>
      ))}
    </div>
  );
}
