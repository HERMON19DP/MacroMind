const { FOOD_LOOKUP, FOOD_ALIASES } = require("../data/foodLookup");

const UNIT_ALIASES = {
  pc: "piece",
  pcs: "piece",
  pieces: "piece",
  slice: "slice",
  slices: "slice",
  gram: "g",
  grams: "g",
  gm: "g",
  kilogram: "kg",
  kilograms: "kg",
  milliliter: "ml",
  milliliters: "ml",
  millilitre: "ml",
  millilitres: "ml",
  liter: "l",
  liters: "l",
  litre: "l",
  litres: "l",
  bowls: "bowl",
  cups: "cup",
  glasses: "glass",
  plates: "plate",
  servings: "serving",
};

const NUMBER_WORDS = {
  a: 1,
  an: 1,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  half: 0.5,
};

function normalizeFoodText(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFKC")
    .replace(/(\d)([a-z])/gi, "$1 $2")
    .replace(/([a-z])(\d)/gi, "$1 $2")
    .replace(/[()[\]{}]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseQuantityAndUnit(text) {
  const normalized = normalizeFoodText(text);
  const tokens = normalized.split(/\s+/).filter(Boolean);

  let quantity = 1;
  let unit = null;
  let idx = 0;

  const first = tokens[0];

  if (first && /^\d+(?:\.\d+)?$/.test(first)) {
    quantity = Number(first);
    idx = 1;
  } else if (
    first &&
    Object.prototype.hasOwnProperty.call(NUMBER_WORDS, first)
  ) {
    quantity = NUMBER_WORDS[first];
    idx = 1;
  }

  // Supports descriptions such as "2 of idlis".
  if (tokens[idx] === "of") {
    idx++;
  }

  const candidate = tokens[idx];

  if (candidate) {
    const normalizedUnit = UNIT_ALIASES[candidate] || candidate;

    if (
      [
        "piece",
        "slice",
        "g",
        "kg",
        "ml",
        "l",
        "bowl",
        "cup",
        "glass",
        "plate",
        "serving",
      ].includes(normalizedUnit)
    ) {
      unit = normalizedUnit;
      idx++;
    }
  }

  return {
    quantity,
    unit,
    rest: tokens.slice(idx).join(" ").trim(),
  };
}

function resolveFoodKey(name) {
  const cleaned = normalizeFoodText(name);

  if (!cleaned) return null;

  if (FOOD_ALIASES[cleaned]) {
    return FOOD_ALIASES[cleaned];
  }

  if (FOOD_LOOKUP[cleaned]) {
    return cleaned;
  }

  const singular = cleaned.endsWith("s") ? cleaned.slice(0, -1) : cleaned;

  if (FOOD_ALIASES[singular]) {
    return FOOD_ALIASES[singular];
  }

  if (FOOD_LOOKUP[singular]) {
    return singular;
  }

  return null;
}

function computeNutrition(key, quantity = 1, unit = null) {
  const item = FOOD_LOOKUP[key];

  if (!item) return null;

  quantity = Number(quantity);

  if (!Number.isFinite(quantity) || quantity < 0) {
    return null;
  }

  if (quantity === 0) {
    return {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    };
  }

  const normalizedUnit = unit
    ? UNIT_ALIASES[String(unit).toLowerCase()] || String(unit).toLowerCase()
    : null;

  let multiplier;

  // Per-100g foods, e.g. rice, paneer and mushrooms.
  if (item.unit === "100g") {
    if (normalizedUnit === "g") {
      multiplier = quantity / 100;
    } else if (normalizedUnit === "kg") {
      multiplier = quantity * 10;
    } else if (normalizedUnit === null || normalizedUnit === "serving") {
      // Default reference portion is 100 g.
      multiplier = quantity;
    } else {
      return null;
    }
  }

  // Per-100ml foods, e.g. sambar, milk and buttermilk.
  else if (item.unit === "100ml") {
    if (normalizedUnit === "ml") {
      multiplier = quantity / 100;
    } else if (normalizedUnit === "l") {
      multiplier = quantity * 10;
    } else if (normalizedUnit === null || normalizedUnit === "serving") {
      // Default reference portion is 100 ml.
      multiplier = quantity;
    } else {
      return null;
    }
  }

  // Per-10g entries, e.g. butter.
  else if (item.unit === "10g") {
    if (normalizedUnit === "g") {
      multiplier = quantity / 10;
    } else if (normalizedUnit === null) {
      multiplier = quantity;
    } else {
      return null;
    }
  }

  // Per-250ml entries, e.g. juice.
  else if (item.unit === "250ml") {
    if (normalizedUnit === "ml") {
      multiplier = quantity / 250;
    } else if (normalizedUnit === null) {
      multiplier = quantity;
    } else {
      return null;
    }
  }

  // Countable foods and catalog serving estimates.
  else {
    const isCountUnit = [
      "piece",
      "slice",
      "serving",
      "bowl",
      "cup",
      "glass",
      "plate",
    ].includes(normalizedUnit);

    if (normalizedUnit === "g" || normalizedUnit === "kg") {
      if (!item.gramsPerServing) {
        return null;
      }

      const grams = normalizedUnit === "kg" ? quantity * 1000 : quantity;

      multiplier = grams / item.gramsPerServing;
    } else if (normalizedUnit === "ml" || normalizedUnit === "l") {
      // Do not assume a food's volume-to-weight conversion.
      return null;
    } else if (
      normalizedUnit === null ||
      normalizedUnit === item.unit ||
      isCountUnit
    ) {
      // For household measures, use the documented standard
      // serving estimate. One bowl/cup/plate is one serving.
      multiplier = quantity;
    } else {
      return null;
    }
  }

  const round = (value) => Math.round(value * multiplier * 100) / 100;

  return {
    calories: round(item.calories),
    protein: round(item.protein),
    carbs: round(item.carbs),
    fat: round(item.fat),
  };
}

function buildQuantityLabel(quantity, unit, key = null) {
  if (unit) {
    return `${quantity} ${unit}`;
  }

  if (key && FOOD_LOOKUP[key]) {
    const item = FOOD_LOOKUP[key];
    const defaultUnit =
      item.unit === "piece"
        ? "piece(s)"
        : item.unit === "slice"
          ? "slice(s)"
          : "serving(s)";

    return `${quantity} ${defaultUnit}`;
  }

  return quantity === 1 ? "1 serving" : `${quantity} servings`;
}

// Used for photo analysis. Lookup values replace Gemini's macros
// only when the food is recognized and the supplied quantity can
// be interpreted safely.
function overrideWithLookup(foods) {
  return foods.map((food) => {
    const key = resolveFoodKey(food.name);

    if (!key) {
      return {
        ...food,
        source: "llm",
      };
    }

    const parsed = parseQuantityAndUnit(food.quantity || "");
    const nutrition = computeNutrition(key, parsed.quantity, parsed.unit);

    if (!nutrition) {
      return {
        ...food,
        source: "llm",
      };
    }

    return {
      ...food,
      name: FOOD_LOOKUP[key].display,
      ...nutrition,
      source: "lookup",
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
  normalizeFoodText,
};
