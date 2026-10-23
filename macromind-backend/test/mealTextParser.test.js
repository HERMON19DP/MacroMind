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

test("aggregates repeated idlis into one food entry", () => {
  const result = parseMealText("2 idlis, 1 idli");

  assert.equal(result.matched.length, 1);
  assert.equal(result.matched[0].name, "Idli");
  assert.equal(result.matched[0].quantity, "3 piece(s)");
  assert.equal(result.matched[0].calories, 174);
  assert.equal(result.unmatched.length, 0);
});

test("aggregates repeated foods across aliases", () => {
  const result = parseMealText("2 idlis, 1 idli");

  assert.equal(result.matched.length, 1);
  assert.equal(result.matched[0].calories, 174);
});

test("keeps different foods separate", () => {
  const result = parseMealText("2 idlis, 1 dosa");

  assert.equal(result.matched.length, 2);
  assert.equal(
    result.matched.reduce((sum, food) => sum + food.calories, 0),
    266,
  );
});

test("aggregates repeated idlis in a natural meal description", () => {
  const result = parseMealText("ate 2 idlis with sambar and 1 idli");

  const idlis = result.matched.filter((food) => food.name === "Idli");
  const sambar = result.matched.filter((food) => food.name === "Sambar");

  assert.equal(idlis.length, 1);
  assert.equal(idlis[0].calories, 174);
  assert.equal(sambar.length, 1);
});
