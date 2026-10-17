const test = require("node:test");
const assert = require("node:assert/strict");

const model = require("../src/config/gemini");
const aiService = require("../src/modules/ai/ai.service");

const originalGenerateContent = model.generateContent;

test.afterEach(() => {
  model.generateContent = originalGenerateContent;
});

test("does not call Gemini when every food is recognized", async () => {
  let called = false;

  model.generateContent = async () => {
    called = true;
    throw new Error("Gemini should not have been called");
  };

  const result = await aiService.analyzeMealText("2 idlis");

  assert.equal(called, false);
  assert.equal(result.foods.length, 1);
  assert.equal(result.totals.calories, 116);
});

test("sends only unmatched foods to Gemini", async () => {
  let capturedPrompt = "";

  model.generateContent = async (prompt) => {
    capturedPrompt = prompt;

    return {
      response: {
        text: () =>
          JSON.stringify({
            foods: [
              {
                name: "Regional Dish",
                quantity: "1 serving",
                calories: 200,
                protein: 8,
                carbs: 25,
                fat: 7,
              },
            ],
          }),
      },
    };
  };

  const result = await aiService.analyzeMealText(
    "2 idlis, 1 unfamiliar regional dish",
  );

  assert.match(capturedPrompt, /unfamiliar regional dish/i);
  assert.doesNotMatch(capturedPrompt, /2 idlis/i);

  assert.equal(result.foods.length, 2);
  assert.equal(result.totals.calories, 316);
  assert.equal(result.totals.protein, 11.6);
});

test("recalculates totals from returned foods", async () => {
  model.generateContent = async () => ({
    response: {
      text: () =>
        JSON.stringify({
          foods: [
            {
              name: "Regional Dish",
              quantity: "1 serving",
              calories: 200,
              protein: 8,
              carbs: 25,
              fat: 7,
            },
          ],
        }),
    },
  });

  const result = await aiService.analyzeMealText(
    "2 idlis, 1 unfamiliar regional dish",
  );

  const sumCalories = result.foods.reduce(
    (sum, food) => sum + food.calories,
    0,
  );

  assert.equal(result.totals.calories, sumCalories);
});

test("rejects malformed Gemini JSON", async () => {
  model.generateContent = async () => ({
    response: {
      text: () => "This is not JSON",
    },
  });

  await assert.rejects(aiService.analyzeMealText("1 unfamiliar regional dish"));
});

test("rejects empty meal text", async () => {
  await assert.rejects(
    aiService.analyzeMealText("   "),
    /Meal text is required/,
  );
});
