const {
  parseQuantityAndUnit,
  resolveFoodKey,
  computeNutrition,
  buildQuantityLabel,
  FOOD_LOOKUP,
} = require("./foodLookup.service");

function splitMealText(text) {
  return text
    .split(/,|\band\b|\bwith\b|\+/i)
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseMealText(text) {
  const segments = splitMealText(text);

  const matched = [];
  const unmatched = [];

  segments.forEach((raw) => {
    const cleaned = raw.replace(/^of\s+/i, "");
    const { quantity, unit, rest } = parseQuantityAndUnit(cleaned);

    const key = resolveFoodKey(rest);

    if (!key) {
      unmatched.push({ raw });
      return;
    }

    const nutrition = computeNutrition(key, quantity, unit);
    const item = FOOD_LOOKUP[key];

    matched.push({
      name: item.display,
      quantity: buildQuantityLabel(quantity, unit),
      ...nutrition,
    });
  });

  return { matched, unmatched };
}

module.exports = { parseMealText }; 