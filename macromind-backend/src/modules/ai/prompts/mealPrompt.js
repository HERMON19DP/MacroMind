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

module.exports = buildMealPrompt;