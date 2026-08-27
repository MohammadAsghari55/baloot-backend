-- UP
CREATE TABLE IF NOT EXISTS refresh_token (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash              TEXT NOT NULL UNIQUE,
    created_at              TIMESTAMPTZ DEFAULT NOW(),
    expires_at              TIMESTAMPTZ NOT NULL,
    revoked_at              TIMESTAMPTZ,
    device_id               VARCHAR(255) NOT NULL DEFAULT 'unknown'
);

CREATE UNIQUE INDEX idx_unique_active_refresh_token_device 
ON refresh_token(user_id, device_id) 
WHERE revoked_at IS NULL;
-- DOWN
DROP TABLE IF EXISTS refresh_token;