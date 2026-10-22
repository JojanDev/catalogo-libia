type DecorProps = { className?: string };

export function Corazon({ className }: DecorProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={`pointer-events-none ${className ?? ""}`}>
      <path
        d="M12 21 C5 15 2 11.5 2 8 A5 5 0 0 1 12 6 A5 5 0 0 1 22 8 C22 11.5 19 15 12 21 Z"
        fill="none"
        strokeWidth="1.6"
        strokeLinejoin="round"
        className="stroke-rosa-deco"
      />
    </svg>
  );
}
