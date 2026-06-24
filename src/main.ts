import "./style.css";

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
  imagen: string;
}

const productos: Producto[] = [
  {
    id: 1,
    nombre: "Vestido Floral Primavera",
    precio: 45.99,
    categoria: "Vestidos",
    imagen: "https://images.unsplash.com/photo-1583433306546-ded68847fd0d?w=600&auto=format&fit=crop",
  },
  {
    id: 2,
    nombre: "Blusa Casual de Lino",
    precio: 29.99,
    categoria: "Blusas",
    imagen: "https://images.unsplash.com/photo-1752825609278-f9696bc9d7bd?w=600&auto=format&fit=crop",
  },
  {
    id: 3,
    nombre: "Pantalón Recto Elegante",
    precio: 39.99,
    categoria: "Pantalones",
    imagen: "https://images.unsplash.com/photo-1768430826748-e5c1c9faf643?w=600&auto=format&fit=crop",
  },
  {
    id: 4,
    nombre: "Chaqueta de Mezclilla",
    precio: 59.99,
    categoria: "Chaquetas",
    imagen: "https://images.unsplash.com/photo-1769183960105-e8bf22c65c10?w=600&auto=format&fit=crop",
  },
  {
    id: 5,
    nombre: "Falda Plisada Midi",
    precio: 34.99,
    categoria: "Faldas",
    imagen: "https://images.unsplash.com/photo-1552874869-5c39ec9288dc?w=600&auto=format&fit=crop",
  },
  {
    id: 6,
    nombre: "Suéter de Algodón Suave",
    precio: 49.99,
    categoria: "Suéteres",
    imagen: "https://images.unsplash.com/photo-1765337210325-768dafc12989?w=600&auto=format&fit=crop",
  },
  {
    id: 7,
    nombre: "Camisa Oversize Blanca",
    precio: 32.99,
    categoria: "Camisas",
    imagen: "https://images.unsplash.com/photo-1780566759999-4dbaa4218959?w=600&auto=format&fit=crop",
  },
  {
    id: 8,
    nombre: "Short de Algodón",
    precio: 27.99,
    categoria: "Shorts",
    imagen: "https://images.unsplash.com/photo-1635451321428-bf1191253150?w=600&auto=format&fit=crop",
  },
  {
    id: 9,
    nombre: "Blusa Satinada",
    precio: 37.99,
    categoria: "Blusas",
    imagen: "https://images.unsplash.com/photo-1704775983658-2773a9c0cce2?w=600&auto=format&fit=crop",
  },
  {
    id: 10,
    nombre: "Vestido Negro Noche",
    precio: 62.99,
    categoria: "Vestidos",
    imagen: "https://images.unsplash.com/photo-1741816219933-2bf406bc9739?w=600&auto=format&fit=crop",
  },
  {
    id: 11,
    nombre: "Chaleco Tejido",
    precio: 44.99,
    categoria: "Chaquetas",
    imagen: "https://images.unsplash.com/photo-1642449662982-24d3693833a2?w=600&auto=format&fit=crop",
  },
  {
    id: 12,
    nombre: "Pantalón Palazzo",
    precio: 42.99,
    categoria: "Pantalones",
    imagen: "https://images.unsplash.com/photo-1768478701507-24b1c8de2df0?w=600&auto=format&fit=crop",
  },
];

function renderProductos(): void {
  const container = document.getElementById("app-catalogo");
  if (!container) return;

  const grid = document.createElement("div");
  grid.className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12";

  for (const p of productos) {
    const whatsappUrl = `https://wa.me/573006569633?text=${encodeURIComponent(`Hola, estoy interesada en el producto: ${p.nombre}`)}`;

    const card = document.createElement("article");
    card.className =
      "group bg-white rounded-lg border border-stone-200 overflow-hidden flex flex-col";

    card.innerHTML = `
      <div class="overflow-hidden">
        <img src="${p.imagen}" alt="${p.nombre}" class="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
      </div>
      <div class="p-5 flex flex-col flex-1">
        <span class="text-xs font-semibold text-stone-500 uppercase tracking-wider">${p.categoria}</span>
        <h3 class="mt-1.5 text-base font-medium text-stone-900">${p.nombre}</h3>
        <p class="mt-1 text-lg font-semibold text-stone-900">$${p.precio.toFixed(2)}</p>
        <a href="${whatsappUrl}" target="_blank"
           class="mt-4 inline-flex items-center justify-center gap-2 bg-stone-950 hover:bg-stone-800 text-white text-sm font-medium py-3 px-4 rounded-lg transition-colors duration-300 tracking-wider uppercase">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Consultar
        </a>
      </div>
    `;

    grid.appendChild(card);
  }

  container.appendChild(grid);
}

renderProductos();
