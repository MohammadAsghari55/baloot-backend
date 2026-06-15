-- UP
CREATE TABLE IF NOT EXISTS refresh_token (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash              TEXT NOT NULL UNIQUE,
    created_at              TIMESTAMP DEFAULT NOW(),
    expires_at              TIMESTAMP NOT NULL,
    revoked_at              TIMESTAMP,
);

CREATE INDEX idx_refresh_token_user_revoked ON refresh_token(user_id, revoked_at);
-- DOWN
DROP TABLE IF EXISTS refresh_token;