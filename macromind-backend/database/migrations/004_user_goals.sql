CREATE TABLE IF NOT EXISTS user_goals (
    user_id UUID PRIMARY KEY,

    calorie_goal INTEGER DEFAULT 2200,
    protein_goal INTEGER DEFAULT 120,
    carb_goal INTEGER DEFAULT 250,
    fat_goal INTEGER DEFAULT 70,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_goals_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);