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

function stripFillerWords(text) {
  let cleaned = text.trim();

  // "I ate...", "I had...", "I drank..." etc.
  cleaned = cleaned.replace(/^i\s+/i, "");

  // leading verbs: "ate", "had", "drank", "consumed", "took", "finished"
  cleaned = cleaned.replace(/^(just\s+)?(ate|had|drank|consumed|took|finished)\s+/i, "");

  // leading "of"
  cleaned = cleaned.replace(/^of\s+/i, "");

  // trailing "for breakfast/lunch/dinner/snacks"
  cleaned = cleaned.replace(/\s+for\s+(breakfast|lunch|dinner|snacks?)\s*$/i, "");

  return cleaned.trim();
}

function parseMealText(text) {
  const segments = splitMealText(text);

  const matched = [];
  const unmatched = [];

  segments.forEach((raw) => {
    const cleaned = stripFillerWords(raw);
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