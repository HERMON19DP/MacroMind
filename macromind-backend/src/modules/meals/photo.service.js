const fs = require("fs");

const client = require("../../config/openai");

const { buildPhotoMealPrompt } = require("../ai/prompts/photoMealPrompt");
const parseMealResponse = require("../ai/parsers/mealParser");
const { overrideWithLookup } = require("../ai/services/foodLookup.service");

async function analyzePhoto(imagePath) {
  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = imageBuffer.toString("base64");

  const response = await client.responses.create({
    model: "gpt-6-luna",
    reasoning: {
      effort: "none",
    },
    temperature: 0,
    text: {
      format: {
        type: "json_object",
      },
    },
    input: [
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: buildPhotoMealPrompt(),
          },
          {
            type: "input_image",
            image_url: `data:image/jpeg;base64,${base64Image}`,
            detail: "high",
          },
        ],
      },
    ],
  });

  const analysis = parseMealResponse(response.output_text);
  const foods = overrideWithLookup(analysis.foods || []);

  const totals = foods.reduce(
    (acc, food) => ({
      calories: acc.calories + Number(food.calories || 0),
      protein: acc.protein + Number(food.protein || 0),
      carbs: acc.carbs + Number(food.carbs || 0),
      fat: acc.fat + Number(food.fat || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );

  const round = (value) => Math.round(value * 100) / 100;

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
