const fs = require("fs");

const { GoogleGenerativeAI } = require("@google/generative-ai");

const { buildPhotoMealPrompt } = require("../ai/prompts/photoMealPrompt");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const parseMealResponse = require("../ai/parsers/mealParser");

async function analyzePhoto(imagePath) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
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

  return parseMealResponse(result.response.text());
}

module.exports = {
  analyzePhoto,
};
