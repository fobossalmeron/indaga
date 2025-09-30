-- Migration 002: Treasure Hunt Specific Tables
-- Tables for treasure hunt functionality with automatic triggers

-- Table: treasure_hunt_2025_treasures
-- Specific treasures for the 2025 treasure hunt
CREATE TABLE IF NOT EXISTS treasure_hunt_2025_treasures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hunt_id UUID NOT NULL REFERENCES treasure_hunts(id) ON DELETE CASCADE,
    treasure_code TEXT UNIQUE NOT NULL, -- código único del QR
    treasure_name TEXT NOT NULL, -- nombre del lugar/tesoro
    treasure_secret TEXT,
    treasure_location_maps_url TEXT,
    location_coordinates POINT, -- coordenadas del lugar (opcional)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: treasure_hunt_2025_scans
-- Track when users scan QR codes (individual scans)
CREATE TABLE IF NOT EXISTS treasure_hunt_2025_scans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    hunt_id UUID NOT NULL REFERENCES treasure_hunts(id) ON DELETE CASCADE,
    treasure_id UUID NOT NULL REFERENCES treasure_hunt_2025_treasures(id) ON DELETE CASCADE,
    scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, treasure_id) -- Un usuario solo puede escanear un tesoro una vez
);

-- Table: treasure_hunt_2025_progress
-- Track overall progress per user in the hunt
CREATE TABLE IF NOT EXISTS treasure_hunt_2025_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    hunt_id UUID NOT NULL REFERENCES treasure_hunts(id) ON DELETE CASCADE,
    treasures_found INTEGER DEFAULT 0,
    completion_percentage DECIMAL(5,2) DEFAULT 0.00,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, hunt_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_treasures_hunt_id ON treasure_hunt_2025_treasures(hunt_id);
CREATE INDEX IF NOT EXISTS idx_treasures_code ON treasure_hunt_2025_treasures(treasure_code);
CREATE INDEX IF NOT EXISTS idx_scans_user_id ON treasure_hunt_2025_scans(user_id);
CREATE INDEX IF NOT EXISTS idx_scans_hunt_id ON treasure_hunt_2025_scans(hunt_id);
CREATE INDEX IF NOT EXISTS idx_scans_treasure_id ON treasure_hunt_2025_scans(treasure_id);
CREATE INDEX IF NOT EXISTS idx_scans_scanned_at ON treasure_hunt_2025_scans(scanned_at);
CREATE INDEX IF NOT EXISTS idx_progress_user_id ON treasure_hunt_2025_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_hunt_id ON treasure_hunt_2025_progress(hunt_id);
CREATE INDEX IF NOT EXISTS idx_progress_completion ON treasure_hunt_2025_progress(completion_percentage);

-- Function to update progress when a scan happens
CREATE OR REPLACE FUNCTION update_treasure_hunt_progress()
RETURNS TRIGGER AS $$
DECLARE
    hunt_total_treasures INTEGER;
    user_treasures_found INTEGER;
    progress_percentage DECIMAL(5,2);
BEGIN
    -- Get total treasures for this hunt
    SELECT total_treasures INTO hunt_total_treasures
    FROM treasure_hunts
    WHERE id = NEW.hunt_id;

    -- Count user's found treasures
    SELECT COUNT(*) INTO user_treasures_found
    FROM treasure_hunt_2025_scans
    WHERE user_id = NEW.user_id AND hunt_id = NEW.hunt_id;

    -- Calculate percentage
    IF hunt_total_treasures > 0 THEN
        progress_percentage := (user_treasures_found::DECIMAL / hunt_total_treasures) * 100;
    ELSE
        progress_percentage := 0;
    END IF;

    -- Insert or update progress
    INSERT INTO treasure_hunt_2025_progress (user_id, hunt_id, treasures_found, completion_percentage)
    VALUES (NEW.user_id, NEW.hunt_id, user_treasures_found, progress_percentage)
    ON CONFLICT (user_id, hunt_id)
    DO UPDATE SET
        treasures_found = user_treasures_found,
        completion_percentage = progress_percentage,
        completed_at = CASE
            WHEN progress_percentage = 100 AND treasure_hunt_2025_progress.completed_at IS NULL
            THEN NOW()
            ELSE treasure_hunt_2025_progress.completed_at
        END;

    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update progress when scans happen
DROP TRIGGER IF EXISTS trigger_update_treasure_hunt_progress ON treasure_hunt_2025_scans;
CREATE TRIGGER trigger_update_treasure_hunt_progress
    AFTER INSERT ON treasure_hunt_2025_scans
    FOR EACH ROW
    EXECUTE FUNCTION update_treasure_hunt_progress();