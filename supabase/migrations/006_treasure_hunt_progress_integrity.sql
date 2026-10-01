-- Shared storage for editions: serialize a participant's inserts before recounting.
-- Existing scans and progress are intentionally left untouched.
CREATE OR REPLACE FUNCTION public.validate_treasure_hunt_scan()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
    PERFORM pg_advisory_xact_lock(hashtextextended(NEW.user_id::text || ':' || NEW.hunt_id::text, 0));
    IF NOT EXISTS (
        SELECT 1 FROM public.treasure_hunt_2025_treasures
        WHERE id = NEW.treasure_id AND hunt_id = NEW.hunt_id
    ) THEN
        RAISE EXCEPTION 'Treasure does not belong to this hunt' USING ERRCODE = '23514';
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_validate_treasure_hunt_scan ON public.treasure_hunt_2025_scans;
CREATE TRIGGER trigger_validate_treasure_hunt_scan
    BEFORE INSERT ON public.treasure_hunt_2025_scans
    FOR EACH ROW EXECUTE FUNCTION public.validate_treasure_hunt_scan();

CREATE OR REPLACE FUNCTION public.update_treasure_hunt_progress()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
DECLARE
    hunt_total INTEGER;
    found INTEGER;
    first_scan TIMESTAMPTZ;
    last_scan TIMESTAMPTZ;
    percentage NUMERIC(5,2);
BEGIN
    SELECT total_treasures INTO hunt_total FROM public.treasure_hunts WHERE id = NEW.hunt_id;
    SELECT count(*), min(scanned_at), max(scanned_at)
      INTO found, first_scan, last_scan
      FROM public.treasure_hunt_2025_scans
      WHERE user_id = NEW.user_id AND hunt_id = NEW.hunt_id;
    percentage := CASE WHEN hunt_total > 0 THEN LEAST(100, found::numeric / hunt_total * 100) ELSE 0 END;
    INSERT INTO public.treasure_hunt_2025_progress
      (user_id, hunt_id, treasures_found, completion_percentage, started_at, completed_at)
    VALUES (NEW.user_id, NEW.hunt_id, found, percentage, first_scan,
            CASE WHEN hunt_total > 0 AND found >= hunt_total THEN last_scan END)
    ON CONFLICT (user_id, hunt_id) DO UPDATE SET
      treasures_found = EXCLUDED.treasures_found,
      completion_percentage = EXCLUDED.completion_percentage,
      completed_at = CASE WHEN hunt_total > 0 AND found >= hunt_total
        THEN COALESCE(treasure_hunt_2025_progress.completed_at, last_scan)
        ELSE treasure_hunt_2025_progress.completed_at END;
    RETURN NEW;
END;
$$;
