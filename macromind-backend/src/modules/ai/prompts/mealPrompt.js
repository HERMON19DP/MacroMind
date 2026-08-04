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
You are a nutrition analysis AI.

Estimate nutrition for ONLY the following food items. Treat each line as one entry, using the quantity described in the text.

Items:
${items.map((i) => `- ${i}`).join("\n")}

Return ONLY valid JSON in this format:

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
  ]
}

Do not return markdown.
Do not return explanations.
Return JSON only.
`;
}

module.exports = { buildMealPrompt, buildFallbackMealPrompt };