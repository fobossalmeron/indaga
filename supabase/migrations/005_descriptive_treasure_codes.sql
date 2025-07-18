-- Migración: Actualizar códigos de tesoros a formato descriptivo
-- Cambiar de INDAGA-2025-001 a CAFE-LIMON
-- Fecha: 2025-01-17

-- Actualizar códigos existentes a formato descriptivo
UPDATE treasure_hunt_2025_treasures SET
    treasure_code = CASE
        WHEN treasure_code = 'INDAGA-2025-001' THEN 'CENTRO-HISTORICO'
        WHEN treasure_code = 'INDAGA-2025-002' THEN 'PARQUE-FUNDIDORA'
        WHEN treasure_code = 'INDAGA-2025-003' THEN 'BARRIO-ANTIGUO'
        WHEN treasure_code = 'INDAGA-2025-004' THEN 'MACROPLAZA'
        WHEN treasure_code = 'INDAGA-2025-005' THEN 'CERRO-SILLA'
        WHEN treasure_code = 'INDAGA-2025-006' THEN 'CAFE-LIMON'
        WHEN treasure_code = 'INDAGA-2025-007' THEN 'PLAZA-ZARAGOZA'
        WHEN treasure_code = 'INDAGA-2025-008' THEN 'MUSEO-PALACIO'
        WHEN treasure_code = 'INDAGA-2025-009' THEN 'TEATRO-CIUDAD'
        WHEN treasure_code = 'INDAGA-2025-010' THEN 'MERCADO-JUAREZ'
        ELSE treasure_code
    END
WHERE treasure_code LIKE 'INDAGA-2025-%';

-- Verificar que la actualización se realizó correctamente
-- Este comentario es solo informativo para revisar después de la migración
-- SELECT treasure_code, treasure_name FROM treasure_hunt_2025_treasures ORDER BY treasure_code;