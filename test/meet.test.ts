describe('meet tool', () => {
  beforeEach(async () => {
    await jestPuppeteer.resetPage();
    await page.setBypassCSP(true);
  });

  it('should be disable turn off camera & turn off microphone', async () => {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    await page.goto('https://meet.google.com/fyk-guwb-van');

    const microButton = await page.waitForSelector('[jsname="Dg9Wp"] [data-is-muted]', {
      visible: true,
    });
    const cameraButton = await page.waitForSelector('[jsname="R3GXJb"] [data-is-muted]', { visible: true });

    expect(await microButton?.evaluate((e) => e.getAttribute('data-is-muted'))).toBe('false');
    expect(await cameraButton?.evaluate((e) => e.getAttribute('data-is-muted'))).toBe('false');
  });
});
