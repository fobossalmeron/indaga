# Plan de Implementación: QR Codes con URLs Públicas

## 📋 Resumen del Cambio

**Objetivo**: Cambiar de QR codes internos a URLs públicas que funcionen con la cámara nativa del teléfono.

**Beneficios**:
- ✅ Usuarios pueden escanear con cualquier app de cámara
- ✅ Onboarding fluido desde el primer escaneo
- ✅ No requiere abrir la app primero
- ✅ Códigos descriptivos más fáciles de recordar

## 🎯 Cambios Principales

### 1. **Estructura de URL Nueva**
```
Antes: INDAGA-2025-001 (solo dentro de la app)
Después: https://indaga.site/2025/t/CAFE-LIMON
```

### 2. **Códigos Descriptivos**
```
CAFE-LIMON
PARQUE-FUNDIDORA
CENTRO-HISTORICO
BARRIO-ANTIGUO
MACROPLAZA
CERRO-SILLA
```

### 3. **Flujo de Usuario Detallado**
1. **Escaneo QR** → Abre `https://indaga.site/2025/t/CAFE-LIMON`
2. **Detección auth** → Verifica si usuario está logueado
3. **Si NO está logueado:**
   - Redirect a `/login?scanned=CAFE-LIMON` o `/register?scanned=CAFE-LIMON`
   - Muestra mensaje: "CAFE LIMON escaneado con éxito para hacer válida la promoción inicia sesión o regístrate"
   - Usuario se registra/loguea
   - **DESPUÉS** del login exitoso → procesa hallazgo automáticamente
4. **Si SÍ está logueado:**
   - Procesa hallazgo inmediatamente
5. **Redirect** → `/dashboard` con progreso actualizado

## 🛠️ Implementación Técnica

### **Archivos a CREAR**
1. `/src/app/[year]/t/[code]/page.tsx` - Landing page para QR
2. `/src/lib/qr-public-handler.ts` - Lógica de procesamiento público
3. `/src/components/qr-landing.tsx` - Componente de confirmación

### **Archivos a MODIFICAR**
1. `/src/lib/treasure-hunt-2025.ts` - Actualizar validación de códigos
2. `/src/app/(auth)/login/page.tsx` - Agregar detección de ?scanned y mensaje
3. `/src/app/(auth)/register/page.tsx` - Agregar detección de ?scanned y mensaje
4. Sistema de auth para procesar treasure después del login cuando viene de QR
5. `/supabase/migrations/` - Nueva migración para códigos descriptivos
6. `/package.json` - Remover dependencias de escaneo

### **Archivos a ELIMINAR**
1. `/src/app/components/features/qr-scanner.tsx`
2. `/src/app/(protected)/qr-scanner/page.tsx`

## 📦 Dependencias a Remover

```json
// Remover de package.json:
"qr-scanner": "^1.4.2",
"@zxing/library": "^0.21.3",
"react-qr-scanner": "^1.0.0-alpha.11"
```

## 🗄️ Cambios en Base de Datos

### **Nueva Migración: `008_descriptive_treasure_codes.sql`**
```sql
-- Actualizar códigos existentes a formato descriptivo
UPDATE treasure_hunt_2025_treasures SET
    treasure_code = CASE
        WHEN treasure_code = 'INDAGA-2025-001' THEN 'CENTRO-HISTORICO'
        WHEN treasure_code = 'INDAGA-2025-002' THEN 'PARQUE-FUNDIDORA'
        WHEN treasure_code = 'INDAGA-2025-003' THEN 'BARRIO-ANTIGUO'
        WHEN treasure_code = 'INDAGA-2025-004' THEN 'MACROPLAZA'
        WHEN treasure_code = 'INDAGA-2025-005' THEN 'CERRO-SILLA'
        ELSE treasure_code
    END;
```

## 🔧 Funciones Modificadas

### **`processTreasureScan()` updates**
```typescript
// Cambiar validación de formato
// Antes: qrCode.startsWith('INDAGA-2025-')
// Después: /^[A-Z-]+$/.test(qrCode)

// Cambiar userId de hardcodeado a parámetro requerido
// Antes: const userId = 'temp-user-id' (hardcodeado)
// Después: recibir userId como parámetro requerido
export async function processTreasureScan(
  qrCode: string, 
  userId: string  // ← REQUERIDO (no opcional)
): Promise<TreasureScanResult>

// NOTA: Solo se llama DESPUÉS de que el usuario esté autenticado
// El flujo garantiza que siempre tengamos un userId válido
```

## 🚀 Fases de Implementación

### **Fase 1: Preparación**
- [ ] Crear nueva migración para códigos descriptivos
- [ ] Actualizar función `processTreasureScan()`
- [ ] Crear componente de landing page

### **Fase 2: Implementación**
- [ ] Crear ruta dinámica `/[year]/t/[code]/`
- [ ] Implementar lógica de detección de auth
- [ ] Integrar con sistema de registro existente

### **Fase 3: Limpieza**
- [ ] Remover componente de scanner interno
- [ ] Limpiar dependencias de package.json
- [ ] Actualizar navegación (remover link a /qr-scanner)

### **Fase 4: Testing**
- [ ] Probar URLs con cámara nativa
- [ ] Verificar flujo de registro
- [ ] Confirmar redirect a dashboard

## 📱 Ejemplo de Implementación

### **Página Landing (`/[year]/t/[code]/page.tsx`)**
```typescript
export default async function TreasureLanding({ 
  params 
}: { 
  params: { year: string; code: string } 
}) {
  // 1. Verificar auth
  const userId = await getCurrentUserId() // puede ser null
  
  // 2. Si NO está logueado: redirect con parámetro ?scanned
  if (!userId) {
    redirect(`/login?scanned=${params.code}`)
  }
  
  // 3. Si SÍ está logueado: procesar hallazgo
  const result = await processTreasureScan(params.code, userId)
  
  // 4. Redirect a dashboard con confirmación
  if (result.success) {
    redirect('/dashboard?treasure=found')
  }
}
```

### **URL Examples**
```
https://indaga.site/2025/t/CAFE-LIMON
https://indaga.site/2025/t/PARQUE-FUNDIDORA
https://indaga.site/2025/t/CENTRO-HISTORICO
```

## ✅ Validación Final

- [ ] QR codes funcionan con cámara nativa
- [ ] Registro automático sin fricción
- [ ] Códigos descriptivos fáciles de recordar
- [ ] Dashboard muestra progreso actualizado
- [ ] Dependencias de escaneo removidas
- [ ] URLs escalables para años futuros

## 🎯 Notas Importantes

1. **Backward Compatibility**: Mantener soporte temporal para códigos antiguos
2. **SEO**: URLs públicas indexables por Google
3. **Analytics**: Tracking de conversión QR → registro
4. **Security**: Rate limiting en endpoints públicos
5. **Future-proof**: Estructura preparada para treasure hunts 2026+

---

**¿Apruebas este plan? Si sí, procedo con la implementación.**