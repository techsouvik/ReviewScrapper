// /controllers/reviewController.js
const { fetchPageContent } = require('../services/browserService');
const { identifyCssSelectors } = require('../services/llmService');
const { handlePagination } = require('../services/scrapingService');
const { logger } = require('../utils/logger');

async function getReviews(req, res) {
  const { url } = req.query;

  if(!url) {
    logger.error('URL is required');
    return res.status(400).json({ error: 'URL is required' });
  }
  try {
    const { html, metadata } = await fetchPageContent(url);
    const cssSelectors = await identifyCssSelectors(url, html, metadata);
    const reviews = await handlePagination(cssSelectors, url);
    
    res.status(200).json(reviews);
  } catch (error) {
    logger.error(`Failed to get reviews: ${error.message}`);
    res.status(500).json({ error: 'Failed to retrieve reviews' });
  }
}

module.exports = { getReviews };
