const test = require("node:test");
const assert = require("node:assert/strict");

const { parseMealText } = require("../src/modules/ai/services/mealTextParser");

test("parses a numeric quantity for idlis", () => {
  const result = parseMealText("2 idlis");

  assert.equal(result.matched.length, 1);
  assert.equal(result.matched[0].name, "Idli");
  assert.equal(result.matched[0].calories, 116);
  assert.equal(result.unmatched.length, 0);
});

test("parses a leading command and number words", () => {
  const result = parseMealText("please track one dosa, two boiled eggs");

  assert.equal(result.matched.length, 2);
  assert.equal(result.matched[0].name, "Dosa");
  assert.equal(result.matched[1].name, "Egg");
  assert.equal(result.unmatched.length, 0);
});

test("scales nutrition for multiple recognized foods", () => {
  const result = parseMealText("2 idlis and 1 dosa");

  assert.equal(result.matched.length, 2);

  const totalCalories = result.matched.reduce(
    (sum, food) => sum + food.calories,
    0,
  );

  assert.equal(totalCalories, 266);
});

test("preserves an unknown food for AI fallback", () => {
  const result = parseMealText("1 unfamiliar regional dish");

  assert.equal(result.matched.length, 0);
  assert.equal(result.unmatched.length, 1);
  assert.equal(result.unmatched[0].raw, "1 unfamiliar regional dish");
});

test("handles empty input", () => {
  const result = parseMealText("");

  assert.deepEqual(result, {
    matched: [],
    unmatched: [],
  });
});

test("handles whitespace-only input", () => {
  const result = parseMealText("   ");

  assert.deepEqual(result, {
    matched: [],
    unmatched: [],
  });
});
