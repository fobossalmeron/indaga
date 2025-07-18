-- Migration: Fix Treasure Hunt RLS Policies
-- Created for ULTRATHINK Plan - Fase 1

-- Eliminar políticas problemáticas existentes
DROP POLICY IF EXISTS "Users can insert own treasure progress" ON treasure_hunt_2025_progress;
DROP POLICY IF EXISTS "Users can update own treasure progress" ON treasure_hunt_2025_progress;
DROP POLICY IF EXISTS "Users can view own treasure progress" ON treasure_hunt_2025_progress;
DROP POLICY IF EXISTS "Admins can view all treasure progress" ON treasure_hunt_2025_progress;

-- Crear políticas correctas para treasure_hunt_2025_progress
CREATE POLICY "Users can view own progress" ON treasure_hunt_2025_progress
FOR SELECT TO public
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own progress" ON treasure_hunt_2025_progress
FOR INSERT TO public
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own progress" ON treasure_hunt_2025_progress
FOR UPDATE TO public
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all progress" ON treasure_hunt_2025_progress
FOR SELECT TO public
USING (is_admin());

-- Crear políticas para treasure_hunt_2025_scans
CREATE POLICY "Users can view own scans" ON treasure_hunt_2025_scans
FOR SELECT TO public
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own scans" ON treasure_hunt_2025_scans
FOR INSERT TO public
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all scans" ON treasure_hunt_2025_scans
FOR SELECT TO public
USING (is_admin());

-- Habilitar RLS en las tablas que lo necesitan
ALTER TABLE treasure_hunt_2025_treasures ENABLE ROW LEVEL SECURITY;
ALTER TABLE treasure_hunts ENABLE ROW LEVEL SECURITY;

-- Crear políticas para treasure_hunt_2025_treasures (lectura pública)
CREATE POLICY "Anyone can view treasures from active hunts" ON treasure_hunt_2025_treasures
FOR SELECT TO public
USING (
  EXISTS (
    SELECT 1 FROM treasure_hunts 
    WHERE treasure_hunts.id = treasure_hunt_2025_treasures.hunt_id 
    AND treasure_hunts.is_active = true
  )
);

-- Crear políticas para treasure_hunts (lectura pública)
CREATE POLICY "Anyone can view active treasure hunts" ON treasure_hunts
FOR SELECT TO public
USING (is_active = true);
