// /services/scrapingService.js
const { logger } = require('../utils/logger');
const puppeteer = require('puppeteer');

const handlePagination = async (cssSelectors, url) => {

    const review = cssSelectors.review;
    const title = cssSelectors.title;
    const body = cssSelectors.body;
    const rating = cssSelectors.rating;
    const reviewer = cssSelectors.reviewer;
    const paginationNextBtn = cssSelectors.paginationNextBtn;
    const totalPages = cssSelectors.totalPages;
  
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
  
    // Block unnecessary resources to speed up the process
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      const resourceType = request.resourceType();
      if (['image', 'stylesheet', 'font'].includes(resourceType)) {
        request.abort();
      } else {
        request.continue();
      }
    });
  
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  
      // Remove unnecessary elements to speed up scraping
      await page.evaluate(() => {
        document.querySelectorAll('img, script, style').forEach(el => el.remove());
      });
  
      let reviews = [];
      let reviewsCount = 0;
      let currentPage = 1;
  
      while (currentPage <= totalPages) {
        logger.info(`Scraping page ${currentPage}`);
  
        // Wait for reviews to load on the current page
        await page.waitForSelector(review, { timeout: 60000 });
  
        // Extract reviews on the current page
        const newReviews = await page.evaluate((reviewSelector, titleSelector, bodySelector, ratingSelector, reviewerSelector) => {
          const reviewsArr = [];
          const reviewElements = document.querySelectorAll(reviewSelector);
  
          reviewElements.forEach((reviewEl) => {
            // Extract rating (with possible improvements)
            let ratingValue = reviewEl.querySelector(ratingSelector);
            if (ratingValue) {
              ratingValue = ratingValue.innerText;
            }
  
            reviewsArr.push({
              title: reviewEl.querySelector(titleSelector)?.innerText || 'No title',
              body: reviewEl.querySelector(bodySelector)?.innerText || 'No body',
              rating: ratingValue,
              reviewer: reviewEl.querySelector(reviewerSelector)?.innerText || 'Anonymous',
            });
          });
  
          return reviewsArr;
        }, review, title, body, rating, reviewer);
  
        reviews = reviews.concat(newReviews);
        reviewsCount += newReviews.length;
  
        // Check if there's a next page and click "Next"
        const nextPageExists = await page.evaluate((paginationBtn) => {
          const nextButton = document.querySelector(paginationBtn);
          if (nextButton && !nextButton.classList.contains('jdgm-disabled')) {
            nextButton.scrollIntoView();
            nextButton.click();
            return true;
          }
          return false;
        }, paginationNextBtn);
  
        if (nextPageExists) {
          // Wait for the next set of reviews to load
          await new Promise(resolve => setTimeout(resolve, 2000)); // Add a 2-second delay to ensure content loads
        } else {
          break; // No more pages, exit the loop
        }
  
        currentPage++;
      }
  
      await browser.close();
  
      return {
        reviews_count: reviewsCount,
        reviews
      };
  
    } catch (error) {
      await browser.close();
      logger.error('Error scraping reviews:', error);
      return { error: 'Failed to scrape reviews' };
    }
  };
module.exports = { handlePagination };
