alter table public.configuracion enable row level security;

revoke select on public.configuracion from anon;
grant select (whatsapp, texto_anuncio) on public.configuracion to anon;

drop policy if exists "lectura publica configuracion" on public.configuracion;
create policy "lectura publica configuracion" on public.configuracion
  for select to anon using (true);

-- Verificacion (rol anon):
--   set role anon;
--   select whatsapp, texto_anuncio from public.configuracion;   -- funciona
--   select correo_notificaciones from public.configuracion;     -- falla: permission denied
--   reset role;
