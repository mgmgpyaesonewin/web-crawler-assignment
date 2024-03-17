const { Cluster } = require('puppeteer-cluster');
const puppeteer = require('puppeteer-extra');
const stealthPlugin = require('puppeteer-extra-plugin-stealth');
const { scrapePage } = require('./scraper');

puppeteer.use(stealthPlugin());

async function randomDelay(minDelay, maxDelay) {
  const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
  await new Promise((resolve) => setTimeout(resolve, delay));
}

async function queueKeywords({ keywords, user_id }) {
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 2,
    puppeteer,
    puppeteerOptions: {
      headless: 'new',
    },
  });

  cluster.task(async ({ page, data: { url, user_id } }) => {
    try {
      return await scrapePage(page, url, user_id);
    } catch (error) {
      console.error('Task failed:', error);
      if (error.name === 'TimeoutError') {
        console.error('Navigation timed out, retrying...');
        return cluster.queue({ url, user_id });
      }
    }
    return null;
  });

  // Explode keywords by comma and queue them into cluster as urls
  try {
    console.log('keywords', keywords);
    keywords.split(',').forEach((keyword) => {
      cluster.queue({
        url: `https://www.google.com/search?hl=en&q=${keyword}`,
        user_id,
      });
    });
  } catch (error) {
    console.error('Error while queuing tasks:', error);
  }

  await cluster.idle();
  await cluster.close();
}

// Initialize the cluster
// queueKeywords({ keywords: 'puppeteer, cluster, scraping', user_id: 1 });

module.exports = {
  queueKeywords,
  randomDelay,
};
