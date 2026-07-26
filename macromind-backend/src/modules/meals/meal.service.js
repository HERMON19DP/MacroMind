const aiService = require("../ai/ai.service");
const mealRepository = require("./meal.repository");

async function analyzeMeal(text) {
  return await aiService.analyzeMealText(text);
}

async function saveAnalyzedMeal(data) {
  const meal = await mealRepository.createMeal({
    userId: data.userId,
    mealType: data.mealType,
    mealText: data.mealText,
    totalCalories: data.analysis.totals.calories,
    totalProtein: data.analysis.totals.protein,
    totalCarbs: data.analysis.totals.carbs,
    totalFat: data.analysis.totals.fat,
  });

  for (const food of data.analysis.foods) {
    await mealRepository.createMealFood({
      mealId: meal.id,
      ...food,
    });
  }

  return {
    meal,
    analysis: data.analysis,
  };
}

async function getRecentMeals(userId) {
  return await mealRepository.getRecentMeals(userId);
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