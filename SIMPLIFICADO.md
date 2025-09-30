# Guía: Cambiar QR Scan de Dashboard a Treasures con Modal

## Objetivo
Cambiar el flujo post-scan QR para usuarios autenticados:
- **Antes**: QR → `/dashboard` + notificación
- **Después**: QR → `/treasures` + modal automático del tesoro

## Pasos de Implementación

### 1. Cambiar API Response (treasure-scan)
**Archivo**: `/src/app/api/treasure-scan/route.ts`

**Líneas 18-24**: Simplificar redirects - tanto éxito como "already scanned" van igual
```typescript
// ANTES
if (result.success) {
  const redirectParam = result.alreadyScanned ? 'already-found' : 'found'
  return NextResponse.json({
    success: true,
    redirect: `/dashboard?treasure=${redirectParam}`,
    message: result.message
  })

// DESPUÉS
if (result.success) {
  return NextResponse.json({
    success: true,
    redirect: `/treasures?scanned=${code}`,
    message: result.message
  })
```

**Líneas 25-31**: Solo errores técnicos necesitan mensaje
```typescript
// ANTES
} else {
  return NextResponse.json({
    success: false,
    redirect: `/dashboard?treasure=error&message=${encodeURIComponent(result.message || 'Error desconocido')}`,
    message: result.message
  })

// DESPUÉS
} else {
  return NextResponse.json({
    success: false,
    redirect: `/treasures?scanned=${code}&error=technical`,
    message: result.message
  })
```

**Línea 36**: Cambiar redirect de error catch
```typescript
// ANTES
redirect: '/dashboard?treasure=error&message=Error%20interno'

// DESPUÉS
redirect: '/treasures?scanned=unknown&error=technical'
```

### 2. Actualizar ProgressTracker para Modal Automático
**Archivo**: `/src/app/components/features/progress-tracker.tsx`

**Línea 22-27**: Agregar nueva prop
```typescript
interface ProgressTrackerProps {
  hunt: TreasureHunt;
  progress: TreasureProgress | null;
  scannedTreasures: Treasure[];
  onRefresh?: () => void;
  scannedCode?: string | null; // NUEVA PROP
}
```

**Línea 29-34**: Actualizar function signature
```typescript
export default function ProgressTracker({
  hunt,
  progress,
  scannedTreasures,
  onRefresh,
  scannedCode, // NUEVA PROP
}: ProgressTrackerProps) {
```

**Línea 49**: Agregar scannedCode a dependencies
```typescript
useEffect(() => {
  loadAllTreasures();
}, [hunt.id, scannedTreasures, scannedCode]); // AGREGAR scannedCode
```

**Línea 75**: Agregar nuevo useEffect para modal automático
```typescript
// AGREGAR DESPUÉS DE loadAllTreasures
useEffect(() => {
  if (scannedCode && allTreasures.length > 0) {
    const treasure = allTreasures.find(t => t.treasure_code === scannedCode);
    if (treasure) {
      setSelectedTreasure(treasure);
    }
  }
}, [scannedCode, allTreasures]);
```

### 3. Actualizar Treasures Page para leer URL
**Archivo**: `/src/app/(protected)/treasures/page.tsx`

**Línea 3**: Agregar imports
```typescript
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"; // AGREGAR
import { toast } from "sonner"; // AGREGAR
```

**Línea 24**: Agregar hook
```typescript
export default function TreasuresPage() {
  const [data, setData] = useState<TreasurePageData | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session, isPending } = useAuth();
  const searchParams = useSearchParams(); // AGREGAR
```

**Línea 32**: Agregar lógica para manejo de errores con toast
```typescript
useEffect(() => {
  if (!isPending && session?.user) {
    loadTreasureData();
  } else if (!isPending && !session?.user) {
    setLoading(false);
  }
}, [session, isPending]);

// AGREGAR NUEVO useEffect para errores
useEffect(() => {
  const error = searchParams.get('error');
  if (error === 'technical') {
    toast.error("Algo salió mal. Intenta escanear el código nuevamente.");
  }
}, [searchParams]);
```

**Línea 120**: Pasar scannedCode al ProgressTracker
```typescript
<ProgressTracker
  hunt={data.hunt}
  progress={data.progress}
  scannedTreasures={data.scannedTreasures}
  onRefresh={loadTreasureData}
  scannedCode={searchParams.get('scanned')} // AGREGAR
/>
```

### 4. Actualizar Error Handling en Landing Page
**Archivo**: `/src/app/[year]/t/[code]/page.tsx`

**Líneas 48 y 52**: Cambiar redirects de error
```typescript
// ANTES
router.push('/dashboard?treasure=error&message=Error%20inesperado')
router.push('/dashboard?treasure=error&message=Error%20interno')

// DESPUÉS
router.push('/treasures?scanned=unknown&error=technical')
router.push('/treasures?scanned=unknown&error=technical')
```

## Resultado Esperado

### Flujo Exitoso (tesoro nuevo O ya encontrado):
1. Usuario escanea QR → `/2025/t/CODIGO`
2. API procesa → success → redirect `/treasures?scanned=CODIGO`
3. Treasures page lee `scanned=CODIGO` → pasa a ProgressTracker
4. ProgressTracker encuentra tesoro → abre modal automáticamente
5. Usuario ve palabra secreta inmediatamente (sin importar si ya lo tenía)

### Flujo de Error:
1. Usuario escanea QR → `/2025/t/CODIGO`
2. API procesa → error técnico → redirect `/treasures?scanned=CODIGO&error=technical`
3. Treasures page detecta `error=technical` → muestra toast: "Algo salió mal. Intenta escanear el código nuevamente."
4. Usuario ve página normal de treasures + toast de error

## Archivos No Modificados
- `/dashboard/page.tsx` - Seguirá funcionando normal, solo recibirá menos tráfico post-scan
- `treasure-notification.tsx` - Sigue funcionando para otros casos
- Login flow para usuarios no autenticados - Sin cambios