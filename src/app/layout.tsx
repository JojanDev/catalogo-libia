import type { Metadata } from "next";
import { Dancing_Script, Marcellus, Nunito } from "next/font/google";
import "./globals.css";

const marcellus = Marcellus({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-marcellus",
  display: "swap",
});

const dancing = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing",
  display: "swap",
});

const nunito = Nunito({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Tonorosa by Leyar",
    template: "%s | Tonorosa by Leyar",
  },
  description: "Moda infantil que hace florecer sonrisas",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es-CO"
      className={`${marcellus.variable} ${dancing.variable} ${nunito.variable} antialiased`}
    >
      <body className="min-h-screen bg-canvas font-body text-cafe">{children}</body>
    </html>
  );
}
