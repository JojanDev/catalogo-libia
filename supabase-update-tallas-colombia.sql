-- ============================================================
-- Actualización: tallas colombianas (numérico infantil + adulto inicial)
-- Ejecutar en el SQL Editor de Supabase
-- ============================================================

-- 1. Limpiar tallas actuales y sus asignaciones
DELETE FROM producto_tallas;
DELETE FROM tallas;

-- 2. Insertar tallas colombianas
INSERT INTO tallas (nombre) VALUES
  -- Infantil numérico (par)
  ('2'), ('4'), ('6'), ('8'), ('10'), ('12'), ('14'), ('16'),
  -- Adulto inicial
  ('XS'), ('S'), ('M');

-- 3. Reasignar stock por producto × talla
INSERT INTO producto_tallas (producto_id, talla_id, stock)
SELECT p.id, t.id, s.stock
FROM productos p
CROSS JOIN tallas t
JOIN (VALUES
  -- Vestido Floral Primavera
  ('Vestido Floral Primavera', '2', 5),
  ('Vestido Floral Primavera', '4', 8),
  ('Vestido Floral Primavera', '6', 6),
  ('Vestido Floral Primavera', '8', 4),
  ('Vestido Floral Primavera', '10', 3),
  ('Vestido Floral Primavera', '12', 0),
  -- Blusa Casual de Lino
  ('Blusa Casual de Lino', '2', 4),
  ('Blusa Casual de Lino', '4', 6),
  ('Blusa Casual de Lino', '6', 7),
  ('Blusa Casual de Lino', '8', 5),
  ('Blusa Casual de Lino', '10', 3),
  ('Blusa Casual de Lino', '12', 2),
  -- Pantalón Recto Elegante
  ('Pantalón Recto Elegante', '2', 8),
  ('Pantalón Recto Elegante', '4', 5),
  ('Pantalón Recto Elegante', '6', 6),
  ('Pantalón Recto Elegante', '8', 4),
  ('Pantalón Recto Elegante', '10', 3),
  ('Pantalón Recto Elegante', '12', 0),
  -- Chaqueta de Mezclilla
  ('Chaqueta de Mezclilla', '4', 5),
  ('Chaqueta de Mezclilla', '6', 4),
  ('Chaqueta de Mezclilla', '8', 2),
  ('Chaqueta de Mezclilla', '10', 0),
  -- Falda Plisada Midi
  ('Falda Plisada Midi', '4', 5),
  ('Falda Plisada Midi', '6', 4),
  ('Falda Plisada Midi', '8', 2),
  ('Falda Plisada Midi', '10', 1),
  -- Suéter de Algodón Suave
  ('Suéter de Algodón Suave', '4', 6),
  ('Suéter de Algodón Suave', '6', 4),
  ('Suéter de Algodón Suave', '8', 3),
  ('Suéter de Algodón Suave', '10', 2),
  ('Suéter de Algodón Suave', '12', 1),
  -- Camisa Oversize Blanca
  ('Camisa Oversize Blanca', '2', 7),
  ('Camisa Oversize Blanca', '4', 5),
  ('Camisa Oversize Blanca', '6', 4),
  ('Camisa Oversize Blanca', '8', 3),
  ('Camisa Oversize Blanca', '10', 0),
  -- Short de Algodón
  ('Short de Algodón', '2', 6),
  ('Short de Algodón', '4', 4),
  ('Short de Algodón', '6', 5),
  ('Short de Algodón', '8', 3),
  ('Short de Algodón', '10', 1),
  -- Blusa Satinada
  ('Blusa Satinada', '4', 4),
  ('Blusa Satinada', '6', 5),
  ('Blusa Satinada', '8', 3),
  ('Blusa Satinada', '10', 0),
  -- Vestido Negro Noche
  ('Vestido Negro Noche', '6', 3),
  ('Vestido Negro Noche', '8', 4),
  ('Vestido Negro Noche', '10', 3),
  ('Vestido Negro Noche', '12', 2),
  -- Chaleco Tejido
  ('Chaleco Tejido', '4', 4),
  ('Chaleco Tejido', '6', 2),
  ('Chaleco Tejido', '8', 0),
  -- Pantalón Palazzo
  ('Pantalón Palazzo', '4', 6),
  ('Pantalón Palazzo', '6', 3),
  ('Pantalón Palazzo', '8', 2),
  ('Pantalón Palazzo', '10', 0)
) AS s(producto_nombre, talla_nombre, stock)
  ON p.nombre = s.producto_nombre
  AND t.nombre = s.talla_nombre;
