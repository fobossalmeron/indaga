-- Migration 005: Treasure Hunt Data 2025
-- Insert hunt data, all 41 treasures, and admin users

-- Insert the 2025 treasure hunt
INSERT INTO treasure_hunts (name, year, description, start_date, end_date, is_active, total_treasures)
VALUES (
    'OFF FST FISL 2025',
    2025,
    'Búsqueda del tesoro durante el Festival Santa Lucía 2025. Explora la ciudad, escanea códigos QR y colecciona tesoros.',
    '2025-09-01 00:00:00+00',
    '2025-11-30 23:59:59+00',
    true,
    41
);

-- Get the hunt_id for the insert
DO $$
DECLARE
    hunt_2025_id UUID;
BEGIN
    -- Get the hunt_id for OFF FST FISL 2025
    SELECT id INTO hunt_2025_id
    FROM treasure_hunts
    WHERE year = 2025 AND name = 'OFF FST FISL 2025';

    -- Insert all 41 treasures with descriptive codes and empty descriptions
    INSERT INTO treasure_hunt_2025_treasures (hunt_id, treasure_code, treasure_name, treasure_description) VALUES
    (hunt_2025_id, 'CRACK-COFFEE-LAB', 'Crack Coffee Lab', ''),
    (hunt_2025_id, 'APARATO', 'Aparato', ''),
    (hunt_2025_id, 'SAXY', 'Saxy', ''),
    (hunt_2025_id, 'GALERIA-GOTXIKOA', 'Galería Gotxikoa', ''),
    (hunt_2025_id, 'LIMINAL-904', 'Liminal 904', ''),
    (hunt_2025_id, 'TALLER-1010', 'Taller 10/10', ''),
    (hunt_2025_id, 'CUARTO-DE-SERVICIO', 'Cuarto de Servicio', ''),
    (hunt_2025_id, 'ZIG-ZAG', 'Zig Zag', ''),
    (hunt_2025_id, 'UNCULTURED', 'Uncultured', ''),
    (hunt_2025_id, 'BENGALA', 'Bengala', ''),
    (hunt_2025_id, 'ARDE-ARTE', 'Arde Arte', ''),
    (hunt_2025_id, 'BELMONTE', 'Belmonte', ''),
    (hunt_2025_id, 'GARGANTUA', 'Gargantúa', ''),
    (hunt_2025_id, 'CUADROCHICO-CAFE', 'Cuadrochico Café', ''),
    (hunt_2025_id, 'RAY-BAR', 'Ray Bar', ''),
    (hunt_2025_id, 'SUCULENTA-FONDITA-CULTURAL', 'Suculenta Fondita Cultural', ''),
    (hunt_2025_id, 'PANUCO-COFFEE-BAR', 'Panuco Coffee Bar', ''),
    (hunt_2025_id, 'BARVIN', 'Barvin', ''),
    (hunt_2025_id, 'PUNTO-Y-COMA', 'Punto y Coma', ''),
    (hunt_2025_id, 'ALMACEN-42', 'Almacén 42', ''),
    (hunt_2025_id, 'FORTUITA', 'Fortuita', ''),
    (hunt_2025_id, 'MAUT', 'MAUT', ''),
    (hunt_2025_id, 'GALERIA-ARTE-ACTUAL', 'Galería Arte Actual', ''),
    (hunt_2025_id, 'THE-BERRY-BORER', 'The Berry Borer', ''),
    (hunt_2025_id, 'MONTECOYOTE', 'Montecoyote', ''),
    (hunt_2025_id, 'CAFE-ESOTERICO', 'Café Esotérico', ''),
    (hunt_2025_id, 'CASA-VERNACULA', 'Casa Vernacula', ''),
    (hunt_2025_id, 'SITIO-CENTRO', 'Sitio Centro', ''),
    (hunt_2025_id, 'CHIPINQUE', 'Chipinque', ''),
    (hunt_2025_id, 'YOKOTAN', 'Yokotan', ''),
    (hunt_2025_id, 'ASAMBLEA', 'Asamblea', ''),
    (hunt_2025_id, 'MAVERICK', 'Maverick', ''),
    (hunt_2025_id, 'BAR-1900', 'Bar 1900', ''),
    (hunt_2025_id, 'REGULAR', 'Regular', ''),
    (hunt_2025_id, 'MARNE-GALERIA', 'Marne Galería', ''),
    (hunt_2025_id, 'CAFE-LIMON', 'Café Limón', ''),
    (hunt_2025_id, 'COMANDO-CAFE', 'Comando Café', ''),
    (hunt_2025_id, 'NODRIZA-ESTUDIO', 'Nodriza Estudio', ''),
    (hunt_2025_id, 'TROPICO-MARKET', 'Trópico Market', ''),
    (hunt_2025_id, 'COFFEE-WITH-ALIENS', 'Coffee with Aliens', ''),
    (hunt_2025_id, 'JUN-CAFE', 'Jun Café', '');

END $$;

-- Insert admin users
INSERT INTO users (email, full_name, role, email_verified)
VALUES
    ('fmagse@gmail.com', 'Admin User', 'admin', true),
    ('fobos.salmeron@gmail.com', 'Admin User', 'admin', true)
ON CONFLICT (email) DO UPDATE SET
    role = EXCLUDED.role,
    email_verified = EXCLUDED.email_verified;