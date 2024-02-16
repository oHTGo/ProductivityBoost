describe('meet tool', () => {
  let url = 'https://meet.google.com';
  beforeAll(async () => {
    await jestPuppeteer.resetPage();
    await page.setBypassCSP(true);

    const context = browser.defaultBrowserContext();
    await context.overridePermissions('https://meet.google.com', ['microphone', 'camera', 'notifications']);

    await page.goto(url);
    const createButton = await page.waitForSelector('[jsname="SkMU8"]', { visible: true });
    await createButton?.click();
    const startNowButton = await page.waitForSelector('[jsname="CuSyi"]', { visible: true });
    await startNowButton?.click();
    await page.waitForNavigation();
    url = page.url();
  }, 10000);

  beforeEach(async () => {
    await jestPuppeteer.resetPage();
    await page.setBypassCSP(true);
  });

  it('should be enable turn off camera & turn off microphone & auto join', async () => {
    const targets = browser.targets();
    const extension = await targets.find((target) => target.type() === 'service_worker')?.worker();
    await extension?.evaluate(() => {
      chrome.storage.local.set({
        MEET: {
          turnOffMicro: true,
          turnOffCamera: true,
          join: true,
        },
      });

      return true;
    });

    await page.goto(url, {
      waitUntil: 'networkidle0',
    });
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await page.waitForSelector('[jsname="Dg9Wp"] [data-is-muted="true"]', {
      visible: true,
    });
    await page.waitForSelector('[jsname="R3GXJb"] [data-is-muted="true"]', {
      visible: true,
    });
    expect(await page.$('[jsname="Qx7uuf"]')).toBeFalsy();
  }, 20000);
});
