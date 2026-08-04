const fs = require("fs");

const { GoogleGenerativeAI } = require("@google/generative-ai");

const { buildPhotoMealPrompt } = require("../ai/prompts/photoMealPrompt");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const parseMealResponse = require("../ai/parsers/mealParser");
const { overrideWithLookup } = require("../ai/services/foodLookup.service");

async function analyzePhoto(imagePath) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      temperature: 0,
      topP: 1,
      topK: 1,
    },
  });

  const imageBuffer = fs.readFileSync(imagePath);

  const result = await model.generateContent([
    buildPhotoMealPrompt(),
    {
      inlineData: {
        data: imageBuffer.toString("base64"),
        mimeType: "image/jpeg",
      },
    },
  ]);

  const analysis = parseMealResponse(result.response.text());
  const foods = overrideWithLookup(analysis.foods || []);

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
  analyzePhoto,
};