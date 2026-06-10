-- UP
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('user', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name              VARCHAR(70),
    last_name               VARCHAR(70),
    role                    user_role NOT NULL DEFAULT 'user',
    email                   VARCHAR(100) UNIQUE NOT NULL,
    address                 VARCHAR(255),
    phone_number            VARCHAR(20),
    username                VARCHAR(20) UNIQUE NOT NULL,
    password_hash           TEXT NOT NULL,
    wallet_balance          INTEGER DEFAULT 0,
    card_number             VARCHAR(20),
    birth_date              DATE,
    last_seen_at            TIMESTAMP,
    wrong_password_number   INTEGER DEFAULT 0,
    wrong_password_until    TIMESTAMP,
    is_profile_completed    BOOLEAN DEFAULT FALSE,
    is_email_verified       BOOLEAN DEFAULT FALSE,
    created_at              TIMESTAMP DEFAULT NOW(),
    updated_at              TIMESTAMP DEFAULT NOW()
);

-- DOWN
DROP TABLE IF EXISTS users;
DROP TYPE IF EXISTS user_role;