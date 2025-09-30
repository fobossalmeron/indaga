-- Migration 004: Row Level Security (RLS) Policies
-- Complete RLS setup for all tables

-- Enable RLS on all user-related tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_places ENABLE ROW LEVEL SECURITY;
ALTER TABLE treasure_hunt_2025_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE treasure_hunt_2025_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE treasure_hunts ENABLE ROW LEVEL SECURITY;
ALTER TABLE treasure_hunt_2025_treasures ENABLE ROW LEVEL SECURITY;

--
-- USERS TABLE POLICIES
--
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.email() = email);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.email() = email);

CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK (auth.email() = email);

--
-- SAVED EVENTS TABLE POLICIES
--
CREATE POLICY "Users can view own saved events" ON saved_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = saved_events.user_id
            AND users.email = auth.email()
        )
    );

CREATE POLICY "Users can insert own saved events" ON saved_events
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = saved_events.user_id
            AND users.email = auth.email()
        )
    );

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
CREATE POLICY "Users can view own saved places" ON saved_places
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = saved_places.user_id
            AND users.email = auth.email()
        )
    );

CREATE POLICY "Users can insert own saved places" ON saved_places
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = saved_places.user_id
            AND users.email = auth.email()
        )
    );

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
CREATE POLICY "Users can view own treasure scans" ON treasure_hunt_2025_scans
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = treasure_hunt_2025_scans.user_id
            AND users.email = auth.email()
        )
    );

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
CREATE POLICY "Users can view own treasure progress" ON treasure_hunt_2025_progress
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = treasure_hunt_2025_progress.user_id
            AND users.email = auth.email()
        )
    );

CREATE POLICY "Users can insert own treasure progress" ON treasure_hunt_2025_progress
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = treasure_hunt_2025_progress.user_id
            AND users.email = auth.email()
        )
    );

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
CREATE POLICY "Anyone can view treasure hunts" ON treasure_hunts
    FOR SELECT USING (true);

CREATE POLICY "Anyone can view treasure hunt treasures" ON treasure_hunt_2025_treasures
    FOR SELECT USING (true);

--
-- ADMIN POLICIES
--

-- Create admin role check function
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    -- Check if user has admin role using the role column
    RETURN EXISTS (
        SELECT 1 FROM users
        WHERE id = auth.uid()
        AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE POLICY "Admins can view all users" ON users
    FOR SELECT USING (is_admin());

CREATE POLICY "Admins can view all saved events" ON saved_events
    FOR SELECT USING (is_admin());

CREATE POLICY "Admins can view all saved places" ON saved_places
    FOR SELECT USING (is_admin());

CREATE POLICY "Admins can view all treasure scans" ON treasure_hunt_2025_scans
    FOR SELECT USING (is_admin());

CREATE POLICY "Admins can view all treasure progress" ON treasure_hunt_2025_progress
    FOR SELECT USING (is_admin());

CREATE POLICY "Admins can manage treasure hunts" ON treasure_hunts
    FOR ALL USING (is_admin());

CREATE POLICY "Admins can manage treasure hunt treasures" ON treasure_hunt_2025_treasures
    FOR ALL USING (is_admin());

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;