const UserAgent = require('user-agents');
const callback = require('./callback');

async function setUserAgentAndViewport(page) {
  const userAgent = new UserAgent({ deviceCategory: 'desktop' });
  await page.setUserAgent(userAgent.toString());
  await page.setViewport({
    width: 1280,
    height: 800,
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,
    isLandscape: false,
  });
}

async function getTitleAndData(page) {
  const title = await page.title();

  const data = await page.evaluate(() => Array.from(document.querySelectorAll('h3')).map((h3) => {
    const contentNode = h3.closest('div');
    return {
      title: h3.textContent.trim(),
      link: contentNode.querySelector('a')?.href,
      htmlRaw: contentNode.outerHTML,
    };
  }));

  return { title, data };
}

async function getTotalCount(page) {
  await page.evaluate(() => document.querySelector('div#appbar')?.innerText || '');
}

async function getAdwordsCounts(page) {
  const adsCount = await page.evaluate(() => Array.from(document.querySelectorAll('span'))
    .filter((span) => span.textContent.includes('Sponsored'))
    .map((span) => span.textContent.trim())).length || 0;

  return { adsCount };
}

async function getTotalLinksCount(page) {
  await page.evaluate(() => Array.from(document.querySelectorAll('a')).length);
}

async function getContent(page) {
  await page.content();
}

async function scrapePage(page, url, user_id) {
  await setUserAgentAndViewport(page);
  await page.goto(url);

  const { data } = await getTitleAndData(page);
  const counts = await getTotalCount(page);
  const { adsCount } = await getAdwordsCounts(page);
  const linksCount = await getTotalLinksCount(page);
  const pageContent = await getContent(page);

  const result = {
    user_id,
    keyword: url.split('q=')[1],
    total_result: counts,
    contents: data,
    adsCount,
    linksCount,
    pageContent,
  };

  console.log('result', result);

  await callback(result);
  return result;
}

module.exports = {
  setUserAgentAndViewport,
  scrapePage,
  getTitleAndData,
  getTotalCount,
  getAdwordsCounts,
  getTotalLinksCount,
  getContent,
};
