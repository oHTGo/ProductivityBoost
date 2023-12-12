import { EXTENSION_ID } from './constants';

describe('content script', () => {
  beforeAll(async () => {
    await jestPuppeteer.resetPage();
    await page.goto(`chrome-extension://${EXTENSION_ID}/src/pages/frame/index.html?src=https://ohtgo.me`);
  });

  it('should be able to open extension', async () => {
    await page.waitForSelector('iframe');
    const iframe = await page.$('iframe');
    const contentFrame = await iframe?.contentFrame();
    const title = await contentFrame?.$('h1');

    expect(title).toBeTruthy();
    expect(await title?.evaluate((node) => node.textContent)).toBe('Nguyen Nhat Huy');
  });
});
