const pool = require("../../config/db");

async function getGoals(userId) {

  const result = await pool.query(
    `
    SELECT *
    FROM user_goals
    WHERE user_id = $1
    `,
    [userId]
  );

  return result.rows[0];
}

async function upsertGoals(userId, goals) {

  const result = await pool.query(
    `
    INSERT INTO user_goals
    (
      user_id,
      calorie_goal,
      protein_goal,
      carb_goal,
      fat_goal
    )
    VALUES
    ($1,$2,$3,$4,$5)

    ON CONFLICT (user_id)
    DO UPDATE SET

      calorie_goal = EXCLUDED.calorie_goal,
      protein_goal = EXCLUDED.protein_goal,
      carb_goal = EXCLUDED.carb_goal,
      fat_goal = EXCLUDED.fat_goal,

      updated_at = CURRENT_TIMESTAMP

    RETURNING *
    `,
    [
      userId,
      goals.calorieGoal,
      goals.proteinGoal,
      goals.carbGoal,
      goals.fatGoal
    ]
  );

  return result.rows[0];
}

module.exports = {
  getGoals,
  upsertGoals
};