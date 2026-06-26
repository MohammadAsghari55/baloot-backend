-- UP
CREATE TABLE IF NOT EXISTS email_verifications (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    code                    VARCHAR(6) NOT NULL ,
    created_at              TIMESTAMP DEFAULT NOW(),
    expires_at              TIMESTAMP NOT NULL
);

CREATE UNIQUE INDEX idx_email_verifications_user_active 
ON email_verifications(user_id) 
WHERE expires_at > NOW();

-- DOWN
DROP TABLE IF EXISTS email_verifications;