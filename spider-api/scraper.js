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
  const counts = await page.evaluate(() => document.querySelector('div#appbar')?.innerText || '');
  return counts;
}

async function getAdwordsCounts(page) {
  const adsCount = await page.evaluate(() => Array.from(document.querySelectorAll('span'))
    .filter((span) => span.textContent.includes('Sponsored'))
    .map((span) => span.textContent.trim())).length || 0;

  return { adsCount };
}

async function getTotalLinksCount(page) {
  const linksCount = await page.evaluate(() => Array.from(document.querySelectorAll('a')).length);
  return linksCount;
}

async function getContent(page) {
  const content = await page.content();
  return content;
}

async function scrapePage(page, url, user_id) {
  await setUserAgentAndViewport(page);
  await page.goto(url);

  const { data } = await getTitleAndData(page);
  const counts = await getTotalCount(page);
  const { adsCount } = await getAdwordsCounts(page);
  const linksCount = await getTotalLinksCount(page);
  const content = await getContent(page);

  const result = {
    user_id,
    keyword: url.split('q=')[1],
    total_result: counts,
    contents: data,
    adsCount,
    linksCount,
    content,
  };

  console.log('result', result);

  callback(result);
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
