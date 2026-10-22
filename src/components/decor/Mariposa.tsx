type DecorProps = { className?: string };

export function Mariposa({ className }: DecorProps) {
  return (
    <svg viewBox="0 0 100 80" aria-hidden="true" className={`pointer-events-none ${className ?? ""}`}>
      <path d="M50 40 C30 0 0 6 8 32 C12 46 34 48 50 40 Z" className="fill-rosa-deco" />
      <path d="M50 40 C70 0 100 6 92 32 C88 46 66 48 50 40 Z" className="fill-rosa-deco" />
      <path d="M50 42 C34 50 24 70 36 74 C46 76 50 58 50 42 Z" className="fill-rosa-medio" />
      <path d="M50 42 C66 50 76 70 64 74 C54 76 50 58 50 42 Z" className="fill-rosa-medio" />
      <rect x="48" y="28" width="4" height="30" rx="2" className="fill-cafe" />
    </svg>
  );
}
