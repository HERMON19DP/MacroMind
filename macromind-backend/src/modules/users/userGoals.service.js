const repository = require("./userGoals.repository");

async function getGoals(userId) {
  return await repository.getGoals(userId);
}

async function updateGoals(userId, goals) {
  const existing = await repository.getGoals(userId);

  const merged = {
    calorieGoal: goals.calorieGoal ?? existing?.calorie_goal ?? 2200,
    proteinGoal: goals.proteinGoal ?? existing?.protein_goal ?? 120,
    carbGoal: goals.carbGoal ?? existing?.carb_goal ?? 250,
    fatGoal: goals.fatGoal ?? existing?.fat_goal ?? 70,
  };

  return await repository.upsertGoals(userId, merged);
}

module.exports = {
  getGoals,
  updateGoals,
};