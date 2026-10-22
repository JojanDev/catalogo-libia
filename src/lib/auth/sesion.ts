import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "tonorosa_admin";

function tokenEsperado(): string {
  const clave = process.env.MOCK_ADMIN_PASSWORD ?? "tonorosa-demo";
  return createHash("sha256").update(clave).digest("hex");
}

function iguales(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

export async function iniciarSesion(password: string): Promise<boolean> {
  const token = createHash("sha256").update(password).digest("hex");
  if (!iguales(token, tokenEsperado())) return false;
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return true;
}

export async function cerrarSesion(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function haySesion(): Promise<boolean> {
  const jar = await cookies();
  const valor = jar.get(COOKIE)?.value;
  return valor !== undefined && iguales(valor, tokenEsperado());
}
