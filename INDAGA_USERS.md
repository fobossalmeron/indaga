# Documentación: INDAGA - Sistema de Usuarios y Treasure Hunt

---

## 📋 Resumen Ejecutivo

Este PRD define el sistema completo de usuarios registrados de INDAGA, incluyendo autenticación, dashboards, treasure hunt urbano y panel de administración. Estas funcionalidades transforman la experiencia estática del sitio público en una plataforma interactiva gamificada.

> **⚠️ Nota Importante**: Este documento NO incluye el sitio web público (home, agenda, rutas, guía, archivo, nosotros). Para esas funcionalidades, consultar **`INDAGA_PUBLIC.md`**.

---

## 🎯 Objetivos del Producto

### Objetivo Principal

Crear un ecosistema gamificado que incentive la exploración cultural de Monterrey mediante treasure hunts urbanos, permitiendo a usuarios coleccionar "tesoros" digitales al visitar lugares participantes y gestionar sus lugares, eventos y rutas favoritas.

### Objetivos Específicos

1. **Gamificación Cultural**: Convertir la exploración urbana en juegos de colección
2. **Engagement Profundo**: Crear conexión emocional con espacios culturales
3. **Gestión de Favoritos**: Permitir guardar y organizar lugares, eventos y rutas de interés
4. **Experiencias Especiales**: Facilitar acceso a ofertas y experiencias únicas en lugares participantes
5. **Gestión Eficiente**: Proveer herramientas admin para manejo del sistema

---

## 👥 Usuarios Objetivo

### Usuario Registrado: Explorador Cultural Activo

- **Motivaciones**: Gamificación, descuentos, personalización
- **Comportamiento**: Visita regular de espacios culturales, comparte experiencias
- **Tecnología**: Cómodo con apps móviles, escaneado QR
- **Frecuencia**: Actividad semanal en la plataforma

### Administrador: Gestor del Colectivo

- **Responsabilidades**: Curaduría de contenido, gestión de usuarios, análisis
- **Objetivos**: Engagement alto, crecimiento de la comunidad
- **Herramientas**: Dashboard analytics, gestión de treasure hunts
- **Usuarios Admin**: fobos.salmeron@gmail.com, fmagse@gmail.com

---

## 🔐 Sistema de Autenticación

### Tecnología: Better Auth + Supabase

**Método Principal**: Magic Links (sin contraseña)

- Simplifica el proceso de registro
- Reduce fricción de acceso
- Elimina problemas de contraseñas olvidadas

### Flujo de Usuario

1. **Registro Libre**: Email → Magic link → Verificación automática
2. **Registro via QR**: Escaneo QR → Prompt de registro → Magic link → Guardado del tesoro
3. **Onboarding**: Bienvenida + explicación de treasure hunts y funcionalidades
4. **Activación**: Cuenta activa desde verificación de email

### Casos de Uso de Autenticación

- Acceso desde sitio público (CTAs en INDAGA_PUBLIC.md)
- Login directo desde QR codes en ubicaciones físicas

---

## 🎮 Sistema de Treasure Hunt

### Concepto Core

Los usuarios escanean códigos QR ubicados en espacios culturales participantes de Monterrey. Cada scan exitoso:

- Registra el "tesoro" en su colección personal
- Desbloquea información exclusiva del lugar
- Otorga acceso a experiencias especiales del lugar
- Contribuye a su progreso en treasure hunts activos

### Mecánicas de Juego

#### Colección de Tesoros

- **QR Único por Ubicación**: Cada lugar tiene un código único e intransferible
- **Persistencia**: Los tesoros se mantienen entre treasure hunts/temporadas
- **Colección**: Escaneos repetidos no generan tesoros duplicados

#### Progreso y Achievement

- **Porcentaje de Completitud**: Basado en tesoros totales disponibles
- **Badges**: Logros especiales por hitos o combinaciones
- **Leaderboards**: Rankings amigables (opcional, configurable)

#### Recompensas

- **Experiencias Inmediatas**: Al escanear, acceso a experiencia especial del lugar (bebidas especiales, descuentos, etc.)
- **Rewards Acumulativos**: Beneficios por completar sets o categorías
- **Contenido Exclusivo**: Información privilegiada, historias, entrevistas
- **Experiencias Premium**: Acceso a eventos especiales o tours privados

---

## 📱 Especificación de Funcionalidades

### 🔍 **Sistema QR con URLs Públicas**

**Funcionalidad Core**: QR codes que funcionan con cualquier cámara nativa del teléfono

**Características**:

- URLs públicas escaneables con cualquier app de cámara
- Códigos descriptivos fáciles de recordar (ej: CAFE-LIMON, PARQUE-FUNDIDORA)
- Onboarding fluido desde el primer escaneo sin necesidad de abrir la app primero
- Detección automática de estado de autenticación

**Flujo**:

1. Usuario escanea QR → Abre `https://www.indaga.site/2025/t/CODIGO-DESCRIPTIVO`
2. Sistema detecta si usuario está autenticado
3. **Si NO está logueado**: Redirect a `/login?scanned=CODIGO` con mensaje de promoción
4. **Si SÍ está logueado**: Procesa tesoro inmediatamente
5. Redirect a dashboard con progreso actualizado y notificación de éxito

---

### 🏆 **Dashboard de Usuario (`/dashboard`)**

**Propósito**: Hub personal del usuario con overview de progreso y accesos rápidos

**Secciones**:

#### Panel de Progreso

