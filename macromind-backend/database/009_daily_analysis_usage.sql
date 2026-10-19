
CREATE TABLE IF NOT EXISTS daily_analysis_usage (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    usage_date DATE NOT NULL,
    analysis_count INTEGER NOT NULL DEFAULT 0
        CHECK (analysis_count >= 0 AND analysis_count <= 3),
    PRIMARY KEY (user_id, usage_date)
);
