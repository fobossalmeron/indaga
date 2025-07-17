# Plan de Registro de Usuarios - INDAGA

## Objetivo

Implementar un sistema de registro y autenticación de usuarios utilizando BetterAuth para permitir que los usuarios se registren, inicien sesión y accedan a funcionalidades personalizadas.

## Tecnología Propuesta

- **BetterAuth**: Librería de autenticación moderna para Next.js

## Especificaciones Funcionales

### Métodos de Autenticación

- **Magic Links** (sin contraseña)

### Información de Usuario

- Email (obligatorio)
- Verificación de email requerida

### Funcionalidades de Usuario

- Guardar eventos de la agenda en su perfil
- Guardar lugares favoritos de la guía en su perfil
- **Treasure Hunt**: Escanear códigos QR por la ciudad que llevarán a registrarse/login. Los usuarios verán en su dashboard los "tesoros recolectados" como un juego de exploración urbana.

### UI/UX

- Páginas dedicadas: `/login`, `/register`
- Dashboard personal: `/dashboard`
- Panel de administración: `/admin`

### Gestión de Usuarios (Admin)

- Tabla de usuarios con: nombre, correo, lugares guardados, eventos guardados, tesoros recolectados por hunt
- Dashboard de estadísticas básicas

---

## Notas

- BetterAuth se integra bien con Next.js App Router
- Soporta múltiples providers de OAuth
- Tiene buena documentación y TypeScript support
- Permite customización de UI
- Tenemos instalado el MCP de supabase

---

## PLAN DETALLADO DE IMPLEMENTACIÓN

### Estructuras de Base de Datos (Supabase)

#### Tabla: `users`

```sql
- id (uuid, primary key)
- email (text, unique, not null)
- full_name (text, not null)
- created_at (timestamp)
- updated_at (timestamp)
- email_verified (boolean, default false)
- avatar_url (text, nullable)
- provider (text) -- 'magic-link' (OAuth en fase 2)
```

#### Tabla: `saved_events`

```sql
- id (uuid, primary key)
- user_id (uuid, foreign key -> users.id)
- event_id (text) -- ID del evento de la agenda
- event_title (text)
- event_date (timestamp)
- saved_at (timestamp)
```

#### Tabla: `saved_places`

```sql
- id (uuid, primary key)
- user_id (uuid, foreign key -> users.id)
- place_id (text) -- ID del lugar de la guía
- place_name (text)
- place_category (text)
- saved_at (timestamp)
```

#### Tabla: `treasure_hunts`

```sql
- id (uuid, primary key)
- name (text) -- "Festival Santa Lucía 2025"
- year (integer) -- 2025, 2026, etc.
- description (text)
- start_date (timestamp)
- end_date (timestamp)
- is_active (boolean, default true)
- total_treasures (integer)
- created_at (timestamp)
```

#### Tabla: `treasure_hunt_2025_treasures`

```sql
- id (uuid, primary key)
- hunt_id (uuid, foreign key -> treasure_hunts.id)
- treasure_code (text, unique) -- código único del QR
- treasure_name (text) -- nombre del lugar/tesoro
- treasure_description (text)
- location_coordinates (point, nullable)
- created_at (timestamp)
```

#### Tabla: `treasure_hunt_2025_scans`

```sql
- id (uuid, primary key)
- user_id (uuid, foreign key -> users.id)
- hunt_id (uuid, foreign key -> treasure_hunts.id)
- treasure_id (uuid, foreign key -> treasure_hunt_2025_treasures.id)
- scanned_at (timestamp)
```

#### Tabla: `treasure_hunt_2025_progress`

```sql
- id (uuid, primary key)
- user_id (uuid, foreign key -> users.id)
- hunt_id (uuid, foreign key -> treasure_hunts.id)
- treasures_found (integer, default 0)
- completion_percentage (decimal)
- started_at (timestamp)
- completed_at (timestamp, nullable)
```

### División de Tareas por Agentes Claude Code

#### 🤖 **AGENTE INICIAL: SETUP & FOUNDATIONS**

**Responsabilidades (Sequential):**

- Configurar proyecto Supabase
- Crear y ejecutar migrations para todas las tablas
- Configurar Row Level Security (RLS) policies
- Instalar y configurar BetterAuth (solo Magic Links)
- Setup de variables de entorno y conexión Supabase en Next.js

**Archivos a crear:**

- `supabase/migrations/001_initial_schema.sql` (users, saved_events, saved_places, treasure_hunts)
- `supabase/migrations/002_treasure_hunt_2025.sql` (treasures, scans, progress para 2025)
- `supabase/migrations/003_rls_policies.sql`
- `.env.local` (template)
- `src/lib/supabase.ts`
- `src/lib/auth.ts` (configuración BetterAuth)
- `src/app/api/auth/[...better-auth]/route.ts`
- `middleware.ts`
- `types/database.ts`
- `types/auth.ts`
- `types/treasure-hunt.ts`

---

#### 🤖 **AGENTE A: AUTH UI & ROUTING** (Paralelo después del inicial)

**Responsabilidades:**

