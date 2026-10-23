const {
  parseQuantityAndUnit,
  resolveFoodKey,
  computeNutrition,
  buildQuantityLabel,
  FOOD_LOOKUP,
} = require("./foodLookup.service");

const FILLER_PREFIX =
  /^(?:(?:please\s+)?(?:log|track|record)\s+|(?:i\s+)?(?:ate|had|drank|consumed|took|finished)\s+|(?:just|also)\s+)+/i;

const FILLER_QUANTITIES =
  /^(?:a little|a bit of|some|a few|approximately|approx\.?|about|around)\s+/i;

const MEAL_SUFFIX =
  /\s+for\s+(?:my\s+)?(?:breakfast|lunch|dinner|snacks?|brunch)\s*$/i;

function normalizeSegment(text) {
  return text
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[()[\]{}]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stripFillerWords(text) {
  let cleaned = normalizeSegment(text);

  cleaned = cleaned.replace(FILLER_PREFIX, "");
  cleaned = cleaned.replace(FILLER_QUANTITIES, "");
  cleaned = cleaned.replace(/^(?:of|the)\s+/i, "");
  cleaned = cleaned.replace(MEAL_SUFFIX, "");

  return cleaned.trim();
}

/**
 * Split on strong separators first.
 * For "and"/"with", prefer keeping a phrase together if it matches
 * a known food name or alias, such as "macaroni and cheese".
 */
function splitMealText(text) {
  if (typeof text !== "string" || !text.trim()) {
    return [];
  }

  const strongSegments = text
    .split(/[,;\n+]+/)
    .map((segment) => segment.trim())
    .filter(Boolean);

  const result = [];

  for (const segment of strongSegments) {
    const parts = segment
      .split(/\s+\b(?:and|with)\b\s+/i)
      .map((part) => part.trim())
      .filter(Boolean);

    const merged = [];

    for (const part of parts) {
      if (merged.length === 0) {
        merged.push(part);
        continue;
      }

      const previous = merged[merged.length - 1];
      const combined = `${previous} and ${part}`;

      // Preserve a known multiword dish name instead of splitting it.
      if (resolveFoodKey(normalizeSegment(combined))) {
        merged[merged.length - 1] = combined;
      } else {
        merged.push(part);
      }
    }

    result.push(...merged);
  }

  return result;
}

function aggregateMatchedFoods(items) {
  const grouped = new Map();

  for (const item of items) {
    const groupKey = `${item.key}:${item.unit || "default"}`;
    const existing = grouped.get(groupKey);

    if (existing) {
      existing.quantity += item.quantity;
    } else {
      grouped.set(groupKey, {
        key: item.key,
        quantity: item.quantity,
        unit: item.unit || null,
      });
    }
  }

  return [...grouped.values()].map(({ key, quantity, unit }) => {
    const item = FOOD_LOOKUP[key];
    const nutrition = computeNutrition(key, quantity, unit);

    return {
      name: item.display,
      quantity: buildQuantityLabel(quantity, unit, key),
      ...nutrition,
    };
  });
}

function parseMealText(text) {
  const segments = splitMealText(text);
  const matched = [];
  const unmatched = [];

  for (const raw of segments) {
    const cleaned = stripFillerWords(raw);

    if (!cleaned) {
      continue;
    }

    const { quantity, unit, rest } = parseQuantityAndUnit(cleaned);
    const key = resolveFoodKey(rest);

    if (!key) {
      unmatched.push({ raw: raw.trim() });
      continue;
    }

    const nutrition = computeNutrition(key, quantity, unit);

    // Preserve the original text for AI fallback if lookup cannot
    // calculate nutrition for this quantity/unit combination.
    if (!nutrition) {
      unmatched.push({ raw: raw.trim() });
      continue;
    }

    const item = FOOD_LOOKUP[key];

    matched.push({
      key,
      quantity,
      unit: unit || null,
    });
  }

  return {
    matched: aggregateMatchedFoods(matched),
    unmatched,
  };
}

module.exports = {
  parseMealText,
  splitMealText,
  stripFillerWords,
};
