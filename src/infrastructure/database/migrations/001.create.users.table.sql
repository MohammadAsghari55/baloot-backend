-- UP
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('user', 'admin', 'super_admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
    id                              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name                      VARCHAR(70),
    last_name                       VARCHAR(70),
    role                            user_role NOT NULL DEFAULT 'user',
    email                           VARCHAR(100) UNIQUE NOT NULL,
    address                         VARCHAR(255),
    phone_number                    VARCHAR(40),
    username                        VARCHAR(40) UNIQUE NOT NULL,
    password_hash                   TEXT NOT NULL,
    card_number                     VARCHAR(20),
    birth_date                      DATE,
    password_change_try             INTEGER DEFAULT 0,
    password_change_locked_until    TIMESTAMPTZ,
    wrong_password_number           INTEGER DEFAULT 0,
    wrong_password_until            TIMESTAMPTZ,
    is_profile_completed            BOOLEAN DEFAULT FALSE,
    is_email_verified               BOOLEAN DEFAULT FALSE,
    token_version                   INTEGER NOT NULL DEFAULT 1,
    created_at                      TIMESTAMPTZ DEFAULT NOW(),
    updated_at                      TIMESTAMPTZ DEFAULT NOW()
);

-- DOWN
DROP TABLE IF EXISTS users;
DROP TYPE IF EXISTS user_role;