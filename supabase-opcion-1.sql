create table if not exists tallas (
  id integer primary key,
  nombre text not null unique,
  orden integer not null default 0,
  activa boolean not null default true
);

create table if not exists colecciones (
  id integer primary key,
  slug text not null unique,
  nombre text not null,
  descripcion text not null default '',
  temporada text not null default '',
  imagen_url text not null default '',
  activa boolean not null default true,
  destacada boolean not null default false,
  orden integer not null default 0
);

create table if not exists productos (
  id integer primary key,
  slug text not null unique,
  nombre text not null,
  descripcion text not null default '',
  precio integer not null check (precio >= 0),
  categoria text not null,
  coleccion_id integer references colecciones(id) on delete set null,
  imagen_url text not null default '',
  agotado boolean not null default false,
  activo boolean not null default true,
  orden integer not null default 0,
  creado_en timestamptz not null default now()
);

create table if not exists producto_tallas (
  producto_id integer not null references productos(id) on delete cascade,
  talla_id integer not null references tallas(id) on delete cascade,
  agotado boolean not null default false,
  primary key (producto_id, talla_id)
);

create table if not exists producto_medios (
  id integer primary key,
  producto_id integer not null references productos(id) on delete cascade,
  tipo text not null check (tipo in ('imagen', 'video')),
  url text not null,
  alt text not null default '',
  orden integer not null default 0
);

create table if not exists carrusel_slides (
  id integer primary key,
  tipo text not null check (tipo in ('imagen', 'video')),
  url text not null,
  url_movil text,
  titulo text not null default '',
  subtitulo text not null default '',
  texto_boton text not null default '',
  enlace text not null default '/',
  orden integer not null default 0,
  activo boolean not null default true
);

create table if not exists configuracion (
  id smallint primary key default 1 check (id = 1),
  whatsapp text not null,
  texto_anuncio text not null default ''
);

alter table tallas enable row level security;
alter table colecciones enable row level security;
alter table productos enable row level security;
alter table producto_tallas enable row level security;
alter table producto_medios enable row level security;
alter table carrusel_slides enable row level security;
alter table configuracion enable row level security;

drop policy if exists "lectura publica tallas" on tallas;
create policy "lectura publica tallas" on tallas for select to anon using (activa);

drop policy if exists "lectura publica colecciones" on colecciones;
create policy "lectura publica colecciones" on colecciones for select to anon using (activa);

drop policy if exists "lectura publica productos" on productos;
create policy "lectura publica productos" on productos for select to anon using (activo);

drop policy if exists "lectura publica producto_tallas" on producto_tallas;
create policy "lectura publica producto_tallas" on producto_tallas for select to anon
  using (exists (select 1 from productos p where p.id = producto_id and p.activo));

drop policy if exists "lectura publica producto_medios" on producto_medios;
create policy "lectura publica producto_medios" on producto_medios for select to anon
  using (exists (select 1 from productos p where p.id = producto_id and p.activo));

drop policy if exists "lectura publica carrusel_slides" on carrusel_slides;
create policy "lectura publica carrusel_slides" on carrusel_slides for select to anon using (activo);

drop policy if exists "lectura publica configuracion" on configuracion;
create policy "lectura publica configuracion" on configuracion for select to anon using (true);

insert into storage.buckets (id, name, public)
values ('productos', 'productos', true)
on conflict (id) do nothing;

drop policy if exists "lectura publica storage productos" on storage.objects;
create policy "lectura publica storage productos" on storage.objects for select to anon
  using (bucket_id = 'productos');

insert into tallas (id, nombre, orden, activa) values
  (1, '2', 2, true), (2, '4', 4, true), (3, '6', 6, true), (4, '8', 8, true),
  (5, '10', 10, true), (6, '12', 12, true), (7, '14', 14, true), (8, '16', 16, true)
on conflict (id) do nothing;

