import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";
import { Contenedor } from "@/components/ui/Contenedor";
import { Separador } from "@/components/ui/Separador";
import { estilosBoton } from "@/components/ui/estilosBoton";
import { obtenerConfiguracion, obtenerGuiaTallas } from "@/lib/datos/tienda";

export const metadata: Metadata = { title: "Guía de tallas" };

const PASOS = [
  { titulo: "Pecho", texto: "Rodea el pecho por la parte más ancha, pasando la cinta bajo las axilas." },
  { titulo: "Cintura", texto: "Mide la cintura natural, justo sobre el ombligo, sin apretar la cinta." },
  { titulo: "Largo", texto: "Mide desde el hombro hasta donde quieras que llegue la prenda." },
];

export default async function GuiaTallasPage() {
  const [guia, config] = await Promise.all([obtenerGuiaTallas(), obtenerConfiguracion()]);
  const enlace = `https://wa.me/${config.whatsapp}?text=${encodeURIComponent("Hola Tonorosa, necesito ayuda para elegir una talla.")}`;

  return (
    <Contenedor className="py-10 lg:py-16">
      <div className="text-center">
        <h1 className="font-display text-[32px] leading-tight text-cafe md:text-5xl">
          {guia.titulo}
        </h1>
        <Separador className="mt-4" />
      </div>

      <div className="mt-10 overflow-x-auto rounded-md border border-borde bg-surface shadow-card">
        <table className="w-full min-w-[520px] border-collapse text-left text-base">
          <thead>
            <tr>
              {guia.columnas.map((c) => (
                <th
                  key={c}
                  scope="col"
                  className="sticky top-0 bg-rosa-suave px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] text-cafe"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {guia.filas.map((fila, i) => (
              <tr key={i} className="border-t border-borde">
                {fila.map((celda, j) => (
                  <td key={j} className={`px-4 py-3 text-cafe ${j === 0 ? "font-bold" : ""}`}>
                    {celda}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {guia.notas && <p className="mt-4 text-sm text-tenue">{guia.notas}</p>}

      <section className="mt-14">
        <h2 className="text-center font-display text-[26px] text-cafe md:text-4xl">Cómo medir</h2>
        <ol className="mt-8 grid gap-4 md:grid-cols-3 md:gap-6">
          {PASOS.map((p, i) => (
            <li key={p.titulo} className="rounded-md bg-rosa-suave p-6">
              <span className="flex size-10 items-center justify-center rounded-full bg-surface font-display text-xl text-rosa-accion">
                {i + 1}
              </span>
              <h3 className="mt-3 font-display text-xl text-cafe">{p.titulo}</h3>
              <p className="mt-1 text-base text-cafe">{p.texto}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-14 rounded-lg bg-rosa-suave p-8 text-center">
        <h2 className="font-display text-2xl text-cafe md:text-3xl">¿Dudas con la talla?</h2>
        <p className="mx-auto mt-2 max-w-md text-base text-cafe">
          Escríbenos y te ayudamos a elegir la talla ideal para tu peque.
        </p>
        <a
          href={enlace}
          target="_blank"
          rel="noopener noreferrer"
          className={estilosBoton("primario", "normal", "mt-5")}
        >
          <MessageCircle className="size-5" aria-hidden="true" />
          Escribir por WhatsApp
        </a>
      </section>
    </Contenedor>
  );
}
