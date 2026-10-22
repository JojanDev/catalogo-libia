type ContenedorProps = {
  className?: string;
  children: React.ReactNode;
};

export function Contenedor({ className, children }: ContenedorProps) {
  return (
    <div className={`mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8 ${className ?? ""}`}>
      {children}
    </div>
  );
}
