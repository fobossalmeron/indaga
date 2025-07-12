# Plan de Desarrollo: Página Rutas/[slug]

## Objetivo
Crear una página dinámica para mostrar rutas turísticas con mapa embebido, lista de pasos, y botones de acción.

## Estructura de la Página

### 1. Componentes Principales
- **Mapa de Google Maps embebido**
- **Lista de pasos** (usando PlaceCard existente)
- **Botones de acción**:
  - "Agendar tour"
  - "Abrir en Google Maps"
- **Contenido principal**:
  - Título de la ruta
  - Subtítulo
  - Descripción
- **Navegación**:
  - Botón "Volver a /rutas"

### 2. Arquitectura de Archivos

```
src/app/rutas/[slug]/
├── page.tsx          # Página principal
├── components/
│   ├── RouteMap.tsx  # Mapa de Google Maps
│   ├── RouteSteps.tsx # Lista de pasos
│   └── RouteHeader.tsx # Título, subtítulo, descripción
```

### 3. Flujo de Datos (Mockup)

#### Estructura de datos temporal (antes de Prismic):
```typescript
interface RouteData {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  mapEmbedUrl: string; // URL de Google Maps embed
  tourBookingUrl: string; // URL para agendar tour
  googleMapsUrl: string; // URL para abrir en Google Maps
  steps: Array<{
    id: string;
    title: string;
    area: string;
    mapLink: string;
    link: string;
    capsuleLink: string;
    category: string;
    description: string;
  }>;
}
```

### 4. Componentes a Desarrollar

#### RouteMap.tsx
- Iframe con Google Maps embebido
- Responsive design
- Altura fija apropiada

#### RouteSteps.tsx
- Lista de pasos usando PlaceCard existente
- Numeración de pasos
- Espaciado apropiado

#### RouteHeader.tsx
- Título principal
- Subtítulo
- Descripción
- Botones de acción (Agendar tour, Google Maps)
- Botón de volver

### 5. Layout y Diseño

**Layout de dos columnas (desktop):**
```
[Botón Volver]

[Título]
[Subtítulo]
[Descripción]

[Botón Agendar Tour] [Botón Google Maps]

┌─────────────────────┬─────────────────────┐
│                     │                     │
│   [Mapa Google      │   [Lista de Pasos]  │
│    Maps Embebido]   │   1. [PlaceCard]    │
│                     │   2. [PlaceCard]    │
│                     │   3. [PlaceCard]    │
│                     │   ...               │
│                     │                     │
└─────────────────────┴─────────────────────┘
```

**Layout móvil (stack vertical):**
```
[Botón Volver]
[Título, Subtítulo, Descripción]
[Botones de acción]
[Mapa]
[Lista de Pasos]
```

### 6. Implementación Paso a Paso

1. **Crear estructura de archivos**
   - page.tsx con layout básico
   - Componentes individuales

2. **Implementar RouteHeader**
   - Título, subtítulo, descripción
   - Botones de acción
   - Botón volver

3. **Implementar RouteMap**
   - Iframe de Google Maps
   - Responsive design

4. **Implementar RouteSteps**
   - Integrar PlaceCard existente
   - Numeración y layout

5. **Styling y responsive**
   - Tailwind CSS
   - Mobile-first approach

6. **Datos mockeados**
   - Crear datos de ejemplo
   - Implementar lógica de slug

### 7. Integración con Prismic (Patrón /agenda)

#### Estrategia de datos en page.tsx:
Siguiendo el patrón de `/agenda`, crear datos mock directamente en `page.tsx` para facilitar la integración posterior:

```typescript
// page.tsx - Datos mock que imitan estructura de Prismic
const mockRouteData = {
  data: {
    title: "Ruta Centro Histórico",
    subtitle: "Descubre la historia de Guadalajara",
    description: [{ type: "paragraph", text: "Una experiencia única..." }],
    map_embed_url: { url: "https://maps.google.com/embed/..." },
    tour_booking_url: { url: "https://booking.com/..." },
    google_maps_url: { url: "https://maps.google.com/..." },
    steps: [
      {
        step_title: "Catedral",
        step_area: "Centro",
        step_category: "Monumentos Históricos",
        // ... resto de campos PlaceCard
      }
    ]
  }
};
```

#### Campos necesarios en Prismic Custom Type:
- `title` (Text)
- `subtitle` (Text) 
- `description` (Rich Text)
- `map_embed_url` (Link)
- `tour_booking_url` (Link)
- `google_maps_url` (Link)
- `steps` (Group con campos de PlaceCard):
  - `step_title` (Text)
  - `step_area` (Text)
  - `step_map_link` (Link)
  - `step_link` (Link)
  - `step_capsule_link` (Link)
  - `step_category` (Select)
  - `step_description` (Text)

#### Patrón de fetching (como en /agenda):
```typescript
// Futuro: Implementación real con Prismic
export default async function RoutePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const client = await createClient();
  
  try {
    const route = await client.getByUID<Content.RouteDocument>("route", slug);
    if (!route) notFound();
    return <RouteView route={route} />;
  } catch (error) {
    console.error(`Error al obtener la ruta ${slug}:`, error);
    notFound();
  }
}

export const revalidate = 3600; // Igual que /agenda
```

#### Ventajas de este enfoque:
- **Transición suave**: Cambiar de mock a Prismic será solo intercambiar la fuente de datos
- **Consistencia**: Mismo patrón que /agenda
- **Testing**: Fácil probar con datos controlados
- **Desarrollo paralelo**: Frontend y Prismic setup pueden avanzar independientemente

### 8. Consideraciones Técnicas

- **SEO**: Meta tags dinámicos
- **Performance**: Lazy loading del mapa
- **Accesibilidad**: ARIA labels apropiados
- **Error handling**: 404 para slugs inexistentes
- **Loading states**: Skeletons mientras carga

### 9. Testing
- Componentes individuales
- Integración con datos mockeados
- Responsive design
- Navegación entre rutas

---

## Próximos Pasos
1. Implementar maqueta con datos estáticos
2. Probar funcionalidad y diseño
3. Configurar campos en Prismic
4. Conectar con API de Prismic
5. Testing completo