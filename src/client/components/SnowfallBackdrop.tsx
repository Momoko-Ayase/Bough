const SNOWFLAKES = Array.from({ length: 28 }).map((_, idx) => ({
  id: idx,
  left: `${(idx * 37 + 11) % 100}%`,
  size: 2 + (idx % 4) * 1.15,
  opacity: 0.16 + (idx % 5) * 0.08,
  duration: 14 + (idx % 7) * 3.2,
  delay: -((idx * 2.7) % 18),
  drift: idx % 2 === 0 ? "18px" : "-18px",
}));

export function SnowfallBackdrop({ enabled }: { enabled: boolean }) {
  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {SNOWFLAKES.map((f) => (
        <span
          key={f.id}
          style={
            {
              left: f.left,
              width: `${f.size}px`,
              height: `${f.size}px`,
              opacity: f.opacity,
              animationDuration: `${f.duration}s`,
              animationDelay: `${f.delay}s`,
              "--snow-drift": f.drift,
            } as React.CSSProperties
          }
          className="bough-snowflake absolute -top-3 rounded-full bg-[#F5EFE4]"
        />
      ))}
    </div>
  );
}
