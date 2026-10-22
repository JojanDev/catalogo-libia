type DecorProps = { className?: string };

export function Rama({ className }: DecorProps) {
  return (
    <svg viewBox="0 0 100 160" aria-hidden="true" className={`pointer-events-none ${className ?? ""}`}>
      <path d="M50 158 C46 110 54 60 60 8" fill="none" strokeWidth="3" strokeLinecap="round" className="stroke-salvia" />
      <ellipse cx="36" cy="120" rx="8" ry="18" transform="rotate(-40 36 120)" className="fill-salvia" />
      <ellipse cx="66" cy="96" rx="8" ry="18" transform="rotate(40 66 96)" className="fill-salvia" />
      <ellipse cx="38" cy="70" rx="8" ry="18" transform="rotate(-40 38 70)" className="fill-salvia" />
      <ellipse cx="68" cy="42" rx="8" ry="18" transform="rotate(40 68 42)" className="fill-salvia" />
      <ellipse cx="58" cy="14" rx="6" ry="13" className="fill-salvia" />
    </svg>
  );
}
