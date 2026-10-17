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
    VALUES ($1, $2, $3, $4, $5, $6, $7)
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
    VALUES ($1, $2, $3, $4, $5, $6, $7)
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

async function saveMealWithFoods(mealData, foods) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const mealResult = await client.query(
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
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
      `,
      [
        mealData.userId,
        mealData.mealType,
        mealData.mealText,
        mealData.totalCalories,
        mealData.totalProtein,
        mealData.totalCarbs,
        mealData.totalFat,
      ],
    );

    const meal = mealResult.rows[0];

    for (const food of foods) {
      await client.query(
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
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        `,
        [
          meal.id,
          food.name,
          food.quantity,
          food.calories,
          food.protein,
          food.carbs,
          food.fat,
        ],
      );
    }

    await client.query("COMMIT");

    return meal;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function getRecentMeals(userId, date) {
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
      AND (created_at AT TIME ZONE 'Asia/Kolkata')::date =
      COALESCE(
        $2::date,
        (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')::date
      )
    ORDER BY created_at DESC
    `,
    [userId, date || null],
  );

  return result.rows;
}

async function deleteMeal(mealId, userId) {
  const result = await pool.query(
    `
    DELETE FROM meals
    WHERE id = $1
      AND user_id = $2
      AND (created_at AT TIME ZONE 'Asia/Kolkata')::date =
          (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')::date
    RETURNING *
    `,
    [mealId, userId],
  );

  return result.rows[0];
}

module.exports = {
  createMeal,
  createMealFood,
  saveMealWithFoods,
  getRecentMeals,
  deleteMeal,
};
