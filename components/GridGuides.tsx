/** Faint drafting-column guides across the page, like an architect's layout grid. */
export default function GridGuides() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[1] px-pad mix-blend-multiply">
      <div className="mx-auto grid h-full max-w-[1440px] grid-cols-4 md:grid-cols-12">
        {Array.from({ length: 12 }, (_, i) => (
          <span
            key={i}
            className={`h-full border-l border-ink/[0.045] ${i === 11 ? "border-r" : ""} ${i >= 4 ? "hidden md:block" : ""} ${i === 3 ? "max-md:border-r" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}
