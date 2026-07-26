CREATE TABLE IF NOT EXISTS meal_foods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    meal_id UUID NOT NULL,

    food_name VARCHAR(255),

    quantity VARCHAR(255),

    calories DECIMAL(10,2),
    protein DECIMAL(10,2),
    carbs DECIMAL(10,2),
    fat DECIMAL(10,2),

    CONSTRAINT fk_meal_foods_meal
        FOREIGN KEY (meal_id)
        REFERENCES meals(id)
        ON DELETE CASCADE
);