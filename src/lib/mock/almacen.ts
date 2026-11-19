import "server-only";
import { crearSemilla, type Semilla } from "@/lib/mock/semilla";

type Global = typeof globalThis & { __tonorosaAlmacen?: Semilla };

export function almacen(): Semilla {
  const g = globalThis as Global;
  if (!g.__tonorosaAlmacen) g.__tonorosaAlmacen = crearSemilla();
  return g.__tonorosaAlmacen;
}

export function copia<T>(valor: T): T {
  return structuredClone(valor);
}
