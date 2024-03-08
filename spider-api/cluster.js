const { Cluster } = require('puppeteer-cluster');
const UserAgent = require('user-agents');
const puppeteer = require('puppeteer-extra');
const stealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(stealthPlugin());

const minDelay = 2000; // Minimum delay in milliseconds (2 seconds)
const maxDelay = 4000; // Maximum delay in milliseconds (4 seconds)

async function randomDelay() {
  const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
  await new Promise(resolve => setTimeout(resolve, delay));
}

(async () => {
  const cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_CONTEXT,
      maxConcurrency: 2,
      puppeteer,
      puppeteerOptions: {
        headless: false,
      }
  });

  cluster.task(async ({ page, data: url }) => {
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
          isLandscape: false
        });

        await page.goto(url);
        const title = await page.title();
        console.log(`Title of ${url}: ${title}`);

        randomDelay(); // Random delay between requests to avoid bot detection

        const data = await page.evaluate(() => {
          const h3Elements = Array.from(document.querySelectorAll('h3'));
          return h3Elements.map((h3) => {
            let contentNode = h3.closest('div');
            let link = contentNode.querySelector('a').href;
            return {
              title: h3.textContent.trim(),
              link,
              contentNode: contentNode.outerHTML
            }
          });
        });
      
        const counts = await page.evaluate(() => {
          const count = document.querySelector('div#appbar');
          return count.innerText;
        });
      
        const sponsored = await page.evaluate(() => {
          return Array.from(document.querySelectorAll('span'))
                      .filter((span) => span.textContent.includes('Sponsored'))
                      .map((sponsoredSpan) => sponsoredSpan.closest('div').outerHTML);
        });
      
        console.log('Extracted data:', data.length);
        console.log('Extracted counts:', counts);
        console.log('Extracted sponsored:', sponsored.length);
      }
      catch (error) {
        if (error.name === 'TimeoutError') {
          console.error('Navigation timed out, retrying...');
          return cluster.queueTask(data);
        } else {
            console.error('Task failed:', error);
        }
      }
  });

  cluster.queue('https://www.google.com/search?hl=en&q=ads');
  cluster.queue('https://www.google.com/search?hl=en&q=rubic');
  cluster.queue('https://www.google.com/search?hl=en&q=rog');
  cluster.queue('https://www.google.com/search?hl=en&q=asus');

  await cluster.idle();
  await cluster.close();
})();