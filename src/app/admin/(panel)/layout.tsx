import type { Metadata } from "next";
import { BarraLateral } from "@/components/admin/BarraLateral";
import { requerirAdmin } from "@/lib/auth/requerirAdmin";

export const metadata: Metadata = {
  title: { default: "Panel Tonorosa", template: "%s | Panel Tonorosa" },
  robots: { index: false, follow: false },
};

export default async function LayoutPanel({ children }: { children: React.ReactNode }) {
  await requerirAdmin();
  return (
    <div className="min-h-dvh bg-canvas font-body text-cafe md:pl-60">
      <BarraLateral />
      <main className="mx-auto w-full max-w-[1100px] px-4 py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
