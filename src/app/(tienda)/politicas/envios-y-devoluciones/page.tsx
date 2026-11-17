import type { Metadata } from "next";
import { PaginaPolitica, SeccionPolitica } from "@/components/tienda/PaginaPolitica";
import { obtenerConfiguracion } from "@/lib/datos/tienda";
import { formatearPrecio } from "@/lib/formato";

export const metadata: Metadata = {
  title: "Envíos y devoluciones",
  description:
    "Cómo enviamos tus pedidos a toda Colombia, costos de envío, cambios, devoluciones y derecho de retracto en Tonorosa by Leyar.",
};

export default async function EnviosDevolucionesPage() {
  const config = await obtenerConfiguracion();

  return (
    <PaginaPolitica
      titulo="Envíos y devoluciones"
      introduccion="Queremos que tu compra llegue bien y a tiempo. Aquí te contamos cómo enviamos los pedidos y qué hacer si necesitas un cambio o una devolución."
      whatsapp={config.whatsapp}
    >
      <SeccionPolitica titulo="Cobertura">
        <p>Enviamos a todos los departamentos de Colombia a través de empresas de mensajería.</p>
      </SeccionPolitica>
      <SeccionPolitica titulo="Preparación y entrega">
        <p>
          Muchas de nuestras prendas se confeccionan sobre pedido. Al confirmar tu compra te contamos por WhatsApp el
          tiempo estimado de preparación y de entrega según tu ciudad. Cuando tu pedido salga, te enviamos el número
          de guía para que puedas seguirlo.
        </p>
      </SeccionPolitica>
      <SeccionPolitica titulo="Costo del envío">
        <p>
          {`El envío cuesta ${formatearPrecio(config.costoEnvio)} a cualquier lugar del país.`}
          {config.envioGratisDesde !== null &&
            ` En compras desde ${formatearPrecio(config.envioGratisDesde)} el envío es gratis.`}{" "}
          Verás el valor exacto en el resumen antes de confirmar tu pedido.
        </p>
      </SeccionPolitica>
      <SeccionPolitica titulo="Cambios de talla">
        <ul>
          <li>
            Si la talla no le queda a tu peque, escríbenos por WhatsApp con tu número de pedido y te contamos las
            opciones de cambio disponibles.
          </li>
          <li>La prenda debe estar sin uso, sin lavar, con sus etiquetas y en su empaque original.</li>
          <li>Antes de hacer el cambio te informamos el costo del envío, si aplica.</li>
        </ul>
      </SeccionPolitica>
      <SeccionPolitica titulo="Derecho de retracto">
        <p>
          Según el artículo 47 de la Ley 1480 de 2011 (Estatuto del Consumidor), en las compras a distancia puedes
          retractarte dentro de los cinco (5) días hábiles siguientes a la entrega. La prenda debe devolverse sin uso y
          en las mismas condiciones en que la recibiste; los costos de transporte de la devolución corren por tu
          cuenta. Te devolvemos el dinero pagado en un plazo máximo de treinta (30) días calendario desde que ejerces
          el derecho.
        </p>
      </SeccionPolitica>
      <SeccionPolitica titulo="Garantía">
        <p>
          Si una prenda llega con un defecto de fabricación, escríbenos por WhatsApp con fotos y tu número de pedido.
          La revisamos y, según el caso, la reparamos, la cambiamos o te devolvemos el dinero, conforme a la garantía
          legal de la Ley 1480 de 2011.
        </p>
      </SeccionPolitica>
      <SeccionPolitica titulo="Reversión del pago">
        <p>
          Si pagaste en línea y fuiste víctima de fraude, la operación no fue solicitada, el producto no llegó, no
          corresponde a lo que pediste o llegó defectuoso, puedes pedir la reversión del pago según el artículo 51 de
          la Ley 1480 de 2011, dentro de los cinco (5) días hábiles siguientes a la fecha en que conociste la
          situación o recibiste el producto. Para hacerlo, escríbenos y avisa también a la entidad emisora de tu medio
          de pago.
        </p>
      </SeccionPolitica>
    </PaginaPolitica>
  );
}
