# Documentación: INDAGA - Sitio web público

---

## 📋 Resumen Ejecutivo

INDAGA es una plataforma digital de un colectivo dedicado a buscar y difundir lugares culturales relevantes en Monterrey, México. Este PRD cubre **exclusivamente la experiencia pública** del sitio web, que incluye contenido editorial, navegación e información general.

> **⚠️ Nota Importante**: Este documento NO incluye funcionalidades de usuarios registrados, autenticación, treasure hunt, dashboards ni panel de administración. Para esas características, consultar **`INDAGA_USERS.md`**.

---

## 🎯 Objetivos del Producto

### Objetivo Principal

Crear una plataforma web informativa que permita a visitantes descubrir y explorar la oferta cultural de Monterrey a través de contenido curado de alta calidad.

### Objetivos Específicos

1. **Descubrimiento Cultural**: Facilitar la exploración de eventos, rutas y lugares culturales
2. **Información Accesible**: Presentar contenido organizado y fácil de navegar
3. **Promoción Cultural**: Aumentar la visibilidad de espacios y eventos culturales locales
4. **Engagement Inicial**: Generar interés para motivar el registro de usuarios (ver INDAGA_USERS.md)

---

## 👥 Usuarios Objetivo

### Perfil Principal: Exploradores Culturales de Monterrey

- **Demográficos**: 25-45 años, nivel socioeconómico medio-alto
- **Intereses**: Arte, cultura, gastronomía, eventos locales
- **Comportamiento**: Buscan experiencias auténticas y recomendaciones confiables
- **Tecnología**: Cómodos navegando en web y móvil

### Perfiles Secundarios

- **Turistas**: Visitantes buscando experiencias culturales locales
- **Locales Casuales**: Residentes que ocasionalmente buscan actividades
- **Organizadores**: Venues y organizadores evaluando la plataforma

---

## 🏗️ Arquitectura de Contenido

### Sistema de Gestión: Prismic CMS

Todo el contenido público se gestiona a través de **Prismic**, garantizando:

- Edición fácil sin conocimientos técnicos
- Contenido estructurado y consistente
- Optimización SEO automática
- Gestión de medios centralizada

---

## 📄 Especificación de Páginas

### 🏠 **Home (`/`)**

**Propósito**: Landing principal que orienta a los visitantes hacia las secciones principales

**Contenido**:

- Hero section con propuesta de valor del colectivo
- Navegación clara hacia las 4 secciones principales
- Preview destacado de contenido reciente
- Call-to-action para registro / inicio de sesión (vincula con INDAGA_USERS.md)

**Elementos Clave**:

- Diseño visual atractivo que refleje la identidad cultural
- Navegación intuitiva hacia agenda, rutas, guía y blog
- Optimización mobile-first

---

### 📅 **Agenda (`/agenda`)**

**Propósito**: Directorio de eventos culturales en Monterrey

**Funcionalidades**:

- Lista de eventos con información básica
- Filtros por fecha, categoría y ubicación
- Vista de calendario mensual
- Búsqueda por palabras clave

**Páginas Individuales** (`/agenda/[evento]`):

- Información detallada del evento
- Detalles de ubicación y horarios
- Galería de imágenes
- Información de contacto/tickets
- Botón "Guardar Evento" (requiere login - ver INDAGA_USERS.md)

---

### 🗺️ **Rutas (`/rutas`)**

**Propósito**: Itinerarios culturales curados por el colectivo

**Funcionalidades**:

- Catálogo de rutas temáticas

**Páginas Individuales** (`/rutas/[ruta]`):

- Descripción completa del itinerario
- Mapa detallado con puntos de interés
- Botón "Guardar Ruta" (requiere login - ver INDAGA_USERS.md)

---

### 🏛️ **Guía (`/guia`)**

**Propósito**: Directorio de lugares culturales recomendados

**Funcionalidades**:

- Lista de lugares con información esencial
- Categorización (museos, galerías, espacios culturales, etc.)
- Filtros por zona, tipo

**Contenido por Lugar**:

- Información básica (ubicación, web o red social)
- Descripción editorial
- Botón "Guardar Lugar" (requiere login - ver INDAGA_USERS.md)

---

### 📝 **Blog (`/blog`)**

**Propósito**: Contenido editorial y artículos del colectivo

**Funcionalidades**:

- Índice de artículos con preview
- Categorización por temas

**Artículos Individuales** (`/blog/[articulo]`):

- Contenido largo-forma con rich media
- Autor y fecha de publicación
- Relacionados/recomendados

---

### 👋 **Nosotros (`/nosotros`)**

**Propósito**: Información sobre el colectivo INDAGA

**Contenido**:

- Descripción del colectivo

---

## 🔗 Navegación y UX

### Estructura de Navegación

```
Header Navigation:
├── Logo INDAGA (← Home)
├── Agenda
├── Rutas
├── Guía
├── Blog
├── Nosotros
└── Iniciar Sesión (→ INDAGA_USERS.md)

Footer:
├── Redes sociales
└── Contacto
```

---

---

## 🔧 Especificaciones Técnicas

### Stack Tecnológico

- **Framework**: Next.js 14+ con App Router
- **CMS**: Prismic para gestión de contenido
- **Styling**: Tailwind CSS
- **Hosting**: Vercel
- **Analytics**: Google Analytics 4

### Integraciones Requeridas

- **Prismic API**: Para contenido dinámico
- **Google Maps**: Para ubicaciones y rutas
- **WhatsApp API**: Para compartir contenido

---

## 🔄 Integración con INDAGA_USERS.md

### Puntos de Conexión

- **CTAs de Registro**: En múltiples puntos estratégicos
- **Indicadores de Treasure Hunt**: Lugares participantes señalizados
- **Funcionalidades Premium**: "Guardar" requiere cuenta de usuario
- **Content Gating**: Tu dashboard y el treasure hunt solo para usuarios registrados

### Experiencia Unificada

El sitio público sirve como embudo para las funcionalidades de usuario registrado, manteniendo una experiencia fluida entre ambas áreas de la plataforma.

---

**Documento creado**: Julio 2025  
**Documento complementario**: `INDAGA_USERS.md` (funcionalidades de usuarios registrados, autenticación, treasure hunt y administración)
