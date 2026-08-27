-- UP
CREATE TABLE IF NOT EXISTS seed_history (
    name            VARCHAR(255) PRIMARY KEY,
    executed_at     TIMESTAMPTZ DEFAULT NOW(),
    status          VARCHAR(20) DEFAULT 'success'
);

-- DOWN
DROP TABLE IF EXISTS seed_history;