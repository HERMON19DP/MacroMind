const dashboardRepository = require("./dashboard.repository");

const userGoalsRepository = require("../users/userGoals.repository");

async function getTodaySummary(userId) {
  const summary = await dashboardRepository.getTodaySummary(userId);

  const goals = await userGoalsRepository.getGoals(userId);

  const calories = Number(summary.calories);

  const protein = Number(summary.protein);

  const carbs = Number(summary.carbs);

  const fat = Number(summary.fat);

  return {
    consumed: {
      calories,
      protein,
      carbs,
      fat,
    },

    goals: {
      calories: goals.calorie_goal,
      protein: goals.protein_goal,
      carbs: goals.carb_goal,
      fat: goals.fat_goal,
    },

    remaining: {
      calories: goals.calorie_goal - calories,

      protein: goals.protein_goal - protein,

      carbs: goals.carb_goal - carbs,

      fat: goals.fat_goal - fat,
    },

    progress: {
      calories: (calories / goals.calorie_goal) * 100,

      protein: (protein / goals.protein_goal) * 100,

      carbs: (carbs / goals.carb_goal) * 100,

      fat: (fat / goals.fat_goal) * 100,
    },
  };
}

async function getWeeklySummary(userId) {
  const rows = await dashboardRepository.getWeeklySummary(userId);

  return rows.map((row) => ({
    date: row.date,

    calories: Number(row.calories),

    protein: Number(row.protein),

    carbs: Number(row.carbs),

    fat: Number(row.fat),
  }));
}

module.exports = {
  getTodaySummary,
  getWeeklySummary
};
