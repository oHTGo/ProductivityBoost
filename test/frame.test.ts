import mockServer from 'pptr-mock-server';
import { EXTENSION_ID, NETWORK_PRESETS } from './constants';

const mockSource = 'https://ohtgo.me';

describe('frame', () => {
  beforeEach(async () => {
    await jestPuppeteer.resetPage();

    const devTools = await page.target().createCDPSession();
    await devTools.send('Network.emulateNetworkConditions', NETWORK_PRESETS.WiFi);
  });

  it('should be able to open frame', async () => {
    await page.goto(`chrome-extension://${EXTENSION_ID}/src/pages/frame/index.html?src=${mockSource}`);

    await page.waitForSelector('iframe');
    const iframe = await page.$('iframe');
    const contentFrame = await iframe?.contentFrame();
    const title = await contentFrame?.$('h1');
    expect(await title?.evaluate((node) => node.textContent)).toBe('Nguyen Nhat Huy');
  });

  it('should be able to show loader when loading', async () => {
    const devTools = await page.target().createCDPSession();
    await devTools.send('Network.emulateNetworkConditions', NETWORK_PRESETS.GPRS);

    await page.goto(`chrome-extension://${EXTENSION_ID}/src/pages/frame/index.html?src=${mockSource}`, {
      waitUntil: 'domcontentloaded',
    });
    const loader = await page.$('.loader');
    expect(await loader?.isVisible()).toBe(true);

    await devTools.send('Network.emulateNetworkConditions', NETWORK_PRESETS.WiFi);
    await page.waitForNetworkIdle();
    expect(await loader?.isVisible()).toBe(false);
  });

  it('should be able to hide loader when 5s timeout', async () => {
    const mockRequest = await mockServer.init(page, {
      baseAppUrl: `chrome-extension://${EXTENSION_ID}`,
      baseApiUrl: mockSource,
    });
    mockRequest.get('/', 200, { delay: 10000 });

    const startTime = Date.now();

    // not use await here because we want to continue the test
    page.goto(`chrome-extension://${EXTENSION_ID}/src/pages/frame/index.html?src=${mockSource}`, {
      waitUntil: 'domcontentloaded',
    });

    await page.waitForSelector('.loader', { hidden: true });
    const endTime = Date.now();

    expect(endTime - startTime).toBeGreaterThanOrEqual(5000);
  }, 10000);
});
