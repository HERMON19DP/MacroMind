// Mifflin-St Jeor equation — the most accurate widely-used BMR formula.
const ACTIVITY_MULTIPLIER = 1.375; // light activity (default baseline; no activity-level field yet)

const GOAL_ADJUSTMENT_KCAL = {
  "Lose weight": -500,   // ~0.5kg/week deficit
  "Gain weight": 500,    // ~0.5kg/week surplus
  "Maintain weight": 0,
};

const MIN_CALORIES = 1200;
const MAX_CALORIES = 4000;

function calculateBMR({ weight, height, age, gender }) {
  const base = 10 * weight + 6.25 * height - 5 * age;
  return gender === "female" ? base - 161 : base + 5;
}

function calculateSuggestedCalories({ weight, height, age, gender, goal }) {
  if (!weight || !height || !age || !gender) {
    return null;
  }

  const bmr = calculateBMR({ weight, height, age, gender });
  const tdee = bmr * ACTIVITY_MULTIPLIER;
  const adjustment = GOAL_ADJUSTMENT_KCAL[goal] ?? 0;

  let suggested = Math.round((tdee + adjustment) / 50) * 50;
  suggested = Math.min(Math.max(suggested, MIN_CALORIES), MAX_CALORIES);

  return suggested;
}

module.exports = {
  calculateBMR,
  calculateSuggestedCalories,
};