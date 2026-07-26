CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,

    name VARCHAR(255) NOT NULL,

    age INTEGER,
    gender VARCHAR(20),

    height_cm DECIMAL(5,2),
    weight_kg DECIMAL(5,2),

    goal_type VARCHAR(50),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);