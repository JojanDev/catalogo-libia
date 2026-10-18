-- Ejecutar en el SQL Editor de Supabase

CREATE TABLE productos (
  id BIGSERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  precio DOUBLE PRECISION NOT NULL,
  categoria TEXT NOT NULL,
  coleccion TEXT NOT NULL,
  imagen_url TEXT NOT NULL DEFAULT '',
  descripcion TEXT NOT NULL DEFAULT '',
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE colecciones (
  id BIGSERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  slug TEXT NOT NULL,
  descripcion TEXT NOT NULL DEFAULT '',
  temporada TEXT NOT NULL DEFAULT '',
  imagen_url TEXT NOT NULL DEFAULT '',
  archivada BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insertar productos
INSERT INTO productos (nombre, precio, categoria, coleccion, imagen_url, descripcion, activo)
VALUES
  ('Vestido Floral Primavera', 45.99, 'Vestidos', 'Primavera 2026', 'https://images.unsplash.com/photo-1583433306546-ded68847fd0d?w=600&auto=format&fit=crop', 'Vestido ligero con estampado floral, ideal para días soleados y eventos casuales.', true),
  ('Blusa Casual de Lino', 29.99, 'Blusas', 'Primavera 2026', 'https://images.unsplash.com/photo-1752825609278-f9696bc9d7bd?w=600&auto=format&fit=crop', 'Blusa fresca de lino, perfecta para el día a día con un toque elegante.', true),
  ('Pantalón Recto Elegante', 39.99, 'Pantalones', 'Primavera 2026', 'https://images.unsplash.com/photo-1768430826748-e5c1c9faf643?w=600&auto=format&fit=crop', 'Pantalón de corte recto, combina con todo y nunca pasa de moda.', true),
  ('Chaqueta de Mezclilla', 59.99, 'Chaquetas', 'Primavera 2026', 'https://images.unsplash.com/photo-1769183960105-e8bf22c65c10?w=600&auto=format&fit=crop', 'Chaqueta clásica de mezclilla, un básico atemporal para cualquier ocasión.', true),
  ('Falda Plisada Midi', 34.99, 'Faldas', 'Verano 2026', 'https://images.unsplash.com/photo-1552874869-5c39ec9288dc?w=600&auto=format&fit=crop', 'Falda plisada con movimiento, fresca y femenina para los días cálidos.', true),
  ('Suéter de Algodón Suave', 49.99, 'Suéteres', 'Verano 2026', 'https://images.unsplash.com/photo-1765337210325-768dafc12989?w=600&auto=format&fit=crop', 'Suéter ligero de algodón, ideal para las noches frescas de verano.', true),
  ('Camisa Oversize Blanca', 32.99, 'Camisas', 'Verano 2026', 'https://images.unsplash.com/photo-1780566759999-4dbaa4218959?w=600&auto=format&fit=crop', 'Camisa blanca holgada, el fondo de armario perfecto que combina con todo.', true),
  ('Short de Algodón', 27.99, 'Shorts', 'Verano 2026', 'https://images.unsplash.com/photo-1635451321428-bf1191253150?w=600&auto=format&fit=crop', 'Short cómodo de algodón para los días calurosos, con corte favorecedor.', true),
  ('Blusa Satinada', 37.99, 'Blusas', 'Otoño 2026', 'https://images.unsplash.com/photo-1704775983658-2773a9c0cce2?w=600&auto=format&fit=crop', 'Blusa satinada elegante para ocasiones especiales y cenas importantes.', true),
  ('Vestido Negro Noche', 62.99, 'Vestidos', 'Otoño 2026', 'https://images.unsplash.com/photo-1741816219933-2bf406bc9739?w=600&auto=format&fit=crop', 'Vestido negro de noche, sofisticado y atemporal. Un must-have.', true),
  ('Chaleco Tejido', 44.99, 'Chaquetas', 'Otoño 2026', 'https://images.unsplash.com/photo-1642449662982-24d3693833a2?w=600&auto=format&fit=crop', 'Chaleco tejido a mano, ideal para capas y looks con textura.', true),
  ('Pantalón Palazzo', 42.99, 'Pantalones', 'Otoño 2026', 'https://images.unsplash.com/photo-1768478701507-24b1c8de2df0?w=600&auto=format&fit=crop', 'Pantalón palazzo fluido, elegante y cómodo para cualquier evento.', true);

-- Insertar colecciones
INSERT INTO colecciones (nombre, slug, descripcion, temporada, imagen_url)
VALUES
  ('Primavera 2026', 'primavera-2026', 'Ligera, fresca y llena de color. La colección que renueva tu clóset.', 'Primavera', 'https://images.unsplash.com/photo-1583433306546-ded68847fd0d?w=800&auto=format&fit=crop'),
  ('Verano 2026', 'verano-2026', 'Perfecta para los días cálidos. Cómoda, fresca y con estilo.', 'Verano', 'https://images.unsplash.com/photo-1552874869-5c39ec9288dc?w=800&auto=format&fit=crop'),
  ('Otoño 2026', 'otonio-2026', 'Capas, texturas y tonos cálidos para la temporada más acogedora.', 'Otoño', 'https://images.unsplash.com/photo-1642449662982-24d3693833a2?w=800&auto=format&fit=crop');
