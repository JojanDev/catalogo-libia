-- ============================================================
-- Migración: Administrador de Descuentos
-- Ejecutar en el SQL Editor de Supabase
-- ============================================================

-- 1. Tabla de descuentos
CREATE TABLE descuentos (
  id BIGSERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  porcentaje INT NOT NULL CHECK (porcentaje > 0 AND porcentaje <= 100),
  fecha_vencimiento DATE NOT NULL,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Relación muchos a muchos descuento ↔ producto
CREATE TABLE descuento_productos (
  descuento_id BIGINT NOT NULL REFERENCES descuentos(id) ON DELETE CASCADE,
  producto_id BIGINT NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  PRIMARY KEY (descuento_id, producto_id)
);

-- 3. Migrar descuentos existentes del JSONB a las nuevas tablas
INSERT INTO descuentos (nombre, porcentaje, fecha_vencimiento)
SELECT
  'Descuento ' || nombre,
  (discount->>'percentage')::INT,
  (discount->>'expiresAt')::DATE
FROM productos
WHERE discount IS NOT NULL
  AND discount->>'active' = 'true';

INSERT INTO descuento_productos (descuento_id, producto_id)
SELECT d.id, p.id
FROM productos p
JOIN descuentos d
  ON d.porcentaje = (p.discount->>'percentage')::INT
  AND d.nombre = 'Descuento ' || p.nombre
WHERE p.discount IS NOT NULL
  AND p.discount->>'active' = 'true';

-- 4. Eliminar el descuento JSONB de productos (ya no se usa)
ALTER TABLE productos DROP COLUMN IF EXISTS discount;

-- 5. RLS
ALTER TABLE descuentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE descuento_productos ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON descuentos TO anon, authenticated;
GRANT ALL ON descuentos TO authenticated;

GRANT SELECT ON descuento_productos TO anon, authenticated;
GRANT ALL ON descuento_productos TO authenticated;

CREATE POLICY "descuentos_select_anon" ON descuentos
  FOR SELECT TO anon USING (activo = true);

CREATE POLICY "descuentos_all_auth" ON descuentos
  FOR ALL TO authenticated USING (true);

CREATE POLICY "descuento_productos_select_anon" ON descuento_productos
  FOR SELECT TO anon USING (true);

CREATE POLICY "descuento_productos_all_auth" ON descuento_productos
  FOR ALL TO authenticated USING (true);
