CREATE TABLE IF NOT EXISTS meals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL,

    meal_type VARCHAR(50),

    meal_text TEXT,

    total_calories DECIMAL(10,2),
    total_protein DECIMAL(10,2),
    total_carbs DECIMAL(10,2),
    total_fat DECIMAL(10,2),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_meals_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);