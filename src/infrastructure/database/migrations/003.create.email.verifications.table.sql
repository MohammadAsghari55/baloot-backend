-- UP
CREATE TABLE IF NOT EXISTS email_verifications (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    hashed_code             TEXT NOT NULL,
    created_at              TIMESTAMPTZ DEFAULT NOW(),
    expires_at              TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_email_verifications_user_id ON email_verifications(user_id);

-- DOWN
DROP TABLE IF EXISTS email_verifications;