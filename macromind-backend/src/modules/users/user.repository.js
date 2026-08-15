const pool = require("../../config/db");

async function getById(userId) {
  const result = await pool.query(
    `SELECT id, email, name, age, gender, height_cm, weight_kg,
            target_weight_kg, goal_type, created_at
     FROM users
     WHERE id = $1`,
    [userId]
  );

  return result.rows[0];
}

async function updateProfile(userId, data) {
  const result = await pool.query(
    `UPDATE users SET
      name = COALESCE($2, name),
      age = COALESCE($3, age),
      gender = COALESCE($4, gender),
      height_cm = COALESCE($5, height_cm),
      weight_kg = COALESCE($6, weight_kg),
      target_weight_kg = COALESCE($7, target_weight_kg),
      goal_type = COALESCE($8, goal_type),
      updated_at = CURRENT_TIMESTAMP
     WHERE id = $1
     RETURNING id, email, name, age, gender, height_cm, weight_kg,
               target_weight_kg, goal_type`,
    [
      userId,
      data.name,
      data.age,
      data.gender,
      data.height,
      data.weight,
      data.targetWeight,
      data.goal,
    ]
  );

  return result.rows[0];
}

async function updateCurrentWeight(userId, weightKg) {
  await pool.query(
    `UPDATE users SET weight_kg = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
    [userId, weightKg]
  );
}

module.exports = {
  getById,
  updateProfile,
  updateCurrentWeight,
};