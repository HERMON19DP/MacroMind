const aiService = require("../ai/ai.service");
const mealRepository = require("./meal.repository");

async function analyzeMeal(text) {
  return await aiService.analyzeMealText(text);
}

async function saveAnalyzedMeal(data) {
  if (!data || !data.userId) {
    throw new Error("User is required");
  }

  if (typeof data.mealText !== "string" || !data.mealText.trim()) {
    throw new Error("Meal text is required");
  }

  if (
    !data.analysis ||
    !Array.isArray(data.analysis.foods) ||
    !data.analysis.totals
  ) {
    throw new Error("Valid meal analysis is required");
  }

  const validNumber = (value) =>
    typeof value === "number" && Number.isFinite(value) && value >= 0;

  const foods = data.analysis.foods.map((food) => {
    if (
      !food ||
      typeof food.name !== "string" ||
      !food.name.trim() ||
      typeof food.quantity !== "string" ||
      !food.quantity.trim()
    ) {
      throw new Error("Each food must have a name and quantity");
    }

    for (const field of ["calories", "protein", "carbs", "fat"]) {
      if (!validNumber(food[field])) {
        throw new Error(`Invalid nutrition value: ${field}`);
      }
    }

    return {
      name: food.name.trim(),
      quantity: food.quantity.trim(),
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
    };
  });

  const round = (value) => Math.round(value * 100) / 100;

  const totals = foods.reduce(
    (acc, food) => {
      acc.calories += food.calories;
      acc.protein += food.protein;
      acc.carbs += food.carbs;
      acc.fat += food.fat;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );

  const analysis = {
    foods,
    totals: {
      calories: round(totals.calories),
      protein: round(totals.protein),
      carbs: round(totals.carbs),
      fat: round(totals.fat),
    },
  };

  const meal = await mealRepository.saveMealWithFoods(
    {
      userId: data.userId,
      mealType: data.mealType,
      mealText: data.mealText.trim(),
      totalCalories: analysis.totals.calories,
      totalProtein: analysis.totals.protein,
      totalCarbs: analysis.totals.carbs,
      totalFat: analysis.totals.fat,
    },
    analysis.foods,
  );

  return { meal, analysis };
}

async function getRecentMeals(userId, date) {
  return await mealRepository.getRecentMeals(userId, date);
}

async function deleteMeal(mealId, userId) {
  const meal = await mealRepository.deleteMeal(mealId, userId);

  if (!meal) {
    throw new Error("Meal not found");
  }

  return meal;
}

module.exports = {
  analyzeMeal,
  saveAnalyzedMeal,
  getRecentMeals,
  deleteMeal,
};
