const puppeteer = require('puppeteer-extra');
const UserAgent = require('user-agents');
const stealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(stealthPlugin());

(async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      `--proxy-server=http://185.199.229.156:7492`
    ]
  });
  const page = await browser.newPage();
  await page.authenticate({
    username: 'oytiacxc',
    password: 'oiqk9w099a9s'
  });

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

  // Navigate the page to a URL
  await page.goto('https://www.google.com/search?hl=en&q=ads');

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


  console.log('Extracted data:');
  console.log(data);

  console.log('Extracted counts:');
  console.log(counts);

  console.log('Extracted sponsored:');
  console.log(sponsored.length);
})();