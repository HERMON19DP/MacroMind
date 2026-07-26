const model = require("../../config/gemini");
const buildMealPrompt = require("./prompts/mealPrompt");
const parseMealResponse = require("./parsers/mealParser");

async function testGemini(prompt) {
  const result = await model.generateContent(prompt);

  const response = await result.response;

  return response.text();
}

async function analyzeMealText(mealText) {
  const prompt = buildMealPrompt(mealText);

  const result = await model.generateContent(prompt);

  const response = await result.response;

  return parseMealResponse(response.text());
}

module.exports = {
  testGemini,
  analyzeMealText,
};
