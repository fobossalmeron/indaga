# TODO: Limpieza de Variables de Entorno

## 🚨 Problema Identificado

Actualmente tenemos **variables de entorno duplicadas** en Vercel debido a la migración de configuración:

### Situación Actual:
- **Antes**: Configuración manual de Supabase con variables propias
- **Ahora**: Uso del marketplace de Vercel con variables `VERCELDB__*`

### Variables Duplicadas Detectadas:

#### Supabase - Configuración Original:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY  
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_DB_PASSWORD
DATABASE_URL
```

#### Supabase - Marketplace de Vercel:
```
VERCELDB__NEXT_PUBLIC_SUPABASE_URL
VERCELDB__NEXT_PUBLIC_SUPABASE_ANON_KEY
VERCELDB__SUPABASE_SERVICE_ROLE_KEY
VERCELDB__SUPABASE_ANON_KEY
VERCELDB__SUPABASE_URL
VERCELDB__SUPABASE_JWT_SECRET
VERCELDB__POSTGRES_URL
VERCELDB__POSTGRES_PRISMA_URL
VERCELDB__POSTGRES_URL_NON_POOLING
VERCELDB__POSTGRES_HOST
VERCELDB__POSTGRES_USER
VERCELDB__POSTGRES_PASSWORD
VERCELDB__POSTGRES_DATABASE
```

## 🎯 Acción Requerida

### 1. **Análisis Previo**
- [ ] Verificar qué variables se están usando actualmente en el código
- [ ] Identificar dependencias en `src/lib/supabase.ts` y `src/lib/auth.ts`
- [ ] Revisar referencias en componentes y páginas

### 2. **Migración Segura**
- [ ] Decidir si usar variables originales o las del marketplace
- [ ] Actualizar código para usar un set consistente de variables
- [ ] Probar en development y preview antes de producción

### 3. **Limpieza Final**
- [ ] Eliminar variables duplicadas de Vercel
- [ ] Actualizar documentación
- [ ] Confirmar que todo funciona correctamente

## ⚠️ Consideraciones

### Variables del Marketplace (Recomendado):
- ✅ Gestión automática por Vercel
- ✅ Configuración optimizada
- ✅ Integración nativa con Supabase

### Variables Originales:
- ❌ Gestión manual requerida
- ❌ Posible desincronización
- ❌ Más propensas a errores

## 📋 Próximos Pasos

1. **Prioridad Alta**: Revisar y consolidar variables de Supabase
2. **Prioridad Media**: Limpiar variables obsoletas
3. **Prioridad Baja**: Documentar configuración final

---

**Fecha**: 2025-07-18  
**Status**: Pendiente  
**Responsable**: Equipo de desarrollo  
**Impacto**: Limpieza y optimización - No funcional crítico