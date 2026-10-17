function buildMealPrompt(mealText) {
  return `
You are a nutrition analysis AI.

Analyze the following meal.

Meal:
${mealText}

Return ONLY valid JSON.

Format:

{
  "foods": [
    {
      "name": "",
      "quantity": "",
      "calories": 0,
      "protein": 0,
      "carbs": 0,
      "fat": 0
    }
  ],
  "totals": {
    "calories": 0,
    "protein": 0,
    "carbs": 0,
    "fat": 0
  }
}

Do not return markdown.
Do not return explanations.
Return JSON only.
`;
}

function buildFallbackMealPrompt(items) {
  return `
You are a nutrition estimation component for MacroMind, a calorie-tracking application.

Estimate nutrition for ONLY the food entries listed below.

FOOD ENTRIES:
${items.map((item, index) => `${index + 1}. ${item}`).join("\n")}

RULES:
- Return exactly one food object for each listed entry.
- Do not add foods that are not listed.
- Do not combine separate entries.
- Preserve the quantity and unit from each entry.
- Estimate nutrition for the stated quantity, not automatically per 100g.
- Use reasonable standard serving estimates when the quantity is vague.
- For Indian foods, use an appropriate Indian preparation and serving estimate.
- Do not claim exact nutrition when the portion or recipe is uncertain.
- All nutrient values must be non-negative numbers.
- If an item is ambiguous, make a reasonable estimate based on its name.
- Return valid JSON only, with no Markdown or explanation.

RESPONSE FORMAT:
{
  "foods": [
    {
      "name": "Food name",
      "quantity": "Quantity and unit",
      "calories": 0,
      "protein": 0,
      "carbs": 0,
      "fat": 0
    }
  ]
}
`;
}

module.exports = { buildMealPrompt, buildFallbackMealPrompt };
