# TODO: Migración de Supabase a Vercel Marketplace DB

## 📋 Análisis de la Situación Actual

### 🗄️ Base de Datos Actual (Supabase Externo)
- **Host**: [Ver .env para credenciales]
- **Proyecto**: `indaga`
- **Estado**: Funcional con treasure hunt activo

### 📊 Datos Críticos a Preservar

#### ✅ Treasure Hunt Festival Santa Lucía 2025
- **25 tesoros** con códigos descriptivos (CENTRO-HISTORICO, PARQUE-FUNDIDORA, etc.)
- **Fechas**: Diciembre 1-31, 2025
- **Estado**: Activo
- **Imágenes**: 25+ archivos en `/public/treasure-hunt/img/`

#### 👥 Usuarios y Autenticación
- **Sistema**: BetterAuth + Magic Links
- **Admins**: `fobos.salmeron@gmail.com`, `fmagse@gmail.com`
- **Tablas**: users, session, account, verification

#### 💾 Datos de Usuario
- Eventos guardados (saved_events)
- Lugares guardados (saved_places)
- Progreso de treasure hunt (treasure_hunt_2025_scans, treasure_hunt_2025_progress)

## 🚀 Plan de Migración

### 1. ⚙️ Setup de Nueva DB en Vercel Marketplace
- [ ] **Crear nueva instancia de PostgreSQL** en Vercel Marketplace
- [ ] **Obtener credenciales** de conexión
- [ ] **Actualizar variables de entorno** en `.env` y Vercel con nuevas credenciales

### 2. 📁 Preparación de Schema
- [ ] **Ejecutar migraciones** en orden en la nueva DB:
  1. `001_initial_schema.sql`
  2. `002_treasure_hunt_2025.sql` 
  3. `003_rls_policies.sql`
  4. `004_better_auth_tables.sql`
  5. `005_descriptive_treasure_codes.sql`

### 3. 📤 Exportación de Datos Críticos
- [ ] **Exportar usuarios activos**:
  ```sql
  SELECT * FROM users WHERE email_verified = true;
  ```
- [ ] **Exportar scans de treasure hunt**:
  ```sql
  SELECT * FROM treasure_hunt_2025_scans;
  ```
- [ ] **Exportar progreso de usuarios**:
  ```sql
  SELECT * FROM treasure_hunt_2025_progress;
  ```
- [ ] **Exportar items guardados**:
  ```sql
  SELECT * FROM saved_events;
  SELECT * FROM saved_places;
  ```
- [ ] **Exportar sesiones activas** (si son recientes):
  ```sql
  SELECT * FROM session WHERE expiresAt > NOW();
  ```

### 4. 📥 Importación de Datos
- [ ] **Importar en orden**:
  1. users (preservar IDs)
  2. treasure_hunt_2025_scans
  3. treasure_hunt_2025_progress  
  4. saved_events
  5. saved_places
  6. session (opcional)

### 5. 🎯 QRs Adicionales Requeridos
- [ ] **Agregar QR para testing**:
  - `CENTRO-HISTORICO` - Ya existe ✅
  - **Crear nuevo QR para seeds** con código descriptivo

#### Código para nuevo QR en seeds:
```sql
INSERT INTO treasure_hunt_2025_treasures (
  hunt_id, 
  treasure_code, 
  treasure_name, 
  treasure_description,
  location_coordinates
) VALUES (
  1,
  'SEED-TEST-01',
  'Treasure de Testing',
  'QR especial para testing y seeds del sistema',
  '25.6866,-100.3161'
);
```

### 6. 🔧 Actualización de Configuración
- [ ] **Actualizar `supabase/config.toml`** con nueva conexión
- [ ] **Verificar archivos de conexión**:
  - `src/lib/supabase.ts`
  - `test-connection.js`
  - `test-db.js`
- [ ] **Actualizar variables en Vercel**
- [ ] **Probar autenticación** con BetterAuth

### 7. ✅ Testing Post-Migración
- [ ] **Funcionalidad de Login**:
  - Magic link desde `/login`
  - Login via QR: `https://www.indaga.site/login?scanned=CENTRO-HISTORICO`
  
- [ ] **Escaneo de QRs**:
  - URL: `https://www.indaga.site/2025/t/CENTRO-HISTORICO`
  - Verificar que guarda el tesoro
  - Verificar actualización de progreso

- [ ] **Dashboard de usuario**:
  - Mostrar tesoros colectados
  - Mostrar progreso general
  - Items guardados

- [ ] **Panel de Admin**:
  - Estadísticas de usuarios
  - Gestión de treasure hunt
  - Métricas de scans

### 8. 🔒 Verificación de Seguridad
- [ ] **RLS Policies** funcionando correctamente
- [ ] **Roles de admin** preservados
- [ ] **Datos de usuario** aislados correctamente

## 📝 URLs de Testing Críticas

### QR Existente para Testing
- **URL**: `https://www.indaga.site/login?scanned=CENTRO-HISTORICO`
- **Código**: `CENTRO-HISTORICO`
- **Descripción**: Centro Histórico

### Nuevos QRs Necesarios para Testing
- **Para Seeds**: `SEED-TEST-01` o similar
- **URL**: `https://www.indaga.site/login?scanned=SEED-TEST-01`

## ⚠️ Consideraciones Importantes

### 🔄 Durante la Migración
- **Downtime mínimo**: Coordinar horario de menor actividad
- **Backup completo**: Antes de cualquier cambio
- **Rollback plan**: Mantener acceso a DB actual

### 🎮 Treasure Hunt Activo
- **No interrumpir**: Festival Santa Lucía 2025 está activo hasta 31 dic
- **Preservar progreso**: Usuarios pueden tener avances significativos
- **QRs físicos**: Pueden estar impresos en ubicaciones

### 🔐 Autenticación
- **Sesiones activas**: Pueden perderse (usuarios tendrán que re-login)
- **Magic links**: Verificar que Resend siga funcionando
- **Admin access**: Crítico mantener acceso a admins

## 📊 Métricas a Monitorear Post-Migración
- [ ] Usuarios activos pueden hacer login
- [ ] QRs escaneables desde cámaras nativas
- [ ] Progreso de treasure hunt se actualiza
- [ ] Panel de admin accesible
- [ ] Items guardados visibles en dashboard

---

**Documento creado**: Julio 18, 2025  
**Objetivo**: Migrar de Supabase externo a Vercel Marketplace DB preservando treasure hunt activo y datos de usuarios