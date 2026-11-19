export type Talla = { id: number; nombre: string; orden: number; activa: boolean };

export type ProductoTalla = {
  tallaId: number;
  nombre: string;
  orden: number;
  agotado: boolean;
};

export type Medio = {
  id: number;
  tipo: "imagen" | "video";
  url: string;
  alt: string;
  orden: number;
};

export type Producto = {
  id: number;
  slug: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  coleccionId: number | null;
  imagen: string;
  medios: Medio[];
  tallas: ProductoTalla[];
  agotado: boolean;
  activo: boolean;
  orden: number;
  creadoEn: string;
};

export type Coleccion = {
  id: number;
  slug: string;
  nombre: string;
  descripcion: string;
  temporada: string;
  imagen: string;
  activa: boolean;
  destacada: boolean;
  orden: number;
};

export type SlideCarrusel = {
  id: number;
  tipo: "imagen" | "video";
  url: string;
  urlMovil: string | null;
  titulo: string;
  subtitulo: string;
  textoBoton: string;
  enlace: string;
  orden: number;
  activo: boolean;
};

export type Configuracion = {
  whatsapp: string;
  textoAnuncio: string;
};

export type ProductoVista = Producto & { coleccion: Coleccion | null };
