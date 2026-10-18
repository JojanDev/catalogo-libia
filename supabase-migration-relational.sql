-- ============================================================
-- Migración: tallas relacionales + descuentos + cupones + pedidos
-- Ejecutar en el SQL Editor de Supabase
-- ============================================================

-- ------------------------------------------------------------
-- 1. Tabla de tallas (catálogo)
-- ------------------------------------------------------------
CREATE TABLE tallas (
  id BIGSERIAL PRIMARY KEY,
  nombre TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO tallas (nombre) VALUES
  ('2T'),
  ('3T'),
  ('4T'),
  ('5T'),
  ('6T');

-- ------------------------------------------------------------
-- 2. Tabla intermedia producto ↔ talla (muchos a muchos con stock)
-- ------------------------------------------------------------
CREATE TABLE producto_tallas (
  id BIGSERIAL PRIMARY KEY,
  producto_id BIGINT NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  talla_id BIGINT NOT NULL REFERENCES tallas(id) ON DELETE CASCADE,
  stock INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(producto_id, talla_id)
);

-- ------------------------------------------------------------
-- 3. Descuento en productos (JSONB, es por producto no por talla)
-- ------------------------------------------------------------
ALTER TABLE productos ADD COLUMN discount JSONB DEFAULT NULL;

-- ------------------------------------------------------------
-- 4. Tabla de cupones de descuento
-- ------------------------------------------------------------
CREATE TABLE codigos_promo (
  id BIGSERIAL PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  discount INT NOT NULL,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO codigos_promo (code, discount) VALUES
  ('PRIMAVERA10', 10),
  ('VERANO20', 20),
  ('LIBIA15', 15);

-- ------------------------------------------------------------
-- 5. Tabla de pedidos
-- ------------------------------------------------------------
CREATE TABLE pedidos (
  id BIGSERIAL PRIMARY KEY,
  cliente TEXT NOT NULL,
  telefono TEXT NOT NULL DEFAULT '',
  direccion TEXT NOT NULL DEFAULT '',
  productos JSONB NOT NULL DEFAULT '[]',
  total DOUBLE PRECISION NOT NULL DEFAULT 0,
  metodo_pago TEXT NOT NULL DEFAULT '',
  estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'enviado', 'cancelado')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 6. Actualizar precios a COP (ya estaban en COP en el seed original)
--    Solo verificamos que sean valores razonables de COP
-- ------------------------------------------------------------
UPDATE productos SET precio = CASE nombre
  WHEN 'Vestido Floral Primavera' THEN 89900
  WHEN 'Blusa Casual de Lino' THEN 59900
  WHEN 'Pantalón Recto Elegante' THEN 69900
  WHEN 'Chaqueta de Mezclilla' THEN 119900
  WHEN 'Falda Plisada Midi' THEN 74900
  WHEN 'Suéter de Algodón Suave' THEN 84900
  WHEN 'Camisa Oversize Blanca' THEN 64900
  WHEN 'Short de Algodón' THEN 49900
  WHEN 'Blusa Satinada' THEN 79900
  WHEN 'Vestido Negro Noche' THEN 129900
  WHEN 'Chaleco Tejido' THEN 94900
  WHEN 'Pantalón Palazzo' THEN 84900
  ELSE precio
END;

-- ------------------------------------------------------------
-- 7. Asignar descuentos a productos
-- ------------------------------------------------------------
UPDATE productos SET discount = '{"active": true, "percentage": 15, "expiresAt": "2026-12-31"}'::jsonb
WHERE nombre = 'Vestido Floral Primavera';

UPDATE productos SET discount = '{"active": true, "percentage": 10, "expiresAt": "2026-11-30"}'::jsonb
WHERE nombre = 'Chaqueta de Mezclilla';

UPDATE productos SET discount = '{"active": true, "percentage": 20, "expiresAt": "2026-10-31"}'::jsonb
WHERE nombre = 'Suéter de Algodón Suave';

-- ------------------------------------------------------------
-- 8. Asignar tallas y stock a cada producto
--    (mapeo por nombre para no depender de IDs fijos)
-- ------------------------------------------------------------
INSERT INTO producto_tallas (producto_id, talla_id, stock)
SELECT p.id, t.id, s.stock
FROM productos p
CROSS JOIN tallas t
JOIN (VALUES
  -- Vestido Floral Primavera
  ('Vestido Floral Primavera', '2T', 5),
  ('Vestido Floral Primavera', '3T', 3),
  ('Vestido Floral Primavera', '4T', 0),
  ('Vestido Floral Primavera', '5T', 7),
  -- Blusa Casual de Lino
  ('Blusa Casual de Lino', '2T', 4),
  ('Blusa Casual de Lino', '3T', 6),
  ('Blusa Casual de Lino', '4T', 2),
  ('Blusa Casual de Lino', '5T', 0),
  -- Pantalón Recto Elegante
  ('Pantalón Recto Elegante', '2T', 8),
  ('Pantalón Recto Elegante', '3T', 5),
  ('Pantalón Recto Elegante', '4T', 3),
  ('Pantalón Recto Elegante', '5T', 6),
  -- Chaqueta de Mezclilla
  ('Chaqueta de Mezclilla', '3T', 4),
  ('Chaqueta de Mezclilla', '4T', 2),
  ('Chaqueta de Mezclilla', '5T', 5),
  ('Chaqueta de Mezclilla', '6T', 0),
  -- Falda Plisada Midi
  ('Falda Plisada Midi', '2T', 3),
  ('Falda Plisada Midi', '3T', 5),
  ('Falda Plisada Midi', '4T', 4),
  ('Falda Plisada Midi', '5T', 2),
  -- Suéter de Algodón Suave
  ('Suéter de Algodón Suave', '3T', 6),
  ('Suéter de Algodón Suave', '4T', 4),
  ('Suéter de Algodón Suave', '5T', 0),
  ('Suéter de Algodón Suave', '6T', 3),
  -- Camisa Oversize Blanca
  ('Camisa Oversize Blanca', '2T', 7),
  ('Camisa Oversize Blanca', '3T', 5),
  ('Camisa Oversize Blanca', '4T', 3),
  ('Camisa Oversize Blanca', '5T', 4),
  -- Short de Algodón
  ('Short de Algodón', '2T', 6),
  ('Short de Algodón', '3T', 4),
  ('Short de Algodón', '4T', 5),
  ('Short de Algodón', '5T', 3),
  -- Blusa Satinada
  ('Blusa Satinada', '3T', 4),
  ('Blusa Satinada', '4T', 3),
  ('Blusa Satinada', '5T', 5),
  -- Vestido Negro Noche
  ('Vestido Negro Noche', '4T', 2),
  ('Vestido Negro Noche', '5T', 3),
  ('Vestido Negro Noche', '6T', 4),
  -- Chaleco Tejido
  ('Chaleco Tejido', '3T', 3),
  ('Chaleco Tejido', '4T', 4),
  ('Chaleco Tejido', '5T', 2),
  -- Pantalón Palazzo
  ('Pantalón Palazzo', '3T', 5),
  ('Pantalón Palazzo', '4T', 3),
  ('Pantalón Palazzo', '5T', 6)
) AS s(producto_nombre, talla_nombre, stock)
  ON p.nombre = s.producto_nombre
  AND t.nombre = s.talla_nombre;

-- ------------------------------------------------------------
-- 9. Semillas de pedidos de ejemplo
-- ------------------------------------------------------------
INSERT INTO pedidos (cliente, telefono, direccion, productos, total, metodo_pago, estado) VALUES
  (
    'María González',
    '3001234567',
    'Cra 45 #12-34, Barrio Centro',
    '[{"nombre": "Vestido Floral Primavera", "talla": "3T", "cantidad": 1, "precio": 89900}, {"nombre": "Falda Plisada Midi", "talla": "4T", "cantidad": 1, "precio": 74900}]'::jsonb,
    164800,
    'Wompi',
    'pendiente'
  ),
  (
    'Laura Martínez',
    '3009876543',
    'Calle 80 #23-45, Niquía',
    '[{"nombre": "Suéter de Algodón Suave", "talla": "4T", "cantidad": 1, "precio": 67920}]'::jsonb,
    67920,
    'WhatsApp',
    'pendiente'
  ),
  (
    'Ana López',
    '3005551234',
    'Cra 65 #45-12, Laureles',
    '[{"nombre": "Camisa Oversize Blanca", "talla": "3T", "cantidad": 1, "precio": 64900}, {"nombre": "Short de Algodón", "talla": "4T", "cantidad": 1, "precio": 49900}]'::jsonb,
    114800,
    'Wompi',
    'enviado'
  ),
  (
    'Carmen Ruiz',
    '3007778888',
    'Calle 33 #10-20, El Poblado',
    '[{"nombre": "Blusa Casual de Lino", "talla": "3T", "cantidad": 1, "precio": 59900}, {"nombre": "Pantalón Recto Elegante", "talla": "4T", "cantidad": 1, "precio": 69900}, {"nombre": "Chaqueta de Mezclilla", "talla": "5T", "cantidad": 1, "precio": 107910}]'::jsonb,
    237710,
    'WhatsApp',
    'enviado'
  );

-- ------------------------------------------------------------
-- 10. RLS — Row Level Security
-- ------------------------------------------------------------
ALTER TABLE tallas ENABLE ROW LEVEL SECURITY;
ALTER TABLE producto_tallas ENABLE ROW LEVEL SECURITY;
ALTER TABLE codigos_promo ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;

-- Grant de acceso
GRANT SELECT ON tallas TO anon, authenticated;
GRANT ALL ON tallas TO authenticated;

GRANT SELECT ON producto_tallas TO anon, authenticated;
GRANT ALL ON producto_tallas TO authenticated;

GRANT SELECT ON codigos_promo TO anon, authenticated;
GRANT ALL ON codigos_promo TO authenticated;

GRANT SELECT, INSERT ON pedidos TO anon;
GRANT ALL ON pedidos TO authenticated;

-- Policies: tallas
CREATE POLICY "tallas_select_anon" ON tallas
  FOR SELECT TO anon USING (true);

CREATE POLICY "tallas_all_auth" ON tallas
  FOR ALL TO authenticated USING (true);

-- Policies: producto_tallas
CREATE POLICY "producto_tallas_select_anon" ON producto_tallas
  FOR SELECT TO anon USING (true);

CREATE POLICY "producto_tallas_all_auth" ON producto_tallas
  FOR ALL TO authenticated USING (true);

-- Policies: codigos_promo
CREATE POLICY "codigos_promo_select_anon" ON codigos_promo
  FOR SELECT TO anon USING (activo = true);

CREATE POLICY "codigos_promo_all_auth" ON codigos_promo
  FOR ALL TO authenticated USING (true);

-- Policies: pedidos
CREATE POLICY "pedidos_select_anon" ON pedidos
  FOR SELECT TO anon USING (true);

CREATE POLICY "pedidos_insert_anon" ON pedidos
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "pedidos_all_auth" ON pedidos
  FOR ALL TO authenticated USING (true);
