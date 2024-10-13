// /services/llmService.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { logger } = require('../utils/logger');
const { generate_promptForFindingSelectors } = require("../utils/prompts");
const dotenv = require("dotenv");

dotenv.config();

async function identifyCssSelectors(url,html, metadata) {
  try {
    // Mock LLM API call for CSS selector identification
    
    const prompt = generate_promptForFindingSelectors(url, html, metadata)
    const Selectors = await gemini_prompt(prompt);
    const cssSelectors = JSON.parse(Selectors);

    logger.info(`Identified CSS selectors: ${cssSelectors}`);
    console.log(cssSelectors)

    if(cssSelectors.totalPages == 0){
      logger.info(`Total pages not available in the provided CSS selectors. Making another call to LLM`)
      identifyCssSelectors(url,html,metadata)
    }
    return cssSelectors;
  } catch (error) {
    logger.error(`Error identifying CSS selectors: ${error.message}`);
    throw error;
  }
}

const gemini_prompt = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY
  // Make sure to include these imports:
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" ,generationConfig:{
    responseMimeType:"application/json"
  } })

  var result = await model.generateContent(prompt);
  result = result.response.text();
  result = result.replace("```json", "").replace("```", "");
  return result
};

module.exports = { identifyCssSelectors };
