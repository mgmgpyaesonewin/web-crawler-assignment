const { Cluster } = require('puppeteer-cluster');
const UserAgent = require('user-agents');
const puppeteer = require('puppeteer-extra');
const stealthPlugin = require('puppeteer-extra-plugin-stealth');
const callback = require('./callback');

puppeteer.use(stealthPlugin());

const minDelay = 2000; // Minimum delay in milliseconds (2 seconds)
const maxDelay = 4000; // Maximum delay in milliseconds (4 seconds)

async function randomDelay() {
  const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
  await new Promise((resolve) => setTimeout(resolve, delay));
}

async function scrapePage({ keywords, user_id }) {
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 2,
    puppeteer,
    puppeteerOptions: {
      headless: true,
    },
  });

  cluster.task(async ({ page, data: { url, user_id } }) => {
    try {
      // Set User Agent
      const userAgent = new UserAgent({ deviceCategory: 'desktop' });
      const randomUserAgent = userAgent.toString();
      console.log('randomUserAgent', randomUserAgent);
      await page.setUserAgent(randomUserAgent);

      // Set screen size
      await page.setViewport({
        width: 1280,
        height: 800,
        deviceScaleFactor: 1,
        isMobile: false,
        hasTouch: false,
        isLandscape: false,
      });

      await page.goto(url);
      const title = await page.title();
      console.log(`Title of ${url}: ${title}`);

      randomDelay(); // Random delay between requests to avoid bot detection

      const data = await page.evaluate(() => {
        const h3Elements = Array.from(document.querySelectorAll('h3'));
        return h3Elements.map((h3) => {
          const contentNode = h3.closest('div');
          const link = contentNode.querySelector('a')?.href;
          return {
            title: h3.textContent.trim(),
            link,
            htmlRaw: contentNode.outerHTML,
          };
        });
      });

      const counts = await page.evaluate(() => {
        const count = document.querySelector('div#appbar');
        return count.innerText;
      });

      const sponsored = await page.evaluate(() => Array.from(document.querySelectorAll('span'))
        .filter((span) => span.textContent.includes('Sponsored'))
        .map((sponsoredSpan) => sponsoredSpan.closest('div').outerHTML));

      // Send data to callback API
      callback({
        user_id,
        keyword: url.split('q=')[1],
        total_result: counts,
        contents: data,
      });

      return {
        user_id,
        keyword: url.split('q=')[1],
        total_result: counts,
        contents: data,
      };
    } catch (error) {
      if (error.name === 'TimeoutError') {
        console.error('Navigation timed out, retrying...');
        return cluster.queueTask(data);
      }
      console.error('Task failed:', error);
    }
  });

  // Explode keywords by comma and queue them into cluster as urls
  keywords.split(',').forEach((keyword) => {
    cluster.queue({
      url: `https://www.google.com/search?hl=en&q=${keyword}`,
      user_id,
    });
  });

  await cluster.idle();
  await cluster.close();
}

module.exports = scrapePage;
