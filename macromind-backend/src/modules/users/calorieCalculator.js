const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
  extra_active: 1.9,
};

const DEFAULT_ACTIVITY_LEVEL = "lightly_active";

const DEFAULT_GOAL_RATE_KG_WEEK = 0.5;
const KCAL_PER_KG = 7700;

const MIN_CALORIES = 1200;
const MAX_CALORIES = 4000;

function calculateBMR({ weight, height, age, gender }) {
  const base = 10 * weight + 6.25 * height - 5 * age;
  return gender === "female" ? base - 161 : base + 5;
}

function calculateSuggestedCalories({
  weight,
  height,
  age,
  gender,
  goal,
  activityLevel = DEFAULT_ACTIVITY_LEVEL,
  goalRateKgWeek,
}) {
  if (
    !Number.isFinite(Number(weight)) ||
    !Number.isFinite(Number(height)) ||
    !Number.isFinite(Number(age)) ||
    !gender ||
    Number(weight) <= 0 ||
    Number(height) <= 0 ||
    Number(age) <= 0
  ) {
    return null;
  }

  const normalizedGender = String(gender).toLowerCase();
  if (!["male", "female"].includes(normalizedGender)) {
    return null;
  }

  const multiplier =
    ACTIVITY_MULTIPLIERS[activityLevel] ??
    ACTIVITY_MULTIPLIERS[DEFAULT_ACTIVITY_LEVEL];

  const bmr = calculateBMR({
    weight: Number(weight),
    height: Number(height),
    age: Number(age),
    gender: normalizedGender,
  });

  const maintenanceCalories = bmr * multiplier;

  const rate = Number(goalRateKgWeek);
  const validRate = [0.25, 0.5, 1].includes(rate)
    ? rate
    : DEFAULT_GOAL_RATE_KG_WEEK;

  // Approximate daily calorie adjustment for the selected weekly rate.
  const dailyAdjustment = (validRate * KCAL_PER_KG) / 7;

  let adjustment = 0;

  if (goal === "Lose weight") {
    adjustment = -dailyAdjustment;
  } else if (goal === "Gain weight") {
    adjustment = dailyAdjustment;
  } else if (goal !== "Maintain weight") {
    return null;
  }

  let suggested = Math.round((maintenanceCalories + adjustment) / 50) * 50;

  suggested = Math.min(Math.max(suggested, MIN_CALORIES), MAX_CALORIES);

  return suggested;
}

function calculateSuggestedMacros({ weight, calorieGoal }) {
  const bodyWeight = Number(weight);
  const calories = Number(calorieGoal);

  if (
    !Number.isFinite(bodyWeight) ||
    !Number.isFinite(calories) ||
    bodyWeight <= 0 ||
    calories <= 0
  ) {
    return null;
  }

  // General starting estimates, not individualized medical advice.
  // Protein: approximately 1.6 g/kg.
  // Fat: approximately 0.8 g/kg.
  const proteinGoal = Math.round(
    Math.min(bodyWeight * 1.6, (calories * 0.35) / 4),
  );

  const fatGoal = Math.round(Math.min(bodyWeight * 0.8, (calories * 0.35) / 9));

  // Allocate remaining calories to carbohydrates.
  const remainingCalories = calories - proteinGoal * 4 - fatGoal * 9;

  const carbGoal = Math.max(0, Math.round(remainingCalories / 4));

  return {
    proteinGoal,
    carbGoal,
    fatGoal,
  };
}

module.exports = {
  calculateBMR,
  calculateSuggestedCalories,
  calculateSuggestedMacros,
};
