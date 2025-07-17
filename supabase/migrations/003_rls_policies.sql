-- Migration 003: Row Level Security (RLS) Policies
-- Created for ULTRATHINK Plan - Fase 1

-- Enable RLS on all user-related tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_places ENABLE ROW LEVEL SECURITY;
ALTER TABLE treasure_hunt_2025_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE treasure_hunt_2025_progress ENABLE ROW LEVEL SECURITY;

-- treasure_hunts and treasure_hunt_2025_treasures are public read-only
-- They don't need RLS as they contain public information

--
-- USERS TABLE POLICIES
--

-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.email() = email);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.email() = email);

-- Users can insert their own profile (during registration)
CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK (auth.email() = email);

--
-- SAVED EVENTS TABLE POLICIES
--

-- Users can view their own saved events
CREATE POLICY "Users can view own saved events" ON saved_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = saved_events.user_id 
            AND users.email = auth.email()
        )
    );

-- Users can insert their own saved events
CREATE POLICY "Users can insert own saved events" ON saved_events
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = saved_events.user_id 
            AND users.email = auth.email()
        )
    );

-- Users can delete their own saved events
CREATE POLICY "Users can delete own saved events" ON saved_events
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = saved_events.user_id 
            AND users.email = auth.email()
        )
    );

--
-- SAVED PLACES TABLE POLICIES
--

-- Users can view their own saved places
CREATE POLICY "Users can view own saved places" ON saved_places
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = saved_places.user_id 
            AND users.email = auth.email()
        )
    );

-- Users can insert their own saved places
CREATE POLICY "Users can insert own saved places" ON saved_places
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = saved_places.user_id 
            AND users.email = auth.email()
        )
    );

-- Users can delete their own saved places
CREATE POLICY "Users can delete own saved places" ON saved_places
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = saved_places.user_id 
            AND users.email = auth.email()
        )
    );

--
-- TREASURE HUNT SCANS TABLE POLICIES
--

-- Users can view their own scans
CREATE POLICY "Users can view own treasure scans" ON treasure_hunt_2025_scans
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = treasure_hunt_2025_scans.user_id 
            AND users.email = auth.email()
        )
    );

-- Users can insert their own scans
CREATE POLICY "Users can insert own treasure scans" ON treasure_hunt_2025_scans
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = treasure_hunt_2025_scans.user_id 
            AND users.email = auth.email()
        )
    );

--
-- TREASURE HUNT PROGRESS TABLE POLICIES
--

-- Users can view their own progress
CREATE POLICY "Users can view own treasure progress" ON treasure_hunt_2025_progress
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = treasure_hunt_2025_progress.user_id 
            AND users.email = auth.email()
        )
    );

-- Progress is updated automatically via triggers, but users need insert permission
CREATE POLICY "Users can insert own treasure progress" ON treasure_hunt_2025_progress
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = treasure_hunt_2025_progress.user_id 
            AND users.email = auth.email()
        )
    );

-- Allow updates for progress (triggered automatically)
CREATE POLICY "Users can update own treasure progress" ON treasure_hunt_2025_progress
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = treasure_hunt_2025_progress.user_id 
            AND users.email = auth.email()
        )
    );

--
-- PUBLIC ACCESS POLICIES (for read-only data)
--

-- Everyone can read treasure hunts (public information)
CREATE POLICY "Anyone can view treasure hunts" ON treasure_hunts
    FOR SELECT USING (true);

-- Everyone can read treasure hunt treasures (public information)
CREATE POLICY "Anyone can view treasure hunt treasures" ON treasure_hunt_2025_treasures
    FOR SELECT USING (true);

--
-- ADMIN POLICIES
--

-- Create admin role check function
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    -- Check if user has admin role (this can be extended later)
    -- For now, we'll use a simple email check
    -- In production, this should use a proper role system
    RETURN EXISTS (
        SELECT 1 FROM users 
        WHERE email = auth.email() 
        AND email IN ('admin@indaga.com', 'rodrigosalmeron@gmail.com')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin can view all users
CREATE POLICY "Admins can view all users" ON users
    FOR SELECT USING (is_admin());

-- Admin can view all saved events
CREATE POLICY "Admins can view all saved events" ON saved_events
    FOR SELECT USING (is_admin());

-- Admin can view all saved places
CREATE POLICY "Admins can view all saved places" ON saved_places
    FOR SELECT USING (is_admin());

-- Admin can view all treasure scans
CREATE POLICY "Admins can view all treasure scans" ON treasure_hunt_2025_scans
    FOR SELECT USING (is_admin());

-- Admin can view all treasure progress
CREATE POLICY "Admins can view all treasure progress" ON treasure_hunt_2025_progress
    FOR SELECT USING (is_admin());

-- Admin can manage treasure hunts
CREATE POLICY "Admins can manage treasure hunts" ON treasure_hunts
    FOR ALL USING (is_admin());

-- Admin can manage treasure hunt treasures
CREATE POLICY "Admins can manage treasure hunt treasures" ON treasure_hunt_2025_treasures
    FOR ALL USING (is_admin());

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;