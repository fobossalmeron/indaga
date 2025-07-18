-- Migración: Insertar tesoros faltantes
-- Insertar tesoros que no existen en la base de datos
-- Fecha: 2025-01-17

-- Insertar tesoros que faltan
INSERT INTO treasure_hunt_2025_treasures (hunt_id, treasure_code, treasure_name, treasure_description, location_coordinates) VALUES
('73f804d8-2f6d-428f-87ae-f6f035eb5e57', 'CAFE-LIMON', 'Café Limón', 'Un café con historia y sabor', point(25.6866, -100.3161)),
('73f804d8-2f6d-428f-87ae-f6f035eb5e57', 'PLAZA-ZARAGOZA', 'Plaza Zaragoza', 'El corazón histórico de la ciudad', point(25.6869, -100.3164)),
('73f804d8-2f6d-428f-87ae-f6f035eb5e57', 'MUSEO-PALACIO', 'Museo del Palacio', 'Arte e historia en un palacio', point(25.6862, -100.3158)),
('73f804d8-2f6d-428f-87ae-f6f035eb5e57', 'TEATRO-CIUDAD', 'Teatro de la Ciudad', 'Cultura y entretenimiento', point(25.6858, -100.3167)),
('73f804d8-2f6d-428f-87ae-f6f035eb5e57', 'MERCADO-JUAREZ', 'Mercado Juárez', 'Tradición y sabores locales', point(25.6871, -100.3155))
ON CONFLICT (treasure_code) DO NOTHING;

-- Verificar que la inserción se realizó correctamente
-- SELECT treasure_code, treasure_name FROM treasure_hunt_2025_treasures ORDER BY treasure_code; 