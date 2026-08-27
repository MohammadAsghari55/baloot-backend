-- UP
CREATE TABLE IF NOT EXISTS password_history (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    password_hash           TEXT NOT NULL,
    created_at              TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_password_history_user_id_created_at 
ON password_history(user_id, created_at DESC);

-- DOWN
DROP TABLE IF EXISTS password_history;