- Crear páginas de login/register
- Desarrollar componentes de autenticación
- Implementar navegación y routing protegido
- Crear layout del dashboard de usuario

**Archivos a crear:**

- `src/app/(auth)/login/page.tsx`
- `src/app/(auth)/register/page.tsx`
- `src/app/(protected)/dashboard/page.tsx`
- `src/app/components/auth/login-form.tsx`
- `src/app/components/auth/register-form.tsx`
- `src/app/components/auth/magic-link-form.tsx`
- `src/app/components/layout/protected-layout.tsx`
- `src/hooks/use-auth.ts`

#### 🤖 **AGENTE B: USER FEATURES** (Paralelo después del inicial)

**Responsabilidades:**

- Implementar sistema de QR scanning
- Crear funcionalidad de guardar eventos/lugares
- Desarrollar lógica del treasure hunt
- Crear componentes de progreso y achievements

**Archivos a crear:**

- `src/app/(protected)/qr-scanner/page.tsx`
- `src/app/(protected)/treasures/page.tsx`
- `src/app/(protected)/saved-items/page.tsx`
- `src/app/components/features/qr-scanner.tsx`
- `src/app/components/features/treasure-map.tsx`
- `src/app/components/features/progress-tracker.tsx`
- `src/lib/treasure-hunt-2025.ts`
- `src/lib/user-actions.ts`

#### 🤖 **AGENTE C: ADMIN PANEL** (Paralelo después del inicial)

**Responsabilidades:**

- Crear panel de administración
- Implementar tabla de usuarios con filtros
- Crear dashboard de estadísticas
- Implementar gestión de treasure hunts

**Archivos a crear:**

- `src/app/(admin)/admin/page.tsx`
- `src/app/(admin)/admin/users/page.tsx`
- `src/app/(admin)/admin/treasures/page.tsx`
- `src/app/components/admin/users-table.tsx`
- `src/app/components/admin/stats-dashboard.tsx`
- `src/app/components/admin/treasure-manager.tsx`
- `src/lib/admin-actions.ts`

### Cronograma de Implementación

#### **FASE 1: SETUP INICIAL (Agente Único)**

**Duración estimada: 1-2 días**

**Agente Inicial:**

1. Configurar proyecto Supabase
2. Crear schemas base (users, saved\_\*, treasure_hunts)
3. Crear tablas treasure hunt 2025 específicas
4. Configurar RLS policies para todas las tablas
5. Instalar y configurar BetterAuth (solo Magic Links)
6. Setup conexión Supabase + middleware

#### **FASE 2: DESARROLLO PARALELO (Agentes A, B, C)**

**Duración estimada: 3-4 días**

**Agente A - Auth UI:**

1. Páginas login/register
2. Componentes de autenticación
3. Dashboard layout
4. Routing protegido

**Agente B - Features:**

1. QR scanner
2. Sistema treasures
3. Save functionality
4. Gamificación

**Agente C - Admin:**

1. Panel administración
2. Tabla usuarios
3. Estadísticas

#### **FASE 3: INTEGRATION & TESTING**

**Duración estimada: 1 día**

1. Integrar componentes
2. Testing end-to-end
3. Deploy a Vercel

### Dependencias Entre Agentes

```
Agente Inicial (Setup) → [Agente A (Auth UI), Agente B (Features), Agente C (Admin)]
                                           ↓
                                   Integration & Testing
```

### Consideraciones Técnicas

#### **Configuración Inicial Compartida:**

- Next.js 14+ con App Router
- TypeScript estricto
- Tailwind CSS para styling
- Shadcn/ui para componentes base
- Supabase como backend
- BetterAuth para autenticación
- Vercel para deployment

#### **Variables de Entorno Necesarias (Fase 1):**

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
BETTER_AUTH_SECRET=
# OAuth providers para Fase 2:
# GOOGLE_CLIENT_ID=
# GOOGLE_CLIENT_SECRET=
```

#### **Packages a Instalar:**

```json
{
  "dependencies": {
    "better-auth": "^latest",
    "@supabase/supabase-js": "^latest",
    "qr-scanner": "^latest",
    "@zxing/library": "^latest",
    "react-qr-scanner": "^latest"
  }
}
```

### Puntos de Sincronización

1. **Checkpoint 1:** Agente Inicial completa setup completo
2. **Checkpoint 2:** Agentes A, B, C completan desarrollo paralelo
3. **Checkpoint Final:** Integración y testing completo

### Métricas de Éxito

- ✅ Usuarios pueden registrarse con Magic Links
- ✅ Sistema de QR treasure hunt funcional
- ✅ Dashboard de usuario con saves y progress
- ✅ Panel de admin con gestión de usuarios
- ✅ Deploy exitoso en Vercel
- ✅ Verificación de email funcional
- ✅ RLS policies trabajando correctamente

---

## Próximos Pasos Inmediatos

1. ✅ Plan detallado creado
2. 🔄 Iniciar con Agente Inicial para setup completo
3. ⏳ Una vez completo el setup, lanzar Agentes A, B, C en paralelo
4. ⏳ Integración final y testing
5. ⏳ Deploy a Vercel
