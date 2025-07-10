# Guía para mostrar todas las tarjetas de lugares (`Place`) en `/guia`

---

## Objetivo

Que la ruta `/guia` muestre todas las tarjetas de lugares (componente `Place`), sin importar su categoría, similar a cómo funciona `/agenda`.

---

### 1. Preservar la página actual de `/guia`

- Renombrar el archivo actual `src/app/guia/page.tsx` a `src/app/guia/_old_guia_page.tsx` (nombre que no cause confusión ni colisión futura).
- Asegurarse de que el componente siga disponible para futuras referencias o rutas alternativas si se requiere.

### 2. Arquitectura: separación server/client component (igual que agenda)

- El archivo `src/app/guia/page.tsx` será un **Server Component**.
- Su única responsabilidad es obtener **todos** los documentos de tipo `lugar` desde Prismic (sin filtrar por categoría), ordenarlos alfabéticamente y pasar los datos a un componente client.
- El componente client se llamará `GuideFull` y estará en `src/app/guia/GuideFull.tsx`.
- `GuideFull` recibirá la lista de lugares y se encargará de:
  - Renderizar los filtros usando el componente `GuideCategorySelect` (`src/app/guia/GuideCategorySelect.tsx`).
  - Renderizar las tarjetas `Place` (`src/app/guia/[slug]/Place.tsx`).
  - Manejar el filtrado y la interacción con el usuario.
- Esta separación permite aprovechar el SSR/SSG de Next.js para la obtención de datos y mantener la UI reactiva y filtrable en el cliente.

### 3. Asignar color y props a cada lugar y mostrar la categoría

- Para cada lugar, obtener la categoría (`categoria`) y mapearla al objeto `categories` para extraer el color correspondiente.
- Usar el componente `Category` de `@/app/components/Category.tsx` para mostrar la categoría en cada tarjeta `Place`.
- Si la categoría del lugar no existe en el objeto `categories`, asignar un color por defecto o manejar el caso.
- Considerar refactorizar el componente `Category` si se vuelve demasiado grande o complejo.
- **No eliminar el componente `CategoryChip` (`src/app/guia/[slug]/CategoryChip.tsx`)**. Este componente debe conservarse y puede reutilizarse donde sea útil para mostrar la categoría visualmente.

### 4. Renderizar cada lugar usando el componente `Place`

- Para cada lugar, renderizar el componente `Place` pasando los props requeridos:
  - `place`: nombre del lugar
  - `color`: color de la categoría
  - `area`: área de la ciudad
  - `mapLink`, `link`, `capsuleLink`: links correspondientes
  - Mostrar la categoría usando el componente `Category`.

### 5. Agregar filtro obligatorio por categoría

- Implementar el componente obligatorio `GuideCategorySelect` en `src/app/guia/GuideCategorySelect.tsx` para filtrar los lugares por categoría.
- Usar `nuqs` para manejar el estado de los filtros en la URL.

### 6. Diseño y responsividad

- Asegurarse de que la grilla de lugares sea responsiva y siga la estética de la app.
- Usar Tailwind para el layout y los estilos, siguiendo el ejemplo de agenda.

### 7. Optimización y buenas prácticas

- Usar Server Components para la obtención de datos.
- Minimizar el uso de `"use client"` y hooks en la lógica principal.
- Mantener la estructura y convenciones del proyecto (nombres, imports, modularidad).

### 8. Pruebas y validación

- Probar la nueva página `/guia` para asegurarse de que todos los lugares aparecen correctamente, sin importar la categoría.
- Verificar que los links y props de cada tarjeta funcionen como se espera.
- Validar que la página anterior de categorías sigue accesible si se requiere.

---

¿Quieres que agregue algún paso más o detalle técnico antes de proceder?
