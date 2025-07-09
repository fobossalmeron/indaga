# Plan de Refactorización para el Filtro de Agenda

## 1. Contexto y Problema

La implementación actual del filtro de categorías en `/agenda` funciona correctamente, pero introduce una "frontera cliente" (`'use client'`) en el archivo `src/app/agenda/layout.tsx`. Esto es necesario para que el `NuqsAdapter` (el provider de `nuqs`) funcione.

El problema es que, al convertir el layout en un Client Component, todos sus componentes hijos (incluyendo `page.tsx`) también se convierten en Client Components. Esto va en contra de las mejores prácticas de Next.js y del App Router, ya que perdemos los beneficios de rendimiento de los Server Components (RSC) para toda la sección de la agenda. El fetching de datos en `page.tsx` se ve afectado, y el bundle de JavaScript que se envía al cliente es más grande de lo necesario.

## 2. Objetivo de la Refactorización

El objetivo es refactorizar la implementación para aislar la lógica de cliente, permitiendo que el layout y la página de la agenda (`/agenda`) sigan siendo Server Components, mientras que el `NuqsAdapter` sigue funcionando correctamente. Esto se logrará aplicando el patrón de composición recomendado por Next.js.

## 3. Plan de Acción

### Paso 1: Crear un Provider de Cliente (`AgendaClientProvider`)

1.  **Crear un nuevo archivo:** `src/app/agenda/AgendaClientProvider.tsx`.
2.  **Definir el componente:**

    - Añadir la directiva `'use client'` al inicio del archivo.
    - Importar `NuqsAdapter` desde `nuqs/adapters/next/app`.
    - Crear y exportar un componente funcional `AgendaClientProvider` que acepte `children` como prop.
    - El componente debe devolver `<NuqsAdapter>{children}</NuqsAdapter>`.

    Este componente será nuestro único punto de entrada de cliente para esta funcionalidad, manteniéndolo aislado.

### Paso 2: Refactorizar el Layout de la Agenda

1.  **Abrir el archivo:** `src/app/agenda/layout.tsx`.
2.  **Convertirlo de nuevo en un Server Component:**
    - Eliminar la directiva `'use client'`.
    - Eliminar la importación de `NuqsAdapter`.
3.  **Integrar el nuevo provider:**
    - Importar el componente `AgendaClientProvider` que creamos en el paso anterior.
    - En el `return` del componente `HappeningsLayout`, envolver el contenido existente con `<AgendaClientProvider>`.

### Paso 3: Verificación Final

1.  **Probar la funcionalidad:** Navegar a `/agenda` y verificar que el filtro de categorías sigue funcionando exactamente como antes (filtrado, sincronización con la URL, etc.).
2.  **Confirmar la arquitectura:** Asegurarse de que no haya errores y que la página se cargue correctamente. La refactorización no debería cambiar el comportamiento visible para el usuario, solo optimizar la arquitectura subyacente.
3.  **Limpieza:** Eliminar cualquier importación o código innecesario que pueda haber quedado.

---

**Nota:** Esta refactorización es puramente técnica y de optimización. No introduce nuevas funcionalidades, pero alinea el código con las mejores prácticas del App Router de Next.js, mejorando el rendimiento y la mantenibilidad.
