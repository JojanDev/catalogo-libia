"use server";

import { redirect } from "next/navigation";
import { cerrarSesion, iniciarSesion } from "@/lib/auth/sesion";

export async function iniciarSesionAccion(
  _prevState: { error: string | null },
  formData: FormData,
): Promise<{ error: string | null }> {
  const password = String(formData.get("password") ?? "");
  if (!(await iniciarSesion(password))) return { error: "Contraseña incorrecta" };
  redirect("/admin");
}

export async function cerrarSesionAccion(): Promise<void> {
  await cerrarSesion();
  redirect("/admin/login");
}