insert into colecciones (id, slug, nombre, descripcion, temporada, imagen_url, activa, destacada, orden) values
  (1, 'jardin-de-emociones', 'Jardín de Emociones', 'Flores, encajes y colores suaves para días llenos de ternura.', 'Otoño 2026', '/mock/coleccion-1.svg', true, true, 1),
  (2, 'pequenos-suenos', 'Pequeños Sueños', 'Prendas cómodas y suaves para jugar, descansar y soñar.', 'Otoño 2026', '/mock/coleccion-2.svg', true, false, 2),
  (3, 'dulce-primavera', 'Dulce Primavera', 'Tonos frescos y telas ligeras para celebrar cada sonrisa.', 'Primavera 2026', '/mock/coleccion-3.svg', true, false, 3),
  (4, 'verano-2025', 'Verano 2025', 'Colección de verano anterior.', 'Verano 2025', '/mock/coleccion-4.svg', false, false, 4)
on conflict (id) do nothing;

insert into productos (id, slug, nombre, descripcion, precio, categoria, coleccion_id, imagen_url, agotado, activo, orden, creado_en) values
  (1, 'vestido-jardin-de-rosas', 'Vestido Jardín de Rosas', 'Vestido con falda amplia y bordado de rosas. Suave y fresco para todo el día.', 149900, 'Vestidos', 1, '/mock/prenda-1.svg', false, true, 1, now() - interval '30 days'),
  (2, 'vestido-margarita', 'Vestido Margarita', 'Vestido de algodón con estampado de margaritas y lazo en la espalda.', 129900, 'Vestidos', 1, '/mock/prenda-2.svg', false, true, 2, now() - interval '29 days'),
  (3, 'conjunto-brisa-de-otono', 'Conjunto Brisa de Otoño', 'Blusa y falda a juego en tonos salvia. Ideal para paseos en familia.', 119900, 'Conjuntos', 1, '/mock/prenda-3.svg', false, true, 3, now() - interval '28 days'),
  (4, 'blusa-lazo-de-tul', 'Blusa Lazo de Tul', 'Blusa liviana con mangas de tul y lazo al cuello. Delicada y cómoda.', 69900, 'Blusas', 1, '/mock/prenda-4.svg', false, true, 4, now() - interval '27 days'),
  (5, 'falda-petalos', 'Falda Pétalos', 'Falda con vuelo en capas suaves que bailan con cada paso.', 79900, 'Faldas', 1, '/mock/prenda-5.svg', true, true, 5, now() - interval '26 days'),
  (6, 'pijama-luna-dormilona', 'Pijama Luna Dormilona', 'Pijama de algodón peinado con estampado de lunas y estrellas.', 89900, 'Pijamas', 2, '/mock/prenda-6.svg', false, true, 6, now() - interval '25 days'),
  (7, 'enterizo-nube-suave', 'Enterizo Nube Suave', 'Enterizo de felpa ligera, perfecto para tardes de juego y descanso.', 99900, 'Enterizos', 2, '/mock/prenda-7.svg', false, true, 7, now() - interval '24 days'),
  (8, 'conjunto-sueno-de-algodon', 'Conjunto Sueño de Algodón', 'Buzo y pantalón de algodón con detalles bordados en rosa.', 109900, 'Conjuntos', 2, '/mock/prenda-8.svg', false, true, 8, now() - interval '23 days'),
  (9, 'pijama-osito-feliz', 'Pijama Osito Feliz', 'Pijama de dos piezas con osito bordado. Muy suave para la piel.', 94900, 'Pijamas', 2, '/mock/prenda-1.svg', false, true, 9, now() - interval '22 days'),
  (10, 'vestido-primavera-dulce', 'Vestido Primavera Dulce', 'Vestido de gasa con flores pequeñas y cinturón de cinta.', 159900, 'Vestidos', 3, '/mock/prenda-2.svg', false, true, 10, now() - interval '21 days'),
  (11, 'blusa-girasol', 'Blusa Girasol', 'Blusa fresca con volantes en los hombros y botones de nácar.', 59900, 'Blusas', 3, '/mock/prenda-3.svg', false, true, 11, now() - interval '20 days'),
  (12, 'falda-tutu-algodon-de-azucar', 'Falda Tutú Algodón de Azúcar', 'Falda de tul con forro suave. Hace girar y sonreír.', 84900, 'Faldas', 3, '/mock/prenda-4.svg', false, true, 12, now() - interval '19 days'),
  (13, 'enterizo-flor-de-cerezo', 'Enterizo Flor de Cerezo', 'Enterizo corto con estampado de flor de cerezo y tirantes ajustables.', 124900, 'Enterizos', 3, '/mock/prenda-5.svg', false, true, 13, now() - interval '18 days'),
  (14, 'conjunto-mariposa', 'Conjunto Mariposa', 'Conjunto de blusa bordada y short con mariposas. Fresco y alegre.', 139900, 'Conjuntos', 3, '/mock/prenda-6.svg', true, true, 14, now() - interval '17 days'),
  (15, 'vestido-gala-perla', 'Vestido Gala Perla', 'Vestido de ocasión especial con falda de organza y detalles en perla.', 169900, 'Vestidos', null, '/mock/prenda-7.svg', false, false, 15, now() - interval '16 days'),
  (16, 'pijama-estrellita-de-verano', 'Pijama Estrellita de Verano', 'Pijama ligera de verano con estampado de estrellas.', 74900, 'Pijamas', 4, '/mock/prenda-8.svg', false, false, 16, now() - interval '15 days')
