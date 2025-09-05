-- Fix Hero v1 blocks
UPDATE pages_blocks_hero_v1 
SET title = NULL 
WHERE title IS NOT NULL AND title::text != 'null' AND title::text !~ '^\{.*\}$';

UPDATE pages_blocks_hero_v1 
SET description = NULL 
WHERE description IS NOT NULL AND description::text != 'null' AND description::text !~ '^\{.*\}$';

-- Fix Hero v2 blocks  
UPDATE pages_blocks_hero_v2 
SET title = NULL 
WHERE title IS NOT NULL AND title::text != 'null' AND title::text !~ '^\{.*\}$';

UPDATE pages_blocks_hero_v2 
SET subtitle = NULL 
WHERE subtitle IS NOT NULL AND subtitle::text != 'null' AND subtitle::text !~ '^\{.*\}$';

UPDATE pages_blocks_hero_v2 
SET description = NULL 
WHERE description IS NOT NULL AND description::text != 'null' AND description::text !~ '^\{.*\}$';

-- Fix version tables
UPDATE _pages_v_blocks_hero_v1 
SET title = NULL 
WHERE title IS NOT NULL AND title::text != 'null' AND title::text !~ '^\{.*\}$';

UPDATE _pages_v_blocks_hero_v1 
SET description = NULL 
WHERE description IS NOT NULL AND description::text != 'null' AND description::text !~ '^\{.*\}$';

UPDATE _pages_v_blocks_hero_v2 
SET title = NULL 
WHERE title IS NOT NULL AND title::text != 'null' AND title::text !~ '^\{.*\}$';

UPDATE _pages_v_blocks_hero_v2 
SET subtitle = NULL 
WHERE subtitle IS NOT NULL AND subtitle::text != 'null' AND subtitle::text !~ '^\{.*\}$';

UPDATE _pages_v_blocks_hero_v2 
SET description = NULL 
WHERE description IS NOT NULL AND description::text != 'null' AND description::text !~ '^\{.*\}$';

-- Now alter the columns to JSONB
ALTER TABLE pages_blocks_hero_v1 
ALTER COLUMN title TYPE jsonb USING CASE 
  WHEN title IS NULL OR title::text = 'null' THEN NULL 
  WHEN title::text ~ '^\{.*\}$' THEN title::jsonb 
  ELSE NULL 
END;

ALTER TABLE pages_blocks_hero_v1 
ALTER COLUMN description TYPE jsonb USING CASE 
  WHEN description IS NULL OR description::text = 'null' THEN NULL 
  WHEN description::text ~ '^\{.*\}$' THEN description::jsonb 
  ELSE NULL 
END;

ALTER TABLE pages_blocks_hero_v2 
ALTER COLUMN title TYPE jsonb USING CASE 
  WHEN title IS NULL OR title::text = 'null' THEN NULL 
  WHEN title::text ~ '^\{.*\}$' THEN title::jsonb 
  ELSE NULL 
END;

ALTER TABLE pages_blocks_hero_v2 
ALTER COLUMN subtitle TYPE jsonb USING CASE 
  WHEN subtitle IS NULL OR subtitle::text = 'null' THEN NULL 
  WHEN subtitle::text ~ '^\{.*\}$' THEN subtitle::jsonb 
  ELSE NULL 
END;

ALTER TABLE pages_blocks_hero_v2 
ALTER COLUMN description TYPE jsonb USING CASE 
  WHEN description IS NULL OR description::text = 'null' THEN NULL 
  WHEN description::text ~ '^\{.*\}$' THEN description::jsonb 
  ELSE NULL 
END;

-- Version tables
ALTER TABLE _pages_v_blocks_hero_v1 
ALTER COLUMN title TYPE jsonb USING CASE 
  WHEN title IS NULL OR title::text = 'null' THEN NULL 
  WHEN title::text ~ '^\{.*\}$' THEN title::jsonb 
  ELSE NULL 
END;

ALTER TABLE _pages_v_blocks_hero_v1 
ALTER COLUMN description TYPE jsonb USING CASE 
  WHEN description IS NULL OR description::text = 'null' THEN NULL 
  WHEN description::text ~ '^\{.*\}$' THEN description::jsonb 
  ELSE NULL 
END;

ALTER TABLE _pages_v_blocks_hero_v2 
ALTER COLUMN title TYPE jsonb USING CASE 
  WHEN title IS NULL OR title::text = 'null' THEN NULL 
  WHEN title::text ~ '^\{.*\}$' THEN title::jsonb 
  ELSE NULL 
END;

ALTER TABLE _pages_v_blocks_hero_v2 
ALTER COLUMN subtitle TYPE jsonb USING CASE 
  WHEN subtitle IS NULL OR subtitle::text = 'null' THEN NULL 
  WHEN subtitle::text ~ '^\{.*\}$' THEN subtitle::jsonb 
  ELSE NULL 
END;

ALTER TABLE _pages_v_blocks_hero_v2 
ALTER COLUMN description TYPE jsonb USING CASE 
  WHEN description IS NULL OR description::text = 'null' THEN NULL 
  WHEN description::text ~ '^\{.*\}$' THEN description::jsonb 
  ELSE NULL 
END;

-- Drop the old rich text columns
ALTER TABLE _pages_v_blocks_hero_v1 DROP COLUMN IF EXISTS title_rich_text;
ALTER TABLE _pages_v_blocks_hero_v1 DROP COLUMN IF EXISTS description_rich_text;