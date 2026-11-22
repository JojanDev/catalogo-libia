import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "tonorosa_admin";
const DURACION_SEGUNDOS = 60 * 60 * 8;

function variable(nombre: "ADMIN_PASSWORD" | "SESSION_SECRET"): string {
  const valor = process.env[nombre];
  if (!valor) throw new Error(`Falta la variable de entorno ${nombre}.`);
  return valor;
}

function iguales(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

function huella(texto: string): string {
  return createHash("sha256").update(texto).digest("hex");
}

function firmar(expira: string): string {
  return createHmac("sha256", variable("SESSION_SECRET")).update(expira).digest("hex");
}

export async function iniciarSesion(password: string): Promise<boolean> {
  if (!iguales(huella(password), huella(variable("ADMIN_PASSWORD")))) return false;
  const expira = String(Math.floor(Date.now() / 1000) + DURACION_SEGUNDOS);
  const jar = await cookies();
  jar.set(COOKIE, `${expira}.${firmar(expira)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: DURACION_SEGUNDOS,
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
  if (valor === undefined) return false;
  const [expira, firma] = valor.split(".");
  if (!expira || !firma) return false;
  return iguales(firma, firmar(expira)) && Number(expira) > Date.now() / 1000;
}
