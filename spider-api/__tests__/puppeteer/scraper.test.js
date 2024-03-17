const {
  setUserAgentAndViewport,
  getTitleAndData,
  getTotalCount,
  getAdwordsCounts,
  getTotalLinksCount,
  getContent,
} = require('../../src/scraper');

describe('Browser Setting for scraping', () => {
  beforeEach(async () => {
    await setUserAgentAndViewport(page);
  });

  it('should set user agent', async () => {
    const userAgent = await page.evaluate(() => navigator.userAgent);
    expect(userAgent).toContain('Mozilla'); // Check if user agent string contains common browser identifier
  });

  it('should set viewport', async () => {
    const viewport = await page.viewport();
    expect(viewport.width).toBe(1280);
    expect(viewport.height).toBe(800);
  });
});

describe('Scraping Google Search Results', () => {
  beforeEach(async () => {
    await setUserAgentAndViewport(page);
    const isMock = process.env.TEST_MOCK_PUPPETEER;
    if (isMock) {
      await page.goto(`file://${__dirname}/mock/fake-google.html`);
    } else {
      await page.goto('https://www.google.com/search?hl=en&q=puppeteer');
    }
  });

  it('should get title and data', async () => {
    const pageTitle = await page.title();
    const { title, data } = await getTitleAndData(page);

    expect(title).toContain(pageTitle);
    expect(data.length).toBeGreaterThan(0);
  });

  it('should get total count', async () => {
    const counts = await getTotalCount(page);
    expect(counts).toContain('About');
  });

  it('should get adwords counts', async () => {
    const { adsCount } = await getAdwordsCounts(page);
    expect(adsCount).toBeGreaterThanOrEqual(0);
  });

  it('should get total links count', async () => {
    const linksCount = await getTotalLinksCount(page);
    expect(linksCount).toBeGreaterThan(0);
  });

  it('should get content', async () => {
    const content = await getContent(page);
    expect(content).toContain('html');
  });
});