- Progreso general del treasure hunt activo
- Últimos tesoros colectados
- Próximos lugares sugeridos
- Stats personales (total scans, días activos, etc.)

#### Mi Colección

- Vista de galería de tesoros colectados
- Filtros por categoría, fecha, ubicación
- Detalles de cada tesoro (fecha, lugar, recompensa obtenida)

#### Accesos Rápidos

- Mis lugares/favoritos (eventos guardados)
- Recompensas disponibles
- Configuración de perfil

---

### 🎯 **Gestión de Tesoros (`/treasures`)**

**Propósito**: Vista detallada de la colección y progreso del usuario

**Funcionalidades**:

- **Vista de Mapa**: Tesoros colectados vs. disponibles
- **Lista Detallada**: Información completa de cada tesoro
- **Filtros y Búsqueda**: Por ubicación, fecha, categoría
- **Sharing**: Compartir logros en redes sociales
- **Estadísticas**: Análisis personal de actividad

---

### 💾 **Elementos Guardados (`/saved-items`)**

**Propósito**: Gestión de eventos y lugares guardados desde el sitio público

**Funcionalidades**:

- Lista unificada de eventos y lugares guardados
- Organización por categorías o etiquetas personalizadas
- Notificaciones de eventos próximos
- Exportar a calendario personal
- Recomendaciones basadas en guardados

---

## 🛡️ **Panel de Administración**

### Acceso y Permisos

- **Usuarios Admin**: Definidos en base de datos (role = 'admin')
- **Autenticación**: Mismo sistema que usuarios regulares
- **Rutas Protegidas**: Middleware de verificación de rol

---

### 📊 **Dashboard Admin (`/admin`)**

**Propósito**: Overview general del sistema y métricas clave

**Widgets**:

- Total usuarios registrados y activos
- Scans totales del día/semana/mes
- Treasure hunt progress general
- Lugares más populares
- Alertas del sistema

---

### 👥 **Gestión de Usuarios (`/admin/users`)**

**Propósito**: Administración completa de la base de usuarios

**Funcionalidades**:

- **Tabla de Usuarios**: Email, nombre, fecha registro, último login
- **Filtros Avanzados**: Por actividad, progreso, fecha registro
- **Vista Detallada**: Progreso individual, tesoros colectados, items guardados
- **Acciones**: Suspender, reactivar, enviar comunicaciones
- **Exportación**: Data de usuarios para análisis

---

### 🏛️ **Gestión de Treasure Hunts (`/admin/treasures`)**

**Propósito**: Configuración y monitoreo del sistema de treasure hunt

**Funcionalidades**:

#### Configuración de Hunts

- Crear/editar treasure hunts (temporadas)
- Definir fechas de inicio/fin
- Establecer objetivos y mecánicas
- Configurar recompensas por hitos

#### Gestión de Tesoros

- **CRUD de Ubicaciones**: Agregar/editar lugares participantes
- **Generación de QR**: Crear códigos únicos por ubicación
- **Configuración de Recompensas**: Definir ofertas por lugar
- **Geofencing**: Establecer perímetros de validación

#### Monitoreo y Analytics

- Mapa de calor de actividad
- Tesoros más/menos populares
- Análisis temporal de scans
- Detección de anomalías o fraudes

---

## 🗃️ Arquitectura de Datos

### Base de Datos: Supabase PostgreSQL

#### Tablas Core

```sql
users: id, email, full_name, created_at, updated_at, email_verified, avatar_url, provider, role
saved_events: id, user_id, event_id, event_title, event_date, saved_at
saved_places: id, user_id, place_id, place_name, place_category, saved_at
```

#### Tablas de Treasure Hunt

```sql
treasure_hunts: id, name, year, description, start_date, end_date, is_active, total_treasures, created_at
treasure_hunt_2025_treasures: id, hunt_id, treasure_code, treasure_name, treasure_secret, treasure_location_maps_url, location_coordinates, created_at
treasure_hunt_2025_scans: id, user_id, hunt_id, treasure_id, scanned_at
treasure_hunt_2025_progress: id, user_id, hunt_id, treasures_found, completion_percentage, started_at, completed_at
```

#### Tablas de Autenticación (Better Auth)

```sql
session: id, expiresAt, token, createdAt, updatedAt, ipAddress, userAgent, userId
account: id, accountId, providerId, userId, accessToken, refreshToken, idToken, ...
verification: id, identifier, value, expiresAt, createdAt, updatedAt
```

### Políticas de Seguridad (RLS)

- Usuarios solo acceden a sus propios datos
- Admins tienen acceso completo de lectura
- Datos de treasure hunts públicos para lectura
- Scans y progreso privados por usuario

---

## 🔧 Especificaciones Técnicas

### Stack Tecnológico

- **Framework**: Next.js 14+ con App Router
- **Autenticación**: Better Auth
- **Base de Datos**: Supabase (PostgreSQL)
- **UI**: Tailwind CSS + Shadcn/ui
- **Notifications**: Web Push API + Email (Resend)

### APIs y Servicios

- **Supabase**: Database, real-time subscriptions, RLS
- **Resend**: Email delivery (magic links, notificaciones)
- **Google Maps**: Geolocalización y validación

---

## 🔄 Integración con INDAGA_PUBLIC.md

### Puntos de Conexión

- **Registro desde Sitio Público**: CTAs estratégicos en todas las páginas
- **Deep Linking**: URLs directas desde contenido público a funciones de usuario
- **Content Enhancement**: Información adicional para usuarios registrados
- **QR Integration**: Códigos en páginas de lugares participantes

---
