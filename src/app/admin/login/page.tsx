import type { Metadata } from "next";
import { FormularioLogin } from "@/components/admin/FormularioLogin";

export const metadata: Metadata = {
  title: "Ingresar | Panel Tonorosa",
  robots: { index: false, follow: false },
};

export default function PaginaLogin() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-canvas px-4 py-10">
      <FormularioLogin />
    </main>
  );
}
