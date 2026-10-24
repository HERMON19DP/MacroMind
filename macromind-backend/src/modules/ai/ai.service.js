const client = require("../../config/openai");
const { buildFallbackMealPrompt } = require("./prompts/mealPrompt");
const parseMealResponse = require("./parsers/mealParser");
const { parseMealText } = require("./services/mealTextParser");
const {
  resolveFoodKey,
  computeNutrition,
  parseQuantityAndUnit,
  buildQuantityLabel,
  FOOD_LOOKUP,
} = require("./services/foodLookup.service");
const MAX_MEAL_TEXT_LENGTH = 100;

const NUTRIENT_FIELDS = ["calories", "protein", "carbs", "fat"];

async function testOpenAI(prompt) {
  const response = await client.responses.create({
    model: "gpt-6-luna",
    reasoning: {
      effort: "none",
    },
    input: prompt,
  });

  return response.output_text;
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

function normalizeFoodName(name) {
  return String(name || "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[()[\]{}]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function mergeAndNormalizeFoods(matched, aiFoods) {
  const grouped = new Map();

  function addFood(food, isAiFood = false) {
    const key = resolveFoodKey(food.name);

    if (key) {
      // Prefer the local lookup's nutrition whenever the quantity
      // can be interpreted safely.
      const parsed = parseQuantityAndUnit(food.quantity);
      const nutrition = computeNutrition(key, parsed.quantity, parsed.unit);

      if (nutrition) {
        const groupKey = `lookup:${key}:${parsed.unit || FOOD_LOOKUP[key].unit}`;

        const existing = grouped.get(groupKey);

        if (existing) {
          existing.quantity += parsed.quantity;
        } else {
          grouped.set(groupKey, {
            key,
            quantity: parsed.quantity,
            unit: parsed.unit,
            source: "lookup",
          });
        }

        return;
      }
    }

    // Preserve unrecognized foods, using their normalized name and
    // quantity as a grouping key. Do not invent local nutrition data.
    const name = normalizeFoodName(food.name);
    const quantity = String(food.quantity || "").trim();
    const groupKey = `ai:${name}:${quantity}`;

    if (!grouped.has(groupKey)) {
      grouped.set(groupKey, {
        name: food.name.trim(),
        quantity,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fat: food.fat,
        source: isAiFood ? "llm" : food.source || "llm",
      });
    }
  }

  matched.forEach((food) => addFood(food));
  aiFoods.forEach((food) => addFood(food, true));

  return [...grouped.values()].map((food) => {
    if (food.source !== "lookup") {
      const { source, ...result } = food;
      return result;
    }

    const nutrition = computeNutrition(food.key, food.quantity, food.unit);

    return {
      name: FOOD_LOOKUP[food.key].display,
      quantity: buildQuantityLabel(food.quantity, food.unit, food.key),
      ...nutrition,
    };
  });
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

    const response = await client.responses.create({
      model: "gpt-6-luna",
      reasoning: {
        effort: "none",
      },
      temperature: 0,
      text: {
        format: {
          type: "json_object",
        },
      },
      input: prompt,
    });

    const aiResult = parseMealResponse(response.output_text);

    if (!aiResult || !Array.isArray(aiResult.foods)) {
      throw new Error("AI returned an invalid meal analysis");
    }

    aiFoods = aiResult.foods.map(normalizeAiFood).filter(Boolean);
  }

  const foods = mergeAndNormalizeFoods(matched, aiFoods);

  return {
    foods,
    totals: calculateTotals(foods),
  };
}

module.exports = {
  testOpenAI,
  analyzeMealText,
};
