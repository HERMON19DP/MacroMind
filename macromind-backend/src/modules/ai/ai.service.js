const model = require("../../config/gemini");
const { buildFallbackMealPrompt } = require("./prompts/mealPrompt");
const parseMealResponse = require("./parsers/mealParser");
const { parseMealText } = require("./services/mealTextParser");
const MAX_MEAL_TEXT_LENGTH = 100;

const NUTRIENT_FIELDS = ["calories", "protein", "carbs", "fat"];

async function testGemini(prompt) {
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

function toFiniteNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : null;
}

function normalizeAiFood(food) {
  if (!food || typeof food !== "object" || Array.isArray(food)) {
    return null;
  }

  const name = typeof food.name === "string" ? food.name.trim() : "";
  const quantity =
    typeof food.quantity === "string" || typeof food.quantity === "number"
      ? String(food.quantity).trim()
      : "";

  if (!name || !quantity) {
    return null;
  }

  const normalized = { name, quantity };

  for (const field of NUTRIENT_FIELDS) {
    const value = toFiniteNumber(food[field]);

    // Reject incomplete or malformed nutrition estimates.
    if (value === null) {
      return null;
    }

    normalized[field] = value;
  }

  return normalized;
}

function calculateTotals(foods) {
  const totals = foods.reduce(
    (acc, food) => {
      for (const field of NUTRIENT_FIELDS) {
        acc[field] += food[field];
      }
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );

  const round = (value) => Math.round(value * 100) / 100;

  return {
    calories: round(totals.calories),
    protein: round(totals.protein),
    carbs: round(totals.carbs),
    fat: round(totals.fat),
  };
}

async function analyzeMealText(mealText) {
  if (typeof mealText !== "string" || !mealText.trim()) {
    throw new Error("Meal text is required");
  }

  if (mealText.length > MAX_MEAL_TEXT_LENGTH) {
    const error = new Error(
      "Your meal description is too long. Please keep it under 2,000 characters and try again.",
    );
    error.statusCode = 400;
    throw error;
  }

  const { matched, unmatched } = parseMealText(mealText);

  // Keep the rest of the existing implementation unchanged.

  let aiFoods = [];

  if (unmatched.length > 0) {
    const prompt = buildFallbackMealPrompt(unmatched.map((item) => item.raw));
    const result = await model.generateContent(prompt);
    const response = await result.response;

    const aiResult = parseMealResponse(response.text());

    if (!aiResult || !Array.isArray(aiResult.foods)) {
      throw new Error("AI returned an invalid meal analysis");
    }

    aiFoods = aiResult.foods.map(normalizeAiFood).filter(Boolean);
  }

  const foods = [...matched, ...aiFoods];

  return {
    foods,
    totals: calculateTotals(foods),
  };
}

module.exports = {
  testGemini,
  analyzeMealText,
};
