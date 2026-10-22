type DecorProps = { className?: string };

export function Flor({ className }: DecorProps) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={`pointer-events-none ${className ?? ""}`}>
      {[0, 72, 144, 216, 288].map((giro) => (
        <ellipse
          key={giro}
          cx="50"
          cy="27"
          rx="16"
          ry="24"
          className="fill-rosa-deco"
          transform={`rotate(${giro} 50 50)`}
        />
      ))}
      <circle cx="50" cy="50" r="10" className="fill-flor-centro" />
    </svg>
  );
}
