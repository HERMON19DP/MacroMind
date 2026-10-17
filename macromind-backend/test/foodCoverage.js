const { parseMealText } = require("../src/modules/ai/services/mealTextParser");

const corpus = [
  // Common breakfast foods
  { group: "Breakfast", text: "2 idlis" },
  { group: "Breakfast", text: "one dosa" },
  { group: "Breakfast", text: "2 pesarattu" },
  { group: "Breakfast", text: "one serving upma" },
  { group: "Breakfast", text: "one serving poha" },
  { group: "Breakfast", text: "3 vadas" },
  { group: "Breakfast", text: "3 rava bonda" },
  { group: "Breakfast", text: "one serving uggani" },
  { group: "Breakfast", text: "one serving pongal" },
  { group: "Breakfast", text: "2 bread slices" },

  // Rice, dal and traditional dishes
  { group: "Mess menu", text: "one serving white rice" },
  { group: "Mess menu", text: "one serving pulihora" },
  { group: "Mess menu", text: "one serving bisibele bath" },
  { group: "Mess menu", text: "one serving mudda pappu" },
  { group: "Mess menu", text: "one serving gongura dal" },
  { group: "Mess menu", text: "one serving pachi pulusu" },
  { group: "Mess menu", text: "one serving sambar" },
  { group: "Mess menu", text: "one serving rasam" },
  { group: "Mess menu", text: "one serving curd rice" },
  { group: "Mess menu", text: "one serving lemon rice" },

  // Curries and sides
  { group: "Mess menu", text: "one serving guthi vankaya" },
  { group: "Mess menu", text: "one serving vegetable kolhapuri" },
  { group: "Mess menu", text: "one serving paneer lababdar" },
  { group: "Mess menu", text: "one serving chicken mughlai" },
  { group: "Mess menu", text: "150 g chicken curry" },
  { group: "Mess menu", text: "120 g fish" },
  { group: "Mess menu", text: "75 g paneer" },
  { group: "Mess menu", text: "50 g mushroom" },
  { group: "Mess menu", text: "60 g egg bhurji" },
  { group: "Mess menu", text: "one serving dal fry" },

  // Everyday foods and drinks
  { group: "Everyday", text: "one banana" },
  { group: "Everyday", text: "one apple" },
  { group: "Everyday", text: "2 boiled eggs" },
  { group: "Everyday", text: "one glass milk" },
  { group: "Everyday", text: "one cup curd" },
  { group: "Everyday", text: "one cup tea" },
  { group: "Everyday", text: "one cup coffee" },
  { group: "Everyday", text: "one bowl rice" },
  { group: "Everyday", text: "100 g paneer" },
  { group: "Everyday", text: "one protein shake" },

  // Aliases and quantity variations
  { group: "Aliases", text: "2 dosai" },
  { group: "Aliases", text: "2 chapatis" },
  { group: "Aliases", text: "one plate steamed rice" },
  { group: "Aliases", text: "one serving sambhar" },
  { group: "Aliases", text: "one serving yogurt" },

  // More challenging inputs
  { group: "Edge cases", text: "a cup of sambar" },
  { group: "Edge cases", text: "a little curd rice" },
  { group: "Edge cases", text: "one and a half dosas" },
  { group: "Edge cases", text: "2 idlis and a cup of sambar for breakfast" },
  { group: "Edge cases", text: "rice with dal and curd" },
];

const results = corpus.map((entry) => {
  const parsed = parseMealText(entry.text);

  const fullyMatched =
    parsed.matched.length > 0 && parsed.unmatched.length === 0;

  const output = {
    ...entry,
    status: fullyMatched
      ? "LOCAL"
      : parsed.matched.length > 0
        ? "PARTIAL"
        : "FALLBACK",
    recognized: parsed.matched.map((food) => food.name).join(", "),
    unmatched: parsed.unmatched.map((food) => food.raw).join(" | "),
  };

  return output;
});

console.log("\n=== MACROMIND LOCAL FOOD COVERAGE ===\n");

for (const result of results) {
  console.log(`[${result.status.padEnd(7)}] [${result.group}] ${result.text}`);

  if (result.recognized) {
    console.log(`           Recognized: ${result.recognized}`);
  }

  if (result.unmatched) {
    console.log(`           Unmatched:  ${result.unmatched}`);
  }
}

console.log("\n=== SUMMARY ===\n");

const groups = [...new Set(corpus.map((item) => item.group))];

for (const group of groups) {
  const items = results.filter((item) => item.group === group);
  const local = items.filter((item) => item.status === "LOCAL").length;
  const partial = items.filter((item) => item.status === "PARTIAL").length;
  const fallback = items.filter((item) => item.status === "FALLBACK").length;

  console.log(
    `${group}: ${local}/${items.length} fully local, ` +
      `${partial} partial, ${fallback} fallback`,
  );
}

const localCount = results.filter((item) => item.status === "LOCAL").length;
const partialCount = results.filter((item) => item.status === "PARTIAL").length;

console.log(
  `\nOverall fully-local coverage: ${localCount}/${results.length} ` +
    `(${((localCount / results.length) * 100).toFixed(1)}%)`,
);
console.log(`Partial results: ${partialCount}`);
console.log(`Fallback results: ${results.length - localCount - partialCount}`);
