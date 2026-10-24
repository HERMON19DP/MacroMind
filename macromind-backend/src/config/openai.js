require("dotenv").config();

const OpenAI = require("openai");

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing required env variable: OPENAI_API_KEY");
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = client;
