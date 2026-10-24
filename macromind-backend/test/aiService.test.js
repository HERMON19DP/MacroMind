const test = require("node:test");
const assert = require("node:assert/strict");

const client = require("../src/config/openai");
const aiService = require("../src/modules/ai/ai.service");

const originalCreate = client.responses.create;

test.afterEach(() => {
  client.responses.create = originalCreate;
});

test("does not call OpenAI when every food is recognized", async () => {
  let called = false;

  client.responses.create = async () => {
    called = true;
    throw new Error("OpenAI should not have been called");
  };

  const result = await aiService.analyzeMealText("2 idlis");

  assert.equal(called, false);
  assert.equal(result.foods.length, 1);
  assert.equal(result.totals.calories, 116);
});

test("sends only unmatched foods to OpenAI", async () => {
  let capturedPrompt = "";

  client.responses.create = async ({ input }) => {
    capturedPrompt = input;

    return {
      output_text: JSON.stringify({
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
  client.responses.create = async () => ({
    output_text: JSON.stringify({
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

test("rejects malformed OpenAI JSON", async () => {
  client.responses.create = async () => ({
    output_text: "This is not JSON",
  });

  await assert.rejects(aiService.analyzeMealText("1 unfamiliar regional dish"));
});

test("rejects empty meal text", async () => {
  await assert.rejects(
    aiService.analyzeMealText("   "),
    /Meal text is required/,
  );
});
