const model = require("../../config/gemini");
const { buildFallbackMealPrompt } = require("./prompts/mealPrompt");
const parseMealResponse = require("./parsers/mealParser");
const { parseMealText } = require("./services/mealTextParser");

async function testGemini(prompt) {
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

async function analyzeMealText(mealText) {
  const { matched, unmatched } = parseMealText(mealText);

  let aiFoods = [];

  if (unmatched.length > 0) {
    const prompt = buildFallbackMealPrompt(unmatched.map((u) => u.raw));
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiResult = parseMealResponse(response.text());
    aiFoods = aiResult.foods || [];
  }

  const foods = [...matched, ...aiFoods];

  const totals = foods.reduce(
    (acc, f) => ({
      calories: acc.calories + Number(f.calories || 0),
      protein: acc.protein + Number(f.protein || 0),
      carbs: acc.carbs + Number(f.carbs || 0),
      fat: acc.fat + Number(f.fat || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const round = (n) => Math.round(n * 100) / 100;

  return {
    foods,
    totals: {
      calories: round(totals.calories),
      protein: round(totals.protein),
      carbs: round(totals.carbs),
      fat: round(totals.fat),
    },
  };
}

module.exports = {
  testGemini,
  analyzeMealText,
};