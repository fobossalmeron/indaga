# TODO: Revisar y Limpiar Migraciones de Supabase

Antes de empezar haz un build y revisa los warning

## Problema Identificado

Las migraciones actuales en `supabase/migrations/` están desordenadas y contienen operaciones innecesarias que no tienen razón de ser. Es necesario hacer una revisión completa para:

1. **Eliminar migraciones redundantes** - Algunas migraciones hacen lo mismo o operaciones que se cancelan entre sí
2. **Reorganizar el orden** - Las migraciones no siguen una secuencia lógica
3. **Consolidar operaciones** - Múltiples migraciones pequeñas que podrían ser una sola
4. **Eliminar migraciones innecesarias** - Algunas no aportan valor o están mal diseñadas

## Migraciones Actuales a Revisar

- `001_initial_schema.sql` - Esquema inicial
- `002_treasure_hunt_2025.sql` - Tablas de treasure hunt
- `003_rls_policies.sql` - Políticas RLS
- `004_better_auth_tables.sql` - Tablas de autenticación
- `005_descriptive_treasure_codes.sql` - Actualización de códigos
- `006_insert_missing_treasures.sql` - Inserción de tesoros faltantes
- `20250718055705_fix_treasure_hunt_rls_policies.sql` - Corrección de políticas RLS

## Acciones Necesarias

1. **Auditar cada migración** para identificar redundancias
2. **Consolidar migraciones relacionadas** en una sola
3. **Eliminar migraciones innecesarias** que no aportan valor
4. **Reordenar secuencialmente** las migraciones restantes
5. **Documentar el propósito** de cada migración que se mantenga

## Prioridad

**Alta** - Esto afecta la mantenibilidad del proyecto y puede causar problemas en despliegues futuros.

## Notas

- Hacer backup de la base de datos antes de cualquier cambio
- Probar las migraciones en un entorno de desarrollo
- Documentar cualquier cambio en el esquema de la base de datos
