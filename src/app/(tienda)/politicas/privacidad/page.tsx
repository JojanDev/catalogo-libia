import type { Metadata } from "next";
import { PaginaPolitica, SeccionPolitica } from "@/components/tienda/PaginaPolitica";
import { obtenerConfiguracion } from "@/lib/datos/tienda";

export const metadata: Metadata = {
  title: "Tratamiento de datos personales",
  description:
    "Política de tratamiento de datos personales de Tonorosa by Leyar conforme a la Ley 1581 de 2012: qué datos usamos, para qué y cómo ejercer tus derechos.",
};

export default async function PrivacidadPage() {
  const config = await obtenerConfiguracion();
  const enlace = `https://wa.me/${config.whatsapp}?text=${encodeURIComponent("Hola Tonorosa, tengo una pregunta sobre sus políticas.")}`;
  const correo = <a href={`mailto:${config.correoNotificaciones}`}>{config.correoNotificaciones}</a>;
  const whatsapp = (
    <a href={enlace} target="_blank" rel="noopener noreferrer">
      WhatsApp
    </a>
  );

  return (
    <PaginaPolitica
      titulo="Tratamiento de datos personales"
      introduccion="En Tonorosa by Leyar cuidamos tus datos. Esta política explica cómo los tratamos, conforme a la Ley 1581 de 2012 y sus decretos reglamentarios (Decreto 1074 de 2015)."
      whatsapp={config.whatsapp}
    >
      <SeccionPolitica titulo="Responsable del tratamiento">
        <p>
          Tonorosa by Leyar. Contacto: {whatsapp} y {correo}.
        </p>
      </SeccionPolitica>
      <SeccionPolitica titulo="Datos que recogemos">
        <ul>
          <li>Nombre completo</li>
          <li>Número de celular</li>
          <li>Correo electrónico</li>
          <li>Dirección de envío (departamento, ciudad, dirección, barrio e indicaciones)</li>
          <li>Detalle de tus pedidos</li>
        </ul>
        <p>
          No recogemos datos de tarjetas ni cuentas bancarias: los pagos en línea se procesan en Wompi. No solicitamos
          datos de los niños y niñas; las compras las realizan personas adultas.
        </p>
      </SeccionPolitica>
      <SeccionPolitica titulo="Para qué los usamos">
        <ul>
          <li>Procesar, despachar y entregar tus pedidos</li>
          <li>Comunicarnos contigo por WhatsApp, correo o teléfono sobre tu compra</li>
          <li>Atender consultas, cambios, devoluciones y garantías</li>
          <li>Cumplir obligaciones legales, contables y tributarias</li>
        </ul>
        <p>Solo te enviaremos novedades u ofertas si lo autorizas expresamente.</p>
      </SeccionPolitica>
      <SeccionPolitica titulo="Con quién los compartimos">
        <p>
          Únicamente con quienes nos ayudan a completar tu compra: empresas de mensajería para el envío, la pasarela de
          pagos Wompi y los proveedores tecnológicos que alojan la tienda. No vendemos ni alquilamos tus datos.
        </p>
      </SeccionPolitica>
      <SeccionPolitica titulo="Tus derechos">
        <ul>
          <li>Conocer, actualizar y rectificar tus datos</li>
          <li>Solicitar prueba de la autorización que nos diste</li>
          <li>Ser informada o informado sobre el uso que les damos</li>
          <li>Presentar quejas ante la Superintendencia de Industria y Comercio</li>
          <li>
            Revocar la autorización o pedir que suprimamos tus datos cuando no exista un deber legal de conservarlos
          </li>
          <li>Acceder gratis a tus datos</li>
        </ul>
      </SeccionPolitica>
      <SeccionPolitica titulo="Cómo ejercer tus derechos">
        <p>
          Escríbenos por {whatsapp} o al correo {correo} indicando tu nombre, tu solicitud y un dato de contacto.
          Respondemos las consultas en máximo diez (10) días hábiles y los reclamos en máximo quince (15) días hábiles,
          según los artículos 14 y 15 de la Ley 1581 de 2012.
        </p>
      </SeccionPolitica>
      <SeccionPolitica titulo="Autorización">
        <p>
          Al marcar la casilla de aceptación al finalizar tu compra, autorizas el tratamiento de tus datos para las
          finalidades descritas en esta política.
        </p>
      </SeccionPolitica>
      <SeccionPolitica titulo="Conservación">
        <p>
          Conservamos tus datos mientras sean necesarios para estas finalidades y para cumplir nuestras obligaciones
          legales.
        </p>
      </SeccionPolitica>
    </PaginaPolitica>
  );
}
