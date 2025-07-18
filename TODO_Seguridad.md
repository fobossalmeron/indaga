# TODO: Restaurar Seguridad RLS en Tablas del Treasure Hunt

## 🚨 PROBLEMA
Durante el desarrollo del treasure hunt, se deshabilitó temporalmente RLS (Row Level Security) en varias tablas para resolver errores de permisos. **Esto es un riesgo de seguridad en producción**.

## 📊 Estado Actual de RLS

### ❌ DESHABILITADO (RIESGO DE SEGURIDAD)
- `treasure_hunts` - Información de treasure hunts
- `treasure_hunt_2025_treasures` - Datos de tesoros
- `treasure_hunt_2025_scans` - Escaneos de usuarios  
- `treasure_hunt_2025_progress` - Progreso de usuarios

### ✅ HABILITADO (CORRECTO)
- `users` - Datos de usuarios
- `saved_events` - Eventos guardados
- `saved_places` - Lugares guardados

## 🛠️ SOLUCIÓN REQUERIDA

### 1. Re-habilitar RLS
```sql
-- Habilitar RLS en todas las tablas del treasure hunt
ALTER TABLE treasure_hunts ENABLE ROW LEVEL SECURITY;
ALTER TABLE treasure_hunt_2025_treasures ENABLE ROW LEVEL SECURITY;
ALTER TABLE treasure_hunt_2025_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE treasure_hunt_2025_progress ENABLE ROW LEVEL SECURITY;
```

### 2. Crear Políticas de Seguridad Correctas

#### treasure_hunts (Público para lectura)
```sql
-- Todos pueden ver treasure hunts activos
CREATE POLICY "Anyone can view active treasure hunts" ON treasure_hunts
FOR SELECT TO public
USING (is_active = true);

-- Solo admins pueden modificar
CREATE POLICY "Admins can manage treasure hunts" ON treasure_hunts
FOR ALL TO public
USING (is_admin());
```

#### treasure_hunt_2025_treasures (Público para lectura)
```sql
-- Todos pueden ver tesoros de hunts activos
CREATE POLICY "Anyone can view treasures from active hunts" ON treasure_hunt_2025_treasures
FOR SELECT TO public
USING (
  EXISTS (
    SELECT 1 FROM treasure_hunts 
    WHERE treasure_hunts.id = treasure_hunt_2025_treasures.hunt_id 
    AND treasure_hunts.is_active = true
  )
);

-- Solo admins pueden modificar
CREATE POLICY "Admins can manage treasures" ON treasure_hunt_2025_treasures
FOR ALL TO public
USING (is_admin());
```

#### treasure_hunt_2025_scans (Privado por usuario)
```sql
-- Usuarios solo ven sus propios scans
CREATE POLICY "Users can view own scans" ON treasure_hunt_2025_scans
FOR SELECT TO public
USING (user_id = auth.uid());

-- Usuarios solo pueden insertar sus propios scans
CREATE POLICY "Users can insert own scans" ON treasure_hunt_2025_scans
FOR INSERT TO public
WITH CHECK (user_id = auth.uid());

-- Admins pueden ver todos los scans
CREATE POLICY "Admins can view all scans" ON treasure_hunt_2025_scans
FOR SELECT TO public
USING (is_admin());
```

#### treasure_hunt_2025_progress (Privado por usuario)
```sql
-- Usuarios solo ven su propio progreso
CREATE POLICY "Users can view own progress" ON treasure_hunt_2025_progress
FOR SELECT TO public
USING (user_id = auth.uid());

-- Usuarios pueden insertar su propio progreso
CREATE POLICY "Users can insert own progress" ON treasure_hunt_2025_progress
FOR INSERT TO public
WITH CHECK (user_id = auth.uid());

-- Usuarios pueden actualizar su propio progreso
CREATE POLICY "Users can update own progress" ON treasure_hunt_2025_progress
FOR UPDATE TO public
USING (user_id = auth.uid());

-- Admins pueden ver todo el progreso
CREATE POLICY "Admins can view all progress" ON treasure_hunt_2025_progress
FOR SELECT TO public
USING (is_admin());
```

### 3. Verificar función is_admin()
```sql
-- Asegurar que existe la función is_admin()
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 🧪 PLAN DE TESTING

### 1. Testing en Desarrollo
- [ ] Aplicar políticas RLS en desarrollo
- [ ] Probar que usuarios pueden ver solo sus datos
- [ ] Probar que treasure hunt funciona correctamente
- [ ] Probar que dashboard muestra datos correctos
- [ ] Probar panel de admin

### 2. Testing de Seguridad
- [ ] Verificar que usuarios no pueden ver datos de otros
- [ ] Verificar que solo admins pueden modificar treasures
- [ ] Verificar que políticas funcionan con diferentes usuarios
- [ ] Test de penetración básico

### 3. Aplicar en Producción
- [ ] Backup de base de datos antes de aplicar
- [ ] Aplicar políticas en producción
- [ ] Monitorear errores en logs
- [ ] Verificar funcionalidad completa

## ⚠️ RIESGOS ACTUALES SIN RLS

1. **Cualquier usuario autenticado puede**:
   - Ver progreso de otros usuarios
   - Modificar progreso de otros usuarios
   - Ver scans de otros usuarios
   - Potencialmente modificar datos del treasure hunt

2. **Exposición de datos privados**:
   - Estadísticas de otros usuarios
   - Patrones de comportamiento
   - Información de ubicación (scans)

## 🎯 PRIORIDAD

**ALTA** - Debe implementarse antes de lanzamiento público del treasure hunt.

## 📅 ESTIMACIÓN

- **Desarrollo**: 2-3 horas
- **Testing**: 1-2 horas  
- **Aplicación en producción**: 30 minutos

---

**NOTA**: Las políticas RLS se deshabilitaron temporalmente en el commit donde se implementó el treasure hunt. Este TODO debe completarse para asegurar la aplicación en producción.