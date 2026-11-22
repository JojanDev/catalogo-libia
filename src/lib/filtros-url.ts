export type Filtros = {
  q: string;
  coleccion: string[];
  categoria: string[];
  min: string;
  max: string;
};

export function construirUrl(f: Filtros) {
  const p = new URLSearchParams();
  if (f.q) p.set("q", f.q);
  f.coleccion.forEach((v) => p.append("coleccion", v));
  f.categoria.forEach((v) => p.append("categoria", v));
  if (f.min) p.set("min", f.min);
  if (f.max) p.set("max", f.max);
  const s = p.toString();
  return s ? `/catalogo?${s}` : "/catalogo";
}

export function alternar(lista: string[], valor: string) {
  return lista.includes(valor) ? lista.filter((v) => v !== valor) : [...lista, valor];
}

export function lista(v: string | string[] | undefined) {
  return (Array.isArray(v) ? v : v ? [v] : []).filter(Boolean);
}
