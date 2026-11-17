import type { Metadata } from "next";
import Link from "next/link";
import { PaginaPolitica, SeccionPolitica } from "@/components/tienda/PaginaPolitica";
import { obtenerConfiguracion } from "@/lib/datos/tienda";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description:
    "Condiciones de compra en la tienda en línea de Tonorosa by Leyar: precios, descuentos, disponibilidad, medios de pago y pedidos.",
};

export default async function TerminosPage() {
  const config = await obtenerConfiguracion();
  const enlace = `https://wa.me/${config.whatsapp}?text=${encodeURIComponent("Hola Tonorosa, tengo una pregunta sobre sus políticas.")}`;

  return (
    <PaginaPolitica
      titulo="Términos y condiciones"
      introduccion="Estos términos aplican a las compras hechas en la tienda en línea de Tonorosa by Leyar. Al confirmar un pedido declaras que los leíste y los aceptas."
      whatsapp={config.whatsapp}
    >
      <SeccionPolitica titulo="Quiénes somos">
        <p>
          Tonorosa by Leyar es una tienda de ropa infantil en Colombia. Puedes escribirnos por{" "}
          <a href={enlace} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>{" "}
          o al correo <a href={`mailto:${config.correoNotificaciones}`}>{config.correoNotificaciones}</a>.
        </p>
      </SeccionPolitica>
      <SeccionPolitica titulo="Precios">
        <p>
          Los precios están en pesos colombianos (COP) y corresponden al valor total de cada prenda. El costo de envío
          se suma y se muestra antes de confirmar el pedido. Podemos actualizar los precios en cualquier momento, pero
          respetamos el precio vigente cuando hiciste tu pedido.
        </p>
      </SeccionPolitica>
      <SeccionPolitica titulo="Descuentos y códigos">
        <ul>
          <li>
            Cuando una prenda tiene descuento verás el precio anterior tachado y la fecha en que termina la oferta.
          </li>
          <li>Cada oferta es válida hasta el final del día indicado, en hora de Colombia.</li>
          <li>
            Si una prenda tiene varias ofertas, se aplica la de mayor porcentaje; las ofertas no se suman entre sí.
          </li>
          <li>
            Los códigos de descuento se aplican sobre el subtotal de la compra y pueden tener fecha de vencimiento,
            monto mínimo y un número de usos limitado.
          </li>
        </ul>
      </SeccionPolitica>
      <SeccionPolitica titulo="Disponibilidad">
        <p>
          Muchas prendas se confeccionan sobre pedido. Si por algún motivo no podemos entregar una prenda o una talla,
          te escribimos para ofrecerte un cambio o devolverte el dinero.
        </p>
      </SeccionPolitica>
      <SeccionPolitica titulo="Pedidos y medios de pago">
        <p>
          Al confirmar tu compra recibes un número de pedido (por ejemplo, TNR-AB12CD34) que te sirve para cualquier
          consulta. Puedes pagar en línea a través de la pasarela de pagos Wompi o enviar tu pedido por WhatsApp para
          coordinar el pago con nosotros. Tonorosa no recibe ni guarda los datos de tu tarjeta o cuenta: el pago en
          línea se hace directamente en Wompi.
        </p>
      </SeccionPolitica>
      <SeccionPolitica titulo="Envíos, cambios y devoluciones">
        <p>
          Consulta cómo enviamos y qué hacer si necesitas un cambio o una devolución en nuestra política de{" "}
          <Link href="/politicas/envios-y-devoluciones">envíos y devoluciones</Link>.
        </p>
      </SeccionPolitica>
      <SeccionPolitica titulo="Datos personales">
        <p>
          Tratamos tus datos conforme a nuestra{" "}
          <Link href="/politicas/privacidad">política de tratamiento de datos personales</Link>.
        </p>
      </SeccionPolitica>
      <SeccionPolitica titulo="Ley aplicable">
        <p>
          Estos términos se rigen por las leyes de la República de Colombia, en especial la Ley 1480 de 2011 (Estatuto
          del Consumidor).
        </p>
      </SeccionPolitica>
    </PaginaPolitica>
  );
}
