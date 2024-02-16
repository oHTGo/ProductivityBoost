describe('meet tool', () => {
  let url = 'https://meet.google.com';
  beforeAll(async () => {
    await jestPuppeteer.resetPage();
    await page.setBypassCSP(true);

    await page.goto(url);
    const createButton = await page.waitForSelector('[jsname="SkMU8"]', { visible: true });
    await createButton?.click();
    const startNowButton = await page.waitForSelector('[jsname="CuSyi"]', { visible: true });
    await startNowButton?.click();
    await page.waitForNavigation();
    url = page.url();
  });

  beforeEach(async () => {
    await jestPuppeteer.resetPage();
    await page.setBypassCSP(true);
  });

  it('should be disable turn off camera & turn off microphone & auto join', async () => {
    await page.goto(url, {
      waitUntil: 'networkidle0',
    });

    const microButton = await page.waitForSelector('[jsname="Dg9Wp"] [data-is-muted]', {
      visible: true,
    });
    const cameraButton = await page.waitForSelector('[jsname="R3GXJb"] [data-is-muted]', { visible: true });
    const joinButton = await page.waitForSelector('[jsname="Qx7uuf"]:enabled', { visible: true });

    expect(await microButton?.evaluate((e) => e.getAttribute('data-is-muted'))).toBe('false');
    expect(await cameraButton?.evaluate((e) => e.getAttribute('data-is-muted'))).toBe('false');
    expect(joinButton).toBeTruthy();
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
    });

    await page.goto(url, {
      waitUntil: 'networkidle0',
    });

    const microButton = await page.$('[jsname="Dg9Wp"] [data-is-muted]');
    const cameraButton = await page.$('[jsname="R3GXJb"] [data-is-muted]');
    const joinButton = await page.$('[jsname="Qx7uuf"]:enabled');

    expect(await microButton?.evaluate((e) => e.getAttribute('data-is-muted'))).toBe('true');
    expect(await cameraButton?.evaluate((e) => e.getAttribute('data-is-muted'))).toBe('true');
    expect(joinButton).toBeFalsy();
  });
});
