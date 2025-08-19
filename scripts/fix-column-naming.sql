DO $$
DECLARE
  table_exists boolean;
BEGIN
  -- Check if users table exists
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'users'
  ) INTO table_exists;
  
  IF table_exists THEN
    -- Add missing auth columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='reset_password_token') THEN
      ALTER TABLE users ADD COLUMN reset_password_token VARCHAR(255);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='reset_password_expiration') THEN
      ALTER TABLE users ADD COLUMN reset_password_expiration TIMESTAMP;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='salt') THEN
      ALTER TABLE users ADD COLUMN salt VARCHAR(255);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='hash') THEN
      ALTER TABLE users ADD COLUMN hash VARCHAR(255);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='lock_until') THEN
      ALTER TABLE users ADD COLUMN lock_until TIMESTAMP;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='login_attempts') THEN
      ALTER TABLE users ADD COLUMN login_attempts INT DEFAULT 0;
    END IF;
  END IF;
END
$$;