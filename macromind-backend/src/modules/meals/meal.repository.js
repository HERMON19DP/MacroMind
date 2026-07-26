const pool = require("../../config/db");

async function createMeal(meal) {
  const result = await pool.query(
    `
    INSERT INTO meals
    (
      user_id,
      meal_type,
      meal_text,
      total_calories,
      total_protein,
      total_carbs,
      total_fat
    )
    VALUES
    ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *
    `,
    [
      meal.userId,
      meal.mealType,
      meal.mealText,
      meal.totalCalories,
      meal.totalProtein,
      meal.totalCarbs,
      meal.totalFat,
    ],
  );

  return result.rows[0];
}

async function createMealFood(food) {
  await pool.query(
    `
    INSERT INTO meal_foods
    (
      meal_id,
      food_name,
      quantity,
      calories,
      protein,
      carbs,
      fat
    )
    VALUES
    ($1,$2,$3,$4,$5,$6,$7)
    `,
    [
      food.mealId,
      food.name,
      food.quantity,
      food.calories,
      food.protein,
      food.carbs,
      food.fat,
    ],
  );
}

async function getRecentMeals(userId) {
  const result = await pool.query(
    `
    SELECT
      id,
      meal_type,
      meal_text,
      total_calories,
      total_protein,
      total_carbs,
      total_fat,
      created_at

    FROM meals

    WHERE user_id = $1

    ORDER BY created_at DESC

    LIMIT 10
    `,
    [userId],
  );

  return result.rows;
}

async function deleteMeal(mealId, userId) {
  const result = await pool.query(
    `
    DELETE FROM meals

    WHERE id = $1
    AND user_id = $2

    RETURNING *
    `,
    [mealId, userId],
  );

  return result.rows[0];
}

module.exports = {
  createMeal,
  createMealFood,
  getRecentMeals,
  deleteMeal
};
