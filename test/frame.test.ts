import { EXTENSION_ID } from './constants';

describe('frame', () => {
  beforeEach(async () => {
    await jestPuppeteer.resetPage();
    await page.setOfflineMode(false);
  });

  it('should be able to open frame', async () => {
    await page.goto(`chrome-extension://${EXTENSION_ID}/src/pages/frame/index.html?src=https://ohtgo.me`);

    await page.waitForSelector('iframe');
    const iframe = await page.$('iframe');
    const contentFrame = await iframe?.contentFrame();
    const title = await contentFrame?.$('h1');
    expect(await title?.evaluate((node) => node.textContent)).toBe('Nguyen Nhat Huy');
  });

  it('should be able to show loader when loading', async () => {
    await page.setOfflineMode(true);
    await page.goto(`chrome-extension://${EXTENSION_ID}/src/pages/frame/index.html?src=https://ohtgo.me`, {
      waitUntil: 'domcontentloaded',
    });
    const loader = await page.$('.loader');
    expect(await loader?.isVisible()).toBe(true);

    await page.setOfflineMode(false);
    await page.waitForNetworkIdle();
    expect(await loader?.isVisible()).toBe(false);
  });
});
