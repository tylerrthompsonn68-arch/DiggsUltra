/**
 * DIGGS (Archivo Black) with "Ultra" (Yellowtail) hooked under its end.
 * Sized in em, so set font-size on the parent (or via className) to scale.
 * Owner-picked option "A+D 3", 2026-11-08.
 */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="DiggsUltra"
      className={`relative inline-block pb-[0.27em] leading-none ${className}`}
    >
      <span aria-hidden="true" className="font-display tracking-[-0.013em] text-ink">
        DIGGS
      </span>
      <span
        aria-hidden="true"
        className="font-script absolute bottom-0 right-[-0.09em] -rotate-[7deg] text-[0.67em] text-accent"
      >
        Ultra
      </span>
    </span>
  );
}
