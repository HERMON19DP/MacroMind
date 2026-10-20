const repository = require("./userGoals.repository");
const userRepository = require("./user.repository");
const { calculateSuggestedMacros } = require("./calorieCalculator");

async function getGoals(userId) {
  return await repository.getGoals(userId);
}

async function updateGoals(userId, goals) {
  const existing = await repository.getGoals(userId);

  const calorieGoal = goals.calorieGoal ?? existing?.calorie_goal ?? 2200;

  let macros;

  // Recalculate macros whenever the calorie target is changed.
  if (goals.calorieGoal != null) {
    const profile = await userRepository.getById(userId);

    if (profile?.weight_kg != null) {
      macros = calculateSuggestedMacros({
        weight: Number(profile.weight_kg),
        calorieGoal: Number(calorieGoal),
      });
    }
  }

  const merged = {
    calorieGoal,
    proteinGoal:
      goals.proteinGoal ?? macros?.proteinGoal ?? existing?.protein_goal ?? 120,
    carbGoal: goals.carbGoal ?? macros?.carbGoal ?? existing?.carb_goal ?? 250,
    fatGoal: goals.fatGoal ?? macros?.fatGoal ?? existing?.fat_goal ?? 70,
  };

  return await repository.upsertGoals(userId, merged);
}

module.exports = {
  getGoals,
  updateGoals,
};
