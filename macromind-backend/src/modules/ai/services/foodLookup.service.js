const { FOOD_LOOKUP, FOOD_ALIASES } = require("../data/foodLookup");

const UNIT_WORDS = [
  "pieces", "piece", "pcs", "pc",
  "ml", "milliliters", "millilitres",
  "g", "gram", "grams", "gm",
  "bowls", "bowl",
  "cups", "cup",
  "glasses", "glass",
  "plates", "plate",
  "slices", "slice",
  "servings", "serving",
];

const NUMBER_WORDS = {
  a: 1, an: 1, one: 1, two: 2, three: 3, four: 4,
  five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
};

function parseQuantityAndUnit(text) {
  const tokens = text.trim().toLowerCase().split(/\s+/).filter(Boolean);

  let quantity = 1;
  let unit = null;
  let idx = 0;

  if (tokens[0] && /^\d+(\.\d+)?$/.test(tokens[0])) {
    quantity = parseFloat(tokens[0]);
    idx = 1;
  } else if (tokens[0] && NUMBER_WORDS[tokens[0]] !== undefined) {
    quantity = NUMBER_WORDS[tokens[0]];
    idx = 1;
  }

  if (tokens[idx] && UNIT_WORDS.includes(tokens[idx])) {
    unit = tokens[idx];
    idx += 1;
  }

  const rest = tokens.slice(idx).join(" ").trim();

  return { quantity, unit, rest };
}

function resolveFoodKey(name) {
  const cleaned = (name || "").trim().toLowerCase();

  if (!cleaned) return null;

  if (FOOD_ALIASES[cleaned]) return FOOD_ALIASES[cleaned];
  if (FOOD_LOOKUP[cleaned]) return cleaned;

  if (cleaned.endsWith("s")) {
    const singular = cleaned.slice(0, -1);
    if (FOOD_ALIASES[singular]) return FOOD_ALIASES[singular];
    if (FOOD_LOOKUP[singular]) return singular;
  }

  return null;
}

function computeNutrition(key, quantity, unit) {
  const item = FOOD_LOOKUP[key];
  if (!item) return null;

  let multiplier = quantity;

  if (item.unit === "100g" && unit && /^g|gram/.test(unit)) {
    multiplier = quantity / 100;
  } else if (item.unit === "100ml" && unit && /ml|milli/.test(unit)) {
    multiplier = quantity / 100;
  }

  const round = (n) => Math.round(n * 100) / 100;

  return {
    calories: round(item.calories * multiplier),
    protein: round(item.protein * multiplier),
    carbs: round(item.carbs * multiplier),
    fat: round(item.fat * multiplier),
  };
}

function buildQuantityLabel(quantity, unit) {
  if (unit) return `${quantity} ${unit}`;
  if (quantity !== 1) return `${quantity}`;
  return "";
}

// Used for photo results: AI supplies name + quantity text (e.g. "150 ml"),
// we override the macros if the food is recognized.
function overrideWithLookup(foods) {
  return foods.map((food) => {
    const key = resolveFoodKey(food.name);
    if (!key) return food;

    const { quantity, unit } = parseQuantityAndUnit(food.quantity || "");
    const nutrition = computeNutrition(key, quantity || 1, unit);
    if (!nutrition) return food;

    return {
      ...food,
      name: FOOD_LOOKUP[key].display,
      ...nutrition,
    };
  });
}

module.exports = {
  parseQuantityAndUnit,
  resolveFoodKey,
  computeNutrition,
  buildQuantityLabel,
  overrideWithLookup,
  FOOD_LOOKUP,
};