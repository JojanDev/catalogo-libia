import "server-only";
import { redirect } from "next/navigation";
import { haySesion } from "@/lib/auth/sesion";

export async function requerirAdmin(): Promise<void> {
  if (!(await haySesion())) redirect("/admin/login");
}
