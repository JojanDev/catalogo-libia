"use client";

import { useActionState, useState } from "react";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { iniciarSesionAccion } from "@/app/admin/login/acciones";
import { Boton } from "@/components/ui/Boton";
import { Campo, Entrada } from "@/components/ui/Campo";
import { Logo } from "@/components/ui/Logo";

export function FormularioLogin() {
  const [estado, accion, pendiente] = useActionState(iniciarSesionAccion, { error: null });
  const [visible, setVisible] = useState(false);

  return (
    <form
      action={accion}
      className="w-full max-w-[400px] rounded-lg border border-borde bg-surface p-6 sm:p-8"
    >
      <div className="mb-6 flex flex-col items-center gap-2 text-center">
        <Logo alto={72} prioridad />
        <h1 className="font-display text-2xl text-cafe">Panel de administración</h1>
      </div>
      <Campo id="password" etiqueta="Contraseña" ayuda="Contraseña de prueba del mockup: tonorosa-demo">
        {(props) => (
          <div className="relative">
            <Entrada
              {...props}
              name="password"
              type={visible ? "text" : "password"}
              autoComplete="current-password"
              required
              className="pr-12"
            />
            <button
              type="button"
              onClick={() => setVisible((v) => !v)}
              aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
              className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-tenue hover:text-cafe"
            >
              {visible ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
          </div>
        )}
      </Campo>
      {estado.error && (
        <p role="alert" className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-error">
          <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
          {estado.error}
        </p>
      )}
      <Boton type="submit" cargando={pendiente} className="mt-5 w-full">
        Ingresar
      </Boton>
    </form>
  );
}
