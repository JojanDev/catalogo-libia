export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
  coleccion: string;
  imagen: string;
  descripcion: string;
  activo: boolean;
  sizes: ProductSize[];
  descuento: DescuentoInfo | null;
}

export interface Coleccion {
  slug: string;
  nombre: string;
  descripcion: string;
  temporada: string;
  imagen: string;
}

export interface ProductSize {
  size: string;
  stock: number;
}

export interface DescuentoInfo {
  id: number;
  nombre: string;
  porcentaje: number;
  fecha_vencimiento: string;
}

export interface Descuento {
  id: number;
  nombre: string;
  porcentaje: number;
  fecha_vencimiento: string;
  activo: boolean;
  productos?: { producto_id: number; nombre: string; imagen_url: string }[];
}

export interface CartItem {
  productId: number;
  nombre: string;
  imagen: string;
  precio: number;
  size: string;
  cantidad: number;
  descuento: number | null;
  availableSizes: ProductSize[];
}

export interface PromoCode {
  id: number;
  code: string;
  discount: number;
  activo: boolean;
}

export interface Pedido {
  id: number;
  cliente: string;
  telefono: string;
  direccion: string;
  productos: { nombre: string; talla: string; cantidad: number; precio: number }[];
  total: number;
  metodo_pago: string;
  estado: "pendiente" | "enviado" | "cancelado";
}
