type DecorProps = { className?: string };

export function Ola({ className }: DecorProps) {
  return (
    <svg
      viewBox="0 0 1440 60"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`pointer-events-none block w-full ${className ?? ""}`}
    >
      <path d="M0 60 L0 30 C240 -10 480 -10 720 25 C960 60 1200 60 1440 20 L1440 60 Z" className="fill-rosa-suave" />
    </svg>
  );
}
