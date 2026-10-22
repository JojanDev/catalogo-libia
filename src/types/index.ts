export type Talla = { id: number; nombre: string; orden: number; activa: boolean };

export type ProductoTalla = {
  tallaId: number;
  nombre: string;
  orden: number;
  agotado: boolean;
  stock: number;
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

export type Descuento = {
  id: number;
  nombre: string;
  porcentaje: number;
  fechaVencimiento: string;
  activo: boolean;
  productoIds: number[];
  coleccionIds: number[];
};

export type CodigoPromo = {
  id: number;
  codigo: string;
  porcentaje: number;
  fechaVencimiento: string | null;
  usosMaximos: number | null;
  usos: number;
  montoMinimo: number | null;
  activo: boolean;
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

export type GuiaTallas = {
  titulo: string;
  columnas: string[];
  filas: string[][];
  notas: string;
};

export type ModoInventario = "sobre_pedido" | "stock_fijo";

export type Configuracion = {
  costoEnvio: number;
  envioGratisDesde: number | null;
  whatsapp: string;
  correoNotificaciones: string;
  modoInventario: ModoInventario;
  textoAnuncio: string;
  pagosEnLinea: boolean;
};

export type EstadoPedido =
  | "pendiente_pago"
  | "pagado"
  | "enviado"
  | "entregado"
  | "cancelado";

export type MetodoPago = "wompi" | "whatsapp";

export type PedidoItem = {
  productoId: number;
  slug: string;
  nombre: string;
  imagen: string;
  talla: string;
  cantidad: number;
  precioUnitario: number;
  descuentoPorcentaje: number;
  subtotal: number;
};

export type DatosCliente = { nombre: string; telefono: string; email: string };

export type DatosEnvio = {
  departamento: string;
  ciudad: string;
  direccion: string;
  barrio: string;
  notas: string;
};

export type Pedido = {
  id: number;
  referencia: string;
  estado: EstadoPedido;
  metodoPago: MetodoPago;
  cliente: DatosCliente;
  envio: DatosEnvio;
  items: PedidoItem[];
  subtotal: number;
  descuentoTotal: number;
  codigoPromo: string | null;
  costoEnvio: number;
  total: number;
  creadoEn: string;
  pagadoEn: string | null;
};

export type ProductoVista = Producto & {
  precioFinal: number;
  descuentoPorcentaje: number | null;
  coleccion: Coleccion | null;
};

export type ItemCarrito = {
  productoId: number;
  slug: string;
  nombre: string;
  imagen: string;
  talla: string;
  cantidad: number;
  precioUnitario: number;
  precioFinal: number;
  descuentoPorcentaje: number | null;
};

export type EntradaItem = { productoId: number; talla: string; cantidad: number };

export type Cotizacion = {
  items: PedidoItem[];
  subtotal: number;
  descuentoCodigo: number;
  codigoAplicado: string | null;
  costoEnvio: number;
  total: number;
  errores: string[];
};

export type ResumenPanel = {
  pedidosPendientes: number;
  ventasMes: number;
  productosAgotados: number;
  productosActivos: number;
  ultimosPedidos: Pedido[];
};
