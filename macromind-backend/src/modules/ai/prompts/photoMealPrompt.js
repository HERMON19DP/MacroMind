function buildPhotoMealPrompt() {
  return `
Analyze the food image.

Identify all visible foods.

Estimate:

- food name
- quantity
- calories
- protein
- carbs
- fat

Return ONLY valid JSON.

{
  "foods":[
    {
      "name":"",
      "quantity":"",
      "calories":0,
      "protein":0,
      "carbs":0,
      "fat":0
    }
  ],
  "totals":{
    "calories":0,
    "protein":0,
    "carbs":0,
    "fat":0
  }
}
`;
}

module.exports = {
  buildPhotoMealPrompt,
};
