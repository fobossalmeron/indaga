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

    -- Insert all 41 treasures with descriptive codes, maps URLs and secret keywords
    INSERT INTO treasure_hunt_2025_treasures (hunt_id, treasure_code, treasure_name, treasure_secret, treasure_location_maps_url) VALUES
    (hunt_2025_id, 'CRACK-COFFEE-LAB', 'Crack Coffee Lab', 'Alquimia', 'https://maps.app.goo.gl/9nn2GCPo4FCrcCjA9'),
    (hunt_2025_id, 'APARATO', 'Aparato', 'Circuito', 'https://maps.app.goo.gl/RCGtMw9NUwMFwksMA'),
    (hunt_2025_id, 'SAXY', 'Saxy', 'Groove', 'https://maps.app.goo.gl/34kgHhedovUV66gS6'),
    (hunt_2025_id, 'GALERIA-GOTXIKOA', 'Galería Gotxikoa', 'Automático', 'https://maps.app.goo.gl/Wisa3aaYnBdkAVFa8'),
    (hunt_2025_id, 'LIMINAL-904', 'Liminal 904', 'Tránsito', 'https://maps.app.goo.gl/eBbatuyR3Rz2r4kGA'),
    (hunt_2025_id, 'TALLER-1010', 'Taller 10/10', 'Aguafuerte', 'https://maps.app.goo.gl/r3iKM59sj4n7X1228'),
    (hunt_2025_id, 'CUARTO-DE-SERVICIO', 'Cuarto de Servicio', 'Destilados', 'https://maps.app.goo.gl/DNzYciBbapPF1fjc7'),
    (hunt_2025_id, 'ZIG-ZAG', 'Zig Zag', 'Laberinto', 'https://maps.app.goo.gl/C6xyvHBfRYCLMduo9'),
    (hunt_2025_id, 'UNCULTURED', 'Uncultured', 'Impresión', 'https://maps.app.goo.gl/XeY4GPq8fGuqvudFA'),
    (hunt_2025_id, 'BENGALA', 'Bengala', 'Instante', 'https://maps.app.goo.gl/3TZoUGoxfmvJSApD9'),
    (hunt_2025_id, 'ARDE-ARTE', 'Arde Arte', 'Fuego', 'https://maps.app.goo.gl/fZDxhHoGf5o664nD6'),
    (hunt_2025_id, 'BELMONTE', 'Belmonte', 'Allende', 'https://maps.app.goo.gl/D9otZKJo7oeCsTJaA'),
    (hunt_2025_id, 'GARGANTUA', 'Gargantúa', 'Pantagruel', 'https://maps.app.goo.gl/mxKH5MFYZGY9Y6Ef9'),
    (hunt_2025_id, 'CUADROCHICO-CAFE', 'Cuadrochico Café', 'Afecto', 'https://maps.app.goo.gl/tgNpBy2cSqFVNuSW7'),
    (hunt_2025_id, 'RAY-BAR', 'Ray Bar', 'Balta', 'https://maps.app.goo.gl/593fyfBQ28ZKHTh18'),
    (hunt_2025_id, 'SUCULENTA-FONDITA-CULTURAL', 'Suculenta Fondita Cultural', 'Solidaria', 'https://maps.app.goo.gl/tPCgZUL6FWyKDTYu6'),
    (hunt_2025_id, 'PANUCO-COFFEE-BAR', 'Pánuco Coffee Bar', 'Tónicos', 'https://maps.app.goo.gl/FToFyh2WBoWHnyGS7'),
    (hunt_2025_id, 'BARVIN', 'Barvin', 'Vinilos', 'https://maps.app.goo.gl/iGWwXLo25raQEwpk7'),
    (hunt_2025_id, 'PUNTO-Y-COMA', 'Punto y Coma', 'Pausa', 'https://maps.app.goo.gl/Lv1yc6qG7ZAZL4zRA'),
    (hunt_2025_id, 'ALMACEN-42', 'Almacén 42', 'Malta', 'https://maps.app.goo.gl/4wSRmEGxHWw62BGr7'),
    (hunt_2025_id, 'FORTUITA', 'Fortuita', 'Suerte', 'https://maps.app.goo.gl/6DXYsRPTFZ8YFFzm6'),
    (hunt_2025_id, 'MAUT', 'MAUT', 'Intersección', 'https://maps.app.goo.gl/YCrfDUvAWdQXhjUM9'),
    (hunt_2025_id, 'GALERIA-ARTE-ACTUAL', 'Galería Arte Actual', 'Central', 'https://maps.app.goo.gl/2T5NFYro2q1wZCTd9'),
    (hunt_2025_id, 'THE-BERRY-BORER', 'The Berry Borer', 'Bruma', 'https://maps.app.goo.gl/SZuxDXy8yFr7RN7E9'),
    (hunt_2025_id, 'MONTECOYOTE', 'Montecoyote', 'Eco', 'https://maps.app.goo.gl/VF4vKMAYBmYU6MP76'),
    (hunt_2025_id, 'CAFE-ESOTERICO', 'Café Esotérico', 'Luna', 'https://maps.app.goo.gl/7SqjVk1mEY3thokn6'),
    (hunt_2025_id, 'CASA-VERNACULA', 'Casa Vernácula', 'Propio', 'https://maps.app.goo.gl/z6nhHDnXkaDH4DHF7'),
    (hunt_2025_id, 'SITIO-CENTRO', 'Sitio Centro', 'Eje', 'https://maps.app.goo.gl/Cbppi7H9kEVHtd9n7'),
    (hunt_2025_id, 'CHIPINQUE', 'Chipinque', 'Paraje', 'https://maps.app.goo.gl/vL9Ar42Qm1H8BQoh6'),
    (hunt_2025_id, 'YOKOTAN', 'Yokotan', 'Raíces', 'https://maps.app.goo.gl/yGAr2p3jdsv7KMxa7'),
    (hunt_2025_id, 'ASAMBLEA', 'Asamblea', 'Voz', 'https://maps.app.goo.gl/i3DQ9i7CAWkda32X9'),
    (hunt_2025_id, 'MAVERICK', 'Maverick', 'Destello', 'https://maps.app.goo.gl/WrrauFFXqV4uZ5jdA'),
    (hunt_2025_id, 'BAR-1900', 'Bar 1900', 'Época', 'https://maps.app.goo.gl/KwnWZCxYtBHBEEAn6'),
    (hunt_2025_id, 'REGULAR', 'Regular', 'Calma', 'https://maps.app.goo.gl/vexLUFGQqdWyVHvH8'),
    (hunt_2025_id, 'MARNE-GALERIA', 'Marne Galería', 'Murmullo', NULL),
    (hunt_2025_id, 'CAFE-LIMON', 'Café Limón', 'Altavista', 'https://maps.app.goo.gl/eCpGjmAtWbxWZgUr7'),
    (hunt_2025_id, 'COMANDO-CAFE', 'Comando Café', 'Misión', 'https://maps.app.goo.gl/vEFU4DpopqdN6mng6'),
    (hunt_2025_id, 'NODRIZA-ESTUDIO', 'Nodriza Estudio', 'Transmisión', 'https://maps.app.goo.gl/xAE8mT6RUm8cCWxQ7'),
    (hunt_2025_id, 'TROPICO-MARKET', 'Trópico Market', 'Cálido', 'https://maps.app.goo.gl/1iYfXJ6rLCySiBA39'),
    (hunt_2025_id, 'COFFEE-WITH-ALIENS', 'Coffee with Aliens', 'Galaxia', 'https://maps.app.goo.gl/6mGWyPYwCvQbZBwX6'),
    (hunt_2025_id, 'JUN-CAFE', 'Jun Café', 'Alba', 'https://maps.app.goo.gl/g6iCBLWAQwZ8mSBk7');

END $$;

-- Insert admin users
INSERT INTO users (email, full_name, role, email_verified)
VALUES
    ('fmagse@gmail.com', 'Admin User', 'admin', true),
    ('fobos.salmeron@gmail.com', 'Admin User', 'admin', true)
ON CONFLICT (email) DO UPDATE SET
    role = EXCLUDED.role,
    email_verified = EXCLUDED.email_verified;