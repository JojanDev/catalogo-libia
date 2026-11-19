import "server-only";
import type {
  Coleccion,
  Configuracion,
  Producto,
  SlideCarrusel,
  Talla,
} from "@/types";
import { crearSlug } from "@/lib/slug";

export type Semilla = {
  tallas: Talla[];
  colecciones: Coleccion[];
  productos: Producto[];
  slides: SlideCarrusel[];
  configuracion: Configuracion;
};

function isoRelativo(dias: number): string {
  return new Date(Date.now() + dias * 86400000).toISOString();
}

export function crearSemilla(): Semilla {
  const tallas: Talla[] = [2, 4, 6, 8, 10, 12, 14, 16].map((n, i) => ({
    id: i + 1,
    nombre: String(n),
    orden: n,
    activa: true,
  }));

  const colecciones: Coleccion[] = [
    {
      id: 1,
      slug: "jardin-de-emociones",
      nombre: "Jardín de Emociones",
      descripcion: "Flores, encajes y colores suaves para días llenos de ternura.",
      temporada: "Otoño 2026",
      imagen: "/mock/coleccion-1.svg",
      activa: true,
      destacada: true,
      orden: 1,
    },
    {
      id: 2,
      slug: "pequenos-suenos",
      nombre: "Pequeños Sueños",
      descripcion: "Prendas cómodas y suaves para jugar, descansar y soñar.",
      temporada: "Otoño 2026",
      imagen: "/mock/coleccion-2.svg",
      activa: true,
      destacada: false,
      orden: 2,
    },
    {
      id: 3,
      slug: "dulce-primavera",
      nombre: "Dulce Primavera",
      descripcion: "Tonos frescos y telas ligeras para celebrar cada sonrisa.",
      temporada: "Primavera 2026",
      imagen: "/mock/coleccion-3.svg",
      activa: true,
      destacada: false,
      orden: 3,
    },
    {
      id: 4,
      slug: "verano-2025",
      nombre: "Verano 2025",
      descripcion: "Colección de verano anterior.",
      temporada: "Verano 2025",
      imagen: "/mock/coleccion-4.svg",
      activa: false,
      destacada: false,
      orden: 4,
    },
  ];

  type Fila = [string, string, number, number | null, number, string, boolean, boolean, number[]];
  const filas: Fila[] = [
    ["Vestido Jardín de Rosas", "Vestidos", 149900, 1, 1, "Vestido con falda amplia y bordado de rosas. Suave y fresco para todo el día.", false, true, [1]],
    ["Vestido Margarita", "Vestidos", 129900, 1, 2, "Vestido de algodón con estampado de margaritas y lazo en la espalda.", false, true, []],
    ["Conjunto Brisa de Otoño", "Conjuntos", 119900, 1, 3, "Blusa y falda a juego en tonos salvia. Ideal para paseos en familia.", false, true, [2, 3]],
    ["Blusa Lazo de Tul", "Blusas", 69900, 1, 4, "Blusa liviana con mangas de tul y lazo al cuello. Delicada y cómoda.", false, true, []],
    ["Falda Pétalos", "Faldas", 79900, 1, 5, "Falda con vuelo en capas suaves que bailan con cada paso.", true, true, []],
    ["Pijama Luna Dormilona", "Pijamas", 89900, 2, 6, "Pijama de algodón peinado con estampado de lunas y estrellas.", false, true, [4]],
    ["Enterizo Nube Suave", "Enterizos", 99900, 2, 7, "Enterizo de felpa ligera, perfecto para tardes de juego y descanso.", false, true, []],
    ["Conjunto Sueño de Algodón", "Conjuntos", 109900, 2, 8, "Buzo y pantalón de algodón con detalles bordados en rosa.", false, true, [1, 2]],
    ["Pijama Osito Feliz", "Pijamas", 94900, 2, 1, "Pijama de dos piezas con osito bordado. Muy suave para la piel.", false, true, []],
    ["Vestido Primavera Dulce", "Vestidos", 159900, 3, 2, "Vestido de gasa con flores pequeñas y cinturón de cinta.", false, true, []],
    ["Blusa Girasol", "Blusas", 59900, 3, 3, "Blusa fresca con volantes en los hombros y botones de nácar.", false, true, [5]],
    ["Falda Tutú Algodón de Azúcar", "Faldas", 84900, 3, 4, "Falda de tul con forro suave. Hace girar y sonreír.", false, true, []],
    ["Enterizo Flor de Cerezo", "Enterizos", 124900, 3, 5, "Enterizo corto con estampado de flor de cerezo y tirantes ajustables.", false, true, []],
    ["Conjunto Mariposa", "Conjuntos", 139900, 3, 6, "Conjunto de blusa bordada y short con mariposas. Fresco y alegre.", true, true, []],
    ["Vestido Gala Perla", "Vestidos", 169900, null, 7, "Vestido de ocasión especial con falda de organza y detalles en perla.", false, false, []],
    ["Pijama Estrellita de Verano", "Pijamas", 74900, 4, 8, "Pijama ligera de verano con estampado de estrellas.", false, false, []],
  ];

  const productos: Producto[] = filas.map((f, i) => {
    const id = i + 1;
    const [nombre, categoria, precio, coleccionId, img, descripcion, agotado, activo, tallasAgotadas] = f;
    const siguiente = (img % 8) + 1;
    return {
      id,
      slug: crearSlug(nombre),
      nombre,
      descripcion,
      precio,
      categoria,
      coleccionId,
      imagen: `/mock/prenda-${img}.svg`,
      medios: [
        { id: id * 10 + 1, tipo: "imagen", url: `/mock/prenda-${img}.svg`, alt: nombre, orden: 1 },
        { id: id * 10 + 2, tipo: "imagen", url: `/mock/prenda-${siguiente}.svg`, alt: `${nombre} detalle`, orden: 2 },
        ...(i % 2 === 0
          ? [{ id: id * 10 + 3, tipo: "imagen" as const, url: `/mock/prenda-${((siguiente) % 8) + 1}.svg`, alt: `${nombre} vista`, orden: 3 }]
          : []),
      ],
      tallas: tallas.map((t) => ({
        tallaId: t.id,
        nombre: t.nombre,
        orden: t.orden,
        agotado: agotado || tallasAgotadas.includes(t.id),
      })),
      agotado,
      activo,
      orden: id,
      creadoEn: isoRelativo(-(30 - i)),
    };
  });

  const slides: SlideCarrusel[] = [
    { id: 1, tipo: "imagen", url: "/mock/slide-1.svg", urlMovil: null, titulo: "Un jardín de emociones", subtitulo: "Prendas que florecen con cada sonrisa", textoBoton: "Ver colección", enlace: "/colecciones/jardin-de-emociones", orden: 1, activo: true },
    { id: 2, tipo: "imagen", url: "/mock/slide-2.svg", urlMovil: null, titulo: "Nueva colección", subtitulo: "Descubre lo último para tu pequeña", textoBoton: "Ver catálogo", enlace: "/catalogo", orden: 2, activo: true },
    { id: 3, tipo: "imagen", url: "/mock/slide-3.svg", urlMovil: null, titulo: "Hecho con amor", subtitulo: "Telas suaves y detalles pensados para ellas", textoBoton: "Explorar", enlace: "/catalogo", orden: 3, activo: true },
  ];

  const configuracion: Configuracion = {
    whatsapp: "573006569633",
    textoAnuncio: "Moda infantil que hace florecer sonrisas",
  };

  return { tallas, colecciones, productos, slides, configuracion };
}
