// /services/browserService.js
const puppeteer = require('puppeteer');
const { logger } = require('../utils/logger');

async function fetchPageContent(url) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' , timeout:50000});
    
    // Remove unnecessary elements: scripts, styles, images, popups, etc.
    await page.evaluate(() => {
      document.querySelectorAll('script, style, img, iframe, .popup').forEach(el => el.remove());
    });

    // Get metadata and HTML
    const html = await page.content();
    const metadata = await page.evaluate(() => ({
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.content || '',
    }));

    await browser.close();
    logger.info(`Page content fetched successfully from ${url}`);
    return { html, metadata };
  } catch (error) {
    logger.error(`Error fetching page content: ${error.message}`);
    throw error;
  }
}

module.exports = { fetchPageContent };
