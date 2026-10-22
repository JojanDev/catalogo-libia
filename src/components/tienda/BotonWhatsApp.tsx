import { MessageCircle } from "lucide-react";

export function BotonWhatsApp({ numero }: { numero: string }) {
  return (
    <a
      href={`https://wa.me/${numero}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="fixed bottom-4 right-4 z-30 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-elevada transition-transform hover:scale-105"
    >
      <MessageCircle className="size-7" aria-hidden="true" />
    </a>
  );
}
