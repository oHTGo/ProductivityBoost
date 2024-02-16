const url = 'https://meet.google.com/nxa-aekv-qka';

describe('meet tool', () => {
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

    await new Promise((resolve) => setTimeout(resolve, 1000));
    await page.goto(url, {
      waitUntil: 'networkidle0',
    });
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const microButton = await page.$('[jsname="Dg9Wp"] [data-is-muted');
    const cameraButton = await page.$('[jsname="R3GXJb"] [data-is-muted]');
    const joinButton = await page.$('[jsname="Qx7uuf"]:enabled');

    expect(await microButton?.evaluate((e) => e.getAttribute('data-is-muted'))).toBe('true');
    expect(await cameraButton?.evaluate((e) => e.getAttribute('data-is-muted'))).toBe('true');
    expect(joinButton).toBeFalsy();
  }, 20000);
});