on conflict (id) do nothing;

insert into producto_tallas (producto_id, talla_id, agotado)
select p.id, t.id, p.agotado or (p.id, t.id) in ((1,1),(3,2),(3,3),(6,4),(8,1),(8,2),(11,5))
from productos p cross join tallas t
on conflict (producto_id, talla_id) do nothing;

insert into producto_medios (id, producto_id, tipo, url, alt, orden)
select p.id * 10 + 1, p.id, 'imagen', p.imagen_url, p.nombre, 1 from productos p
on conflict (id) do nothing;

insert into producto_medios (id, producto_id, tipo, url, alt, orden)
select p.id * 10 + 2, p.id, 'imagen',
  '/mock/prenda-' || ((substring(p.imagen_url from '(\d+)\.svg')::int % 8) + 1) || '.svg',
  p.nombre || ' detalle', 2
from productos p
on conflict (id) do nothing;

insert into producto_medios (id, producto_id, tipo, url, alt, orden)
select p.id * 10 + 3, p.id, 'imagen',
  '/mock/prenda-' || (((substring(p.imagen_url from '(\d+)\.svg')::int % 8) + 1) % 8 + 1) || '.svg',
  p.nombre || ' vista', 3
from productos p
where p.id % 2 = 1
on conflict (id) do nothing;

insert into carrusel_slides (id, tipo, url, url_movil, titulo, subtitulo, texto_boton, enlace, orden, activo) values
  (1, 'imagen', '/mock/slide-1.svg', null, 'Un jardín de emociones', 'Prendas que florecen con cada sonrisa', 'Ver colección', '/colecciones/jardin-de-emociones', 1, true),
  (2, 'imagen', '/mock/slide-2.svg', null, 'Nueva colección', 'Descubre lo último para tu pequeña', 'Ver catálogo', '/catalogo', 2, true),
  (3, 'imagen', '/mock/slide-3.svg', null, 'Hecho con amor', 'Telas suaves y detalles pensados para ellas', 'Explorar', '/catalogo', 3, true)
on conflict (id) do nothing;

insert into configuracion (id, whatsapp, texto_anuncio) values
  (1, '573006569633', 'Moda infantil que hace florecer sonrisas')
on conflict (id) do nothing;